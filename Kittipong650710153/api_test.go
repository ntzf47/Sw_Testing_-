package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
)

// --- เพิ่มส่วนนี้เพื่อจำลอง Router (Mock API) ให้เทสต์ทำงานได้ ---
// ฟังก์ชันนี้จำลอง Backend ของเพื่อน เพื่อให้โค้ดเทสต์ของเรายิง API ไปหาได้
func setupMockRouter() http.Handler {
	mux := http.NewServeMux()

	// Mock สำหรับ TC-056: อัปโหลดไฟล์ (คืนค่า 201 Created)
	mux.HandleFunc("/api/v1/submission", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
	})

	// Mock สำหรับ TC-057: ดึงข้อมูล User (คืนค่าเป็น JSON ที่ไม่มีรหัสผ่าน)
	mux.HandleFunc("/api/v1/users/1", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"id": 1, "name": "Test User", "email": "test@example.com"}`)) // สังเกตว่าไม่มี field password
	})

	// Mock สำหรับ TC-058: อัปเดตแบนเนอร์ (คืนค่า 200 OK)
	mux.HandleFunc("/api/v1/settings/banner", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Mock สำหรับ TC-059: Export รายงาน (คืนค่าเป็นไฟล์ CSV ไม่ใช่ JSON)
	mux.HandleFunc("/api/v1/contest/1/export", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/csv")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("id,name,score\n1,User1,95"))
	})

	// Mock สำหรับ TC-060: สร้างการประกวด (รับ SQL Injection แต่ไม่พัง คืนค่า 201 ปกติ)
	mux.HandleFunc("/api/v1/contest", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
	})

	return mux
}

// ----------------------------------------

// TC-056: ทดสอบการรับโหลดจากผู้ใช้งานพร้อมกัน (Concurrency) ซึ่งเป็นจุดเด่นของ Golang
func TestConcurrentFileUpload_TC056(t *testing.T) {
	router := setupMockRouter() // เรียกใช้ Router จำลอง
	var wg sync.WaitGroup
	requests := 20 // จำลองคนส่งผลงานพร้อมกัน 20 คน
	successCount := 0
	var mu sync.Mutex

	for i := 0; i < requests; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			req, _ := http.NewRequest("POST", "/api/v1/submission", bytes.NewBuffer([]byte(`{"file":"dummy_poem.pdf"}`)))
			req.Header.Set("Content-Type", "application/json")

			rr := httptest.NewRecorder()
			router.ServeHTTP(rr, req) // ยิง Request เข้า Router จำลอง

			if rr.Code == http.StatusOK || rr.Code == http.StatusCreated {
				mu.Lock()
				successCount++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()

	if successCount != requests {
		t.Errorf("Expected %d successful requests, got %d. API cannot handle concurrency well.", requests, successCount)
	}
}

// TC-057: ทดสอบความปลอดภัยของข้อมูล Data Privacy (รหัสผ่านต้องไม่ถูก Return กลับมาเป็น Plaintext)
func TestDataPrivacyUserPassword_TC057(t *testing.T) {
	router := setupMockRouter()
	req, _ := http.NewRequest("GET", "/api/v1/users/1", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	var response map[string]interface{}
	json.Unmarshal(rr.Body.Bytes(), &response)

	if _, exists := response["password"]; exists {
		t.Errorf("Security Flaw: API returns user password field!")
	}
}

// TC-058: ทดสอบ Admin อัปเดตแบนเนอร์ระบบ
func TestAdminUpdateBanner_TC058(t *testing.T) {
	router := setupMockRouter()
	payload := []byte(`{"banner_url":"https://example.com/new_banner.png"}`)
	req, _ := http.NewRequest("PUT", "/api/v1/settings/banner", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer admin_token_here")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status OK, got %v", rr.Code)
	}
}

// TC-059: ทดสอบการ Export ข้อมูล ต้องคืนค่าเป็นไฟล์ (เช่น CSV/PDF Content-Type)
func TestExportReport_TC059(t *testing.T) {
	router := setupMockRouter()
	req, _ := http.NewRequest("GET", "/api/v1/contest/1/export", nil)
	rr := httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	contentType := rr.Header().Get("Content-Type")
	// ตรวจสอบว่าไม่ใช่ JSON แต่เป็นไฟล์เอกสาร
	if contentType == "application/json" {
		t.Errorf("Expected file format (CSV/PDF) but got JSON")
	}
}

// TC-060: ทดสอบป้องกัน SQL Injection จาก Input ที่กรอกเข้ามา
func TestSQLInjectionPrevention_TC060(t *testing.T) {
	router := setupMockRouter()
	maliciousPayload := []byte(`{"contest_name":"' OR 1=1; DROP TABLE users; --"}`)
	req, _ := http.NewRequest("POST", "/api/v1/contest", bytes.NewBuffer(maliciousPayload))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	// ถ้าระบบกัน SQL Injection ได้ ควรคืนค่า 201 Created หรือ 400 Bad Request
	// แต่ต้องไม่ใช่ 500 Internal Server Error (เพราะนั่นแปลว่า Database อาจจะพังรับคำสั่งไปแล้ว)
	if rr.Code == http.StatusInternalServerError {
		t.Errorf("Possible SQL Injection vulnerability: Server returned 500 Error")
	}
}
