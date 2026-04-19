# Software Testing ภูรินท์ ชินราช 650710872

---

## 📄 1. Manual Test Cases (Renumbered 1-30)

| Test Case ID | โมดูล | ประเภท | คำอธิบาย | ขั้นตอนการทดสอบ | ผลลัพธ์ที่คาดหวัง |
|--------------|------|--------|-----------|------------------|-------------------|
| TC-001 | Login | UX | ปุ่ม Login มี loading | 1. เปิดหน้า Login <br> 2. กรอก username/password ถูกต้อง <br> 3. กด Login | มี loading และปุ่มถูก disable |
| TC-002 | Login | Edge | กด Enter แทนคลิกปุ่ม | 1. เปิดหน้า Login <br> 2. กรอกข้อมูล <br> 3. กด Enter | สามารถ login ได้ |
| TC-003 | Login | Edge | ใส่ช่องว่างก่อน/หลัง username | 1. เปิดหน้า Login <br> 2. ใส่ " user " <br> 3. กด Login | ระบบ trim แล้ว login ได้ |
| TC-004 | Register | Boundary | username ยาวสูงสุด | 1. เปิดหน้า Register <br> 2. กรอก username ตาม max length <br> 3. submit | สมัครได้ |
| TC-005 | Register | Boundary | username เกิน limit | 1. เปิดหน้า Register <br> 2. กรอกเกิน limit <br> 3. submit | ระบบ reject |
| TC-006 | Register | Edge | ใช้ภาษาไทย | 1. เปิดหน้า Register <br> 2. กรอกชื่อภาษาไทย <br> 3. submit | ระบบรองรับ |
| TC-007 | Register | Edge | ใช้ emoji | 1. เปิดหน้า Register <br> 2. ใส่ 😎🔥 <br> 3. submit | ระบบ validate |
| TC-008 | Register | UX | error message ชัดเจน | 1. เปิดหน้า Register <br> 2. กรอกข้อมูลผิด <br> 3. submit | มี error ชัดเจน |
| TC-009 | Profile | UX | กด save แล้วมี feedback | 1. เปิดหน้า Profile <br> 2. แก้ไขข้อมูล <br> 3. กด Save | มี success message |
| TC-010 | Profile | Edge | refresh ระหว่าง edit | 1. เปิด Profile <br> 2. แก้ข้อมูล <br> 3. refresh | ข้อมูลไม่หายโดยไม่ตั้งใจ |
| TC-011 | Contest | Workflow | create แต่ไม่ publish | 1. สร้าง contest <br> 2. ไม่กด publish | user ไม่เห็น |
| TC-012 | Contest | State | draft → open → close | 1. สร้าง contest <br> 2. เปลี่ยน state | state ถูกต้อง |
| TC-013 | Contest | UX | save draft | 1. เปิดหน้า create <br> 2. กด save draft | บันทึกสำเร็จ |
| TC-014 | Contest | Edge | ใช้วันที่ปัจจุบัน | 1. ใส่ start = today <br> 2. submit | ระบบรองรับ |
| TC-015 | Contest | Boundary | ชื่อ contest = 1 ตัว | 1. กรอก 1 ตัวอักษร <br> 2. submit | ผ่าน/ไม่ผ่านตาม rule |
| TC-016 | Submit | UX | submit แล้ว redirect | 1. submit งาน <br> 2. ตรวจ redirect | ไปหน้าสำเร็จ |
| TC-017 | Submit | Edge | กด back หลัง submit | 1. submit <br> 2. กด back | ไม่ส่งซ้ำ |
| TC-018 | Submit | Workflow | submit → edit → submit | 1. submit <br> 2. edit <br> 3. submit | อัปเดตข้อมูล |
| TC-019 | Submit | Boundary | เนื้อหา 1 ตัว | 1. กรอก 1 ตัว <br> 2. submit | ผ่าน/ไม่ผ่านตาม rule |
| TC-020 | File Upload | UX | progress bar | 1. upload ไฟล์ใหญ่ | มี progress |
| TC-021 | File Upload | Edge | cancel upload | 1. upload <br> 2. cancel | หยุดอัปโหลด |
| TC-022 | File Upload | Boundary | ขนาด = limit | 1. upload ไฟล์ขนาด limit | ผ่าน |
| TC-023 | Search | UX | auto suggestion | 1. พิมพ์ keyword | มี suggestion |
| TC-024 | Search | Edge | ค้นหาด้วย space | 1. ค้นหา " " | ไม่ crash |
| TC-025 | Search | Edge | case insensitive | 1. ค้นหา "PoEm" | เจอผล |
| TC-026 | Notification | UX | badge แจ้งเตือน | 1. มี event ใหม่ | badge เพิ่ม |
| TC-027 | Notification | Edge | หลาย tab | 1. เปิดหลาย tab <br> 2. trigger แจ้งเตือน | sync ทุก tab |
| TC-028 | Logout | UX | logout redirect | 1. กด logout | ไปหน้า login |
| TC-029 | Session | Edge | session timeout | 1. idle นาน | logout auto |
| TC-030 | Navigation | UX | คลิกเร็ว | 1. click menu รัวๆ | ไม่ crash |

---

## 📄 2. การใช้งาน Script ทดสอบอัตโนมัติ

### วิธีการรัน (How to Run)
1. ติดตั้งไลบรารี Playwright:
   ```bash
   cd playwright-tests
   npm install
   ```
2. ทำการรันโค้ด Playwright ทดสอบระบบ (พร้อม Mock API อัตโนมัติ):
   ```bash
   npx playwright test tests/PurinTest.js
   ```

### กรณีทดสอบที่ครอบคลุม (Custom Mocked Tests):
- **TC-AUTO-001:** Login Loading (Verify button disabled state)
- **TC-AUTO-003:** Login Trim (Verify trim functionality for username)
- **TC-AUTO-005:** Register Limit (Verify rejection for long usernames)
- **TC-AUTO-012:** Contest State (Verify state transition feedback)
- **TC-AUTO-022:** File Size Limit (Verify limit validation)
