# 📊 Automated Test Execution Report (Kittipong - Custom Mocks)
**Project:** ระบบบริหารการประกวดกิจกรรม  
**Tester:** กิตติพงษ์ (650710153)  
**Date Executed:** 19 เมษายน 2569  

---

## 🛠 Test Environment
- **Framework:** Playwright (Custom Mocks based on Manual TCs)
- **Target Component:** Frontend UI + API Mock
- **Execution Time:** ~2.5s
- **Total Test Cases:** 5 (Selected from Manual README)

---

## 📈 Test Summary

| Total | Passed (✅) | Failed (❌) | Skipped (⏭️) | Pass Rate |
| :---: | :---: | :---: | :---: | :---: |
| **5** | **5** | **0** | **0** | **100%** |

---

## 📋 Detailed Test Results (Mapping to README)

| Test Case ID | Test Function Name | Objective (วัตถุประสงค์) | Result |
| :--- | :--- | :--- | :---: |
| **TC-AUTO-002** | `Empty Project Name` | สร้างประกวดโดยไม่ตั้งชื่อโครงการ | **✅ PASS** |
| **TC-AUTO-003** | `Large File Upload` | อัปโหลดโปสเตอร์ขนาดเกินกำหนด | **✅ PASS** |
| **TC-AUTO-008** | `Invite Non-existent User` | เชิญอีเมลที่ไม่ได้สมัครสมาชิกเป็นผู้ช่วย | **✅ PASS** |
| **TC-AUTO-027** | `Data Privacy` | ตรวจสอบว่า API ไม่ส่งรหัสผ่านผู้ใช้ออกมา | **✅ PASS** |
| **TC-AUTO-030** | `SQL Injection Prevention` | ป้องกัน SQL Injection ตอนสร้างโครงการ | **✅ PASS** |

---

## 💻 Execution Logs (หลักฐานการรันสคริปต์)

ผลลัพธ์จากการสั่งรันคำสั่ง `npx playwright test tests/KittipongTest.js` ผ่าน Terminal:

```text
Running 5 tests using 1 worker
  ✅ TC-AUTO-002: สร้างประกวดโดยไม่ตั้งชื่อโครงการ (310ms)
  ✅ TC-AUTO-003: อัปโหลดโปสเตอร์ขนาดเกินกำหนด (480ms)
  ✅ TC-AUTO-008: เชิญอีเมลที่ไม่ได้สมัครสมาชิกเป็นผู้ช่วย (260ms)
  ✅ TC-AUTO-027: Data Privacy - เช็คว่า API ไม่ส่งรหัสผ่าน (150ms)
  ✅ TC-AUTO-030: ป้องกัน SQL Injection ตอนสร้างโครงการ (240ms)

  5 passed (2.5s)
```