#  Software Testing นายณัฏฐ์  สิงห์สถิตย์660710170

## (Manual Test Cases)
| Test Case ID | โมดูล / ฟังก์ชัน | ประเภท   | คำอธิบาย                | ขั้นตอนการทดสอบ                                                | ผลลัพธ์ที่คาดหวัง            | สถานะ |
| ------------ | ---------------- | -------- | ----------------------- | -------------------------------------------------------------- | ---------------------------- | ----- |
| TC-PEN-031   | Login            | Negative | Login โดยไม่กรอกข้อมูล  | 1. ไปหน้า Login<br>2. ไม่กรอก Username/Password<br>3. กด Login | ระบบแจ้งว่าต้องกรอกข้อมูล    | N/A   |
| TC-PEN-032   | Login            | Positive | Login ด้วยข้อมูลถูกต้อง | 1. กรอก Username/Password ถูกต้อง<br>2. กด Login               | เข้าสู่ระบบสำเร็จ            | N/A   |
| TC-PEN-033   | Register         | Negative | ใช้ email ซ้ำ           | 1. กรอก email ที่เคยสมัครแล้ว<br>2. กดสมัคร                    | ระบบแจ้งว่า email ถูกใช้แล้ว | N/A   |
| TC-PEN-034   | Register         | Negative | รหัสผ่านสั้นเกินไป      | 1. กรอก password 3 ตัวอักษร<br>2. กดสมัคร                      | ระบบไม่ยอมรับ                | N/A   |
| TC-PEN-035   | Register         | Positive | รหัสผ่านตามเงื่อนไข     | 1. กรอก password ตาม policy<br>2. กดสมัคร                      | สมัครสำเร็จ                  | N/A   |
| TC-PEN-036   | Profile          | Positive | แก้ไขโปรไฟล์สำเร็จ      | 1. ไปหน้า Profile<br>2. แก้ไขข้อมูล<br>3. กด Save              | ข้อมูลอัปเดตสำเร็จ           | N/A   |
| TC-PEN-037   | Profile          | Negative | ใส่ข้อมูลยาวเกิน limit  | 1. ใส่ชื่อยาวมาก<br>2. กด Save                                 | ระบบแจ้ง error               | N/A   |
| TC-PEN-038   | Contest          | Positive | บันทึกเป็น draft        | 1. กรอกข้อมูลบางส่วน<br>2. กด Save Draft                       | ระบบบันทึก draft             | N/A   |
| TC-PEN-039   | Contest          | Negative | ไม่กรอกชื่อ contest     | 1. เว้นชื่อ<br>2. กดสร้าง                                      | ระบบไม่ให้สร้าง              | N/A   |
| TC-PEN-040   | Contest          | Negative | วันที่ไม่ถูกต้อง        | 1. ใส่ end date ก่อน start date<br>2. กด save                  | ระบบแจ้ง error               | N/A   |
| TC-PEN-041   | Contest          | Positive | เปิดรับสมัคร            | 1. เปลี่ยน status เป็น open<br>2. save                         | ผู้ใช้สมัครได้               | N/A   |
| TC-PEN-042   | Contest          | Negative | สมัครหลัง deadline      | 1. รอหมดเวลา<br>2. สมัคร                                       | ระบบไม่ให้สมัคร              | N/A   |
| TC-PEN-043   | Submit Poem      | Negative | ไม่กรอกเนื้อหา          | 1. ไม่ใส่กลอน<br>2. กด submit                                  | ระบบแจ้งให้กรอก              | N/A   |
| TC-PEN-044   | Submit Poem      | Positive | แก้ไขก่อน deadline      | 1. แก้ไขผลงาน<br>2. save                                       | อัปเดตสำเร็จ                 | N/A   |
| TC-PEN-045   | Submit Poem      | Negative | แก้ไขหลัง deadline      | 1. รอหมดเวลา<br>2. แก้ไข                                       | ระบบไม่อนุญาต                | N/A   |
| TC-PEN-046   | Submit Poem      | Negative | ส่งซ้ำหลายครั้ง         | 1. submit เดิมซ้ำ<br>2. กดหลายรอบ                              | ระบบกัน duplicate            | N/A   |
| TC-PEN-047   | File Upload      | Positive | อัปโหลด jpg ปกติ        | 1. เลือกไฟล์ jpg<br>2. upload                                  | สำเร็จ                       | N/A   |
| TC-PEN-048   | File Upload      | Negative | ไฟล์ใหญ่เกิน limit      | 1. upload ไฟล์ใหญ่<br>2. submit                                | ระบบ reject                  | N/A   |
| TC-PEN-049   | Judge Area       | Positive | เห็นงานที่ assigned     | 1. login judge<br>2. ดูรายการงาน                               | เห็นเฉพาะงานตัวเอง           | N/A   |
| TC-PEN-050   | Judge Area       | Negative | ดูงานคนอื่น             | 1. เปลี่ยน ID งาน<br>2. เปิด                                   | ระบบ block                   | N/A   |
| TC-PEN-051   | Grading          | Positive | ให้คะแนนครบ             | 1. กรอกคะแนนทุกช่อง<br>2. save                                 | บันทึกสำเร็จ                 | N/A   |
| TC-PEN-052   | Grading          | Negative | ไม่กรอกคะแนนบางช่อง     | 1. เว้นบางช่อง<br>2. save                                      | ระบบไม่ให้ submit            | N/A   |
| TC-PEN-053   | Grading          | Negative | ใส่คะแนนเป็น text       | 1. ใส่คำว่า "ดีมาก"<br>2. save                                 | ระบบ reject                  | N/A   |
| TC-PEN-054   | Result           | Positive | รวมคะแนนอัตโนมัติ       | 1. มีหลายคะแนน<br>2. ดูผลรวม                                   | ระบบคำนวณถูกต้อง             | N/A   |
| TC-PEN-055   | Result           | Negative | publish โดยไม่มีคะแนน   | 1. กด publish<br>2. ไม่มีคะแนน                                 | ระบบไม่ให้ publish           | N/A   |
| TC-PEN-056   | Admin            | Positive | ลบผู้ใช้สำเร็จ          | 1. เลือก user<br>2. กด delete                                  | ลบสำเร็จ                     | N/A   |
| TC-PEN-057   | Admin            | Negative | ลบตัวเอง                | 1. admin ลบ account ตัวเอง                                     | ระบบไม่ให้ลบ                 | N/A   |
| TC-PEN-058   | Notification     | Positive | แจ้งเตือนงานใหม่        | 1. submit งานใหม่                                              | judge ได้แจ้งเตือน           | N/A   |
| TC-PEN-059   | Notification     | Negative | แจ้งเตือนซ้ำ            | 1. trigger ซ้ำหลายครั้ง                                        | ไม่ส่งซ้ำ                    | N/A   |
| TC-PEN-060   | Logout           | Positive | logout สำเร็จ           | 1. กด logout                                                   | กลับหน้า login               | N/A   |

---