# 📊 Automated Test Execution Report (Chonpasu - Custom Mocks)
**Project:** ระบบบริหารจัดการร้อยกรอง  
**Tester:** ชลพศุ เชื่อมวราศาสตร์ (650710234)  
**Date Executed:** 19 เมษายน 2569  

---

## 🛠 Test Environment
- **Framework:** Playwright (Custom Mocks based on Manual TCs)
- **Target Component:** Frontend UI + API Mock
- **Execution Time:** ~2.3s
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
| **TC-AUTO-002** | `Duplicate Email` | สมัครสมาชิกด้วยอีเมลซ้ำ | **✅ PASS** |
| **TC-AUTO-005** | `Wrong Password` | เข้าสู่ระบบด้วยรหัสผ่านผิด | **✅ PASS** |
| **TC-AUTO-012** | `Invalid File Upload` | ส่งผลงานด้วยไฟล์นามสกุลผิด (.exe) | **✅ PASS** |
| **TC-AUTO-013** | `File Size Limit` | ส่งผลงานโดยไฟล์เกินขนาดกำหนด | **✅ PASS**|
| **TC-AUTO-026** | `Score Limit` | ให้คะแนนเกินกว่าเกณฑ์กำหนด | **✅ PASS** |

---

## 💻 Execution Logs (หลักฐานการรันสคริปต์)

ผลลัพธ์จากการสั่งรันคำสั่ง `npx playwright test tests/ChonpasuTest.js` ผ่าน Terminal:

```text
Running 5 tests using 1 worker
  ✅ TC-AUTO-002: การลงทะเบียนด้วยอีเมลซ้ำ (350ms)
  ✅ TC-AUTO-005: เข้าสู่ระบบด้วยรหัสผ่านผิด (280ms)
  ✅ TC-AUTO-012: ส่งผลงานด้วยไฟล์นามสกุลผิด (.exe) (240ms)
  ✅ TC-AUTO-013: ส่งผลงานโดยไฟล์เกินขนาดกำหนด (450ms)
  ✅ TC-AUTO-026: ให้คะแนนเกินกว่าเกณฑ์กำหนด (220ms)

  5 passed (2.3s)
```
