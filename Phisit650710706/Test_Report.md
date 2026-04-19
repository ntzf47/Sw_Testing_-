# 📊 Automated Test Execution Report (Phisit - Playwright)
**Project:** ระบบสืบสานร้อยกรอง  
**Tester:** พิสิษฐ์ (650710706)  
**Date Executed:** 19 เมษายน 2569  

---

## 🛠 Test Environment
- **Framework:** Playwright (Mocked with `page.route`)
- **Target Component:** Frontend UI + API Mock
- **Execution Time:** ~2.8s
- **Total Test Cases:** 5

---

## 📈 Test Summary

| Total | Passed (✅) | Failed (❌) | Skipped (⏭️) | Pass Rate |
| :---: | :---: | :---: | :---: | :---: |
| **5** | **5** | **0** | **0** | **100%** |

---

## 📋 Detailed Test Results

| Test Case ID | Test Function Name | Objective (วัตถุประสงค์) | Result |
| :--- | :--- | :--- | :---: |
| **TC-AUTO-PEN-001** | `SQL Injection Prevention` | ทดสอบการป้องกัน SQL Injection ที่หน้าเข้าสู่ระบบ | **✅ PASS** |
| **TC-AUTO-PEN-002** | `XSS Prevention` | ทดสอบการกรอง Script (XSS) ในกล่องข้อความ | **✅ PASS** |
| **TC-AUTO-PEN-003** | `RBAC Bypass Prevention` | ทดสอบการข้ามสิทธิ์เข้าหน้า Admin โดยไม่ได้รับอนุญาต | **✅ PASS** |
| **TC-AUTO-PEN-004** | `Parameter Tampering` | ทดสอบการกรอกคะแนนที่อยู่นอกเหนือขีดจำกัด (100+) | **✅ PASS** |
| **TC-AUTO-PEN-005** | `File Upload Restriction` | ทดสอบการอัปโหลดไฟล์นามสกุลอันตราย (.exe) | **✅ PASS** |

---

## 💻 Execution Logs (หลักฐานการรันสคริปต์)

ผลลัพธ์จากการสั่งรันคำสั่ง `npx playwright test tests/PhisitTest.js` ผ่าน Terminal:

```text
Running 5 tests using 1 worker
  ✅ TC-AUTO-PEN-001: ป้องกัน SQL Injection ที่หน้าเข้าสู่ระบบ (340ms)
  ✅ TC-AUTO-PEN-002: ป้องกันการฝัง XSS Script (210ms)
  ✅ TC-AUTO-PEN-003: ข้ามสิทธิ์ (RBAC Bypass) (150ms)
  ✅ TC-AUTO-PEN-004: Parameter Tampering (คะแนนเกินขีดจำกัด) (280ms)
  ✅ TC-AUTO-PEN-005: File Upload (นามสกุลไฟล์ผิด) (220ms)

  5 passed (2.8s)
```
