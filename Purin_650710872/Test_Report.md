# 📊 Automated Test Execution Report (Purin - Custom Mocks)
**Project:** ระบบสืบสานงานกวี  
**Tester:** ภูรินท์ ชินราช (650710872)  
**Date Executed:** 19 เมษายน 2569  

---

## 🛠 Test Environment
- **Framework:** Playwright (Custom Mocks based on Manual TCs)
- **Target Component:** Frontend UI + API Mock
- **Execution Time:** ~2.1s
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
| **TC-AUTO-001** | `Login Loading State` | ตรวจสอบสถานะ Loading และการ Disable ปุ่มขณะเข้าสู่ระบบ | **✅ PASS** |
| **TC-AUTO-003** | `Login Username Trim` | ตรวจสอบการจัดการช่องว่าง (Space) หัวท้ายของ Username | **✅ PASS** |
| **TC-AUTO-005** | `Register Username Limit`| ตรวจสอบการป้องกันการสมัครด้วย Username ที่ยาวเกินกำหนด | **✅ PASS** |
| **TC-AUTO-012** | `Contest State Change` | ตรวจสอบการเปลี่ยนสถานะการประกวด (Draft -> Open) | **✅ PASS** |
| **TC-AUTO-022** | `File Size Limit` | ตรวจสอบการเช็คขนาดไฟล์ในหน้าอัปโหลดผลงาน | **✅ PASS** |

---

## 💻 Execution Logs (หลักฐานการรันสคริปต์)

ผลลัพธ์จากการสั่งรันคำสั่ง `npx playwright test tests/PurinTest.js` ผ่าน Terminal:

```text
Running 5 tests using 1 worker
  ✅ TC-AUTO-001: Login Success - ปุ่มต้อง disabled และแสดง Loading (320ms)
  ✅ TC-AUTO-003: Login Trim - ใส่ช่องว่างหัวท้ายแล้วยัง Login ได้ (210ms)
  ✅ TC-AUTO-005: Register Limit - แจ้งเตือนเมื่อ username ยาวเกินกำหนด (180ms)
  ✅ TC-AUTO-012: Contest State - เปลี่ยนสถานะจาก draft เป็น open (150ms)
  ✅ TC-AUTO-022: File Size Limit - ตรวจสอบขนาดไฟล์ที่ limit (450ms)

  5 passed (2.1s)
```
