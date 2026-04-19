# Software Testing ภูรินท์ ชินราช 650710872

## 📄 Manual Test Cases

| Test Case ID | โมดูล | ประเภท | คำอธิบาย | ขั้นตอนการทดสอบ | ผลลัพธ์ที่คาดหวัง |
|-------------|------|--------|----------|------------------|------------------|
| TC-PUP-001 | Login | UX | ปุ่ม Login มี loading | 1. กรอกข้อมูลถูกต้อง <br> 2. กด Login | มี loading และปุ่มถูก disable |
| TC-PUP-002 | Login | Edge | กด Enter แทนคลิกปุ่ม | 1. กรอกข้อมูล <br> 2. กด Enter | สามารถ login ได้ |
| TC-PUP-003 | Login | Negative | ใส่ช่องว่างก่อน/หลัง username | 1. ใส่ " user " <br> 2. login | ระบบ trim แล้ว login ได้ |
| TC-PUP-004 | Register | Boundary | username ยาวสูงสุด | กรอก username ตาม max length | สมัครได้ |
| TC-PUP-005 | Register | Boundary | username เกิน limit | กรอกเกิน | ระบบ reject |
| TC-PUP-006 | Register | Edge | ใช้ภาษาไทย | กรอกชื่อไทย | ระบบรองรับ |
| TC-PUP-007 | Register | Edge | ใช้ emoji | ใส่ 😎🔥 | ระบบ validate |
| TC-PUP-008 | Register | UX | error message ชัดเจน | ใส่ข้อมูลผิด | มีข้อความ error ชัดเจน |
| TC-PUP-009 | Profile | UX | กด save แล้วมี feedback | แก้ไขโปรไฟล์ | มี success message |
| TC-PUP-010 | Profile | Edge | refresh ระหว่าง edit | แก้ข้อมูลแล้ว refresh | ข้อมูลไม่หาย |
| TC-PUP-011 | Contest | Workflow | create แต่ไม่ publish | create แล้วออก | user ไม่เห็น |
| TC-PUP-012 | Contest | State | draft → open → close | เปลี่ยนสถานะ | state ถูกต้อง |
| TC-PUP-013 | Contest | UX | save draft | กด save draft | บันทึกสำเร็จ |
| TC-PUP-014 | Contest | Edge | start = today | ใส่วันที่ปัจจุบัน | ระบบรองรับ |
| TC-PUP-015 | Contest | Boundary | ชื่อ contest = 1 ตัว | กรอก 1 ตัว | ผ่าน/ไม่ผ่านตาม rule |
| TC-PUP-016 | Submit | UX | submit แล้ว redirect | submit งาน | ไปหน้าสำเร็จ |
| TC-PUP-017 | Submit | Edge | กด back หลัง submit | submit แล้ว back | ไม่ส่งซ้ำ |
| TC-PUP-018 | Submit | Workflow | submit → edit → submit | ทำ flow | ระบบอัปเดต |
| TC-PUP-019 | Submit | Boundary | เนื้อหา 1 ตัว | submit | ผ่าน/ไม่ผ่าน |
| TC-PUP-020 | File Upload | UX | progress bar | upload ไฟล์ใหญ่ | มี progress |
| TC-PUP-021 | File Upload | Edge | cancel upload | upload แล้ว cancel | หยุดอัปโหลด |
| TC-PUP-022 | File Upload | Boundary | ขนาด = limit | upload | ผ่าน |
| TC-PUP-023 | Search | UX | auto suggestion | พิมพ์ keyword | มี suggestion |
| TC-PUP-024 | Search | Edge | ค้นหา space | " " | ไม่ crash |
| TC-PUP-025 | Search | Edge | case insensitive | "PoEm" | เจอผล |
| TC-PUP-026 | Notification | UX | badge แจ้งเตือน | มี event ใหม่ | badge เพิ่ม |
| TC-PUP-027 | Notification | Edge | หลาย tab | trigger แจ้งเตือน | sync |
| TC-PUP-028 | Logout | UX | logout | กด logout | ไปหน้า login |
| TC-PUP-029 | Session | Edge | timeout | idle นาน | logout auto |
| TC-PUP-030 | Navigation | UX | click รัว | กดเมนูรัว | ไม่ crash |

---