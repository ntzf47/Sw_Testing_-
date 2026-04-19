# 📊 Automated Test Execution Report (Nutt - Custom Mocks)
**Project:** ระบบส่งและตรวจบทกลอน  
**Tester:** นายณัฏฐ์ สิงห์สถิตย์ (660710170)  
**Date Executed:** 19 เมษายน 2569  

---

## 🛠 Test Environment
- **Framework:** Playwright (Custom Mocks based on Manual TCs)
- **Target Component:** Frontend UI + API Mock
- **Execution Time:** ~2.0s
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
| **TC-AUTO-001** | `Login No Data` | เข้าสู่ระบบโดยไม่กรอกข้อมูล | **✅ PASS** |
| **TC-AUTO-003** | `Duplicate Email` | ใช้ email ซ้ำในการสมัครสมาชิก | **✅ PASS** |
| **TC-AUTO-004** | `Short Password` | สมัครด้วยรหัสผ่านสั้นเกินไป | **✅ PASS** |
| **TC-AUTO-018** | `File Size Limit` | อัปโหลดไฟล์ใหญ่เกินที่ระบบกำหนด | **✅ PASS** |
| **TC-AUTO-023** | `Invalid Score Input` | ใส่คะแนนประเมินเป็นตัวอักษร | **✅ PASS** |

---

## 💻 Execution Logs (หลักฐานการรันสคริปต์)

ผลลัพธ์จากการสั่งรันคำสั่ง `npx playwright test tests/NuttTest.js` ผ่าน Terminal:

```text
Running 5 tests using 1 worker
  ✅ TC-AUTO-001: Login โดยไม่กรอกข้อมูล (320ms)
  ✅ TC-AUTO-003: ใช้ email ซ้ำในการสมัคร (180ms)
  ✅ TC-AUTO-004: สมัครด้วยรหัสผ่านสั้นเกินไป (150ms)
  ✅ TC-AUTO-018: อัปโหลดไฟล์ใหญ่เกิน limit (420ms)
  ✅ TC-AUTO-023: ใส่คะแนนประเมินเป็นตัวอักษร (210ms)

  5 passed (2.0s)
```
