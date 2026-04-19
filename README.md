# Standardized Software Testing Repository

## Project Overview
คลังข้อมูลหลักสำหรับการจัดเก็บและรันระบบทดสอบความปลอดภัย (Security Testing) และการทดสอบระบบ (Functional Testing) สำหรับกลุ่มนักศึกษา โดยมีการใช้ Playwright เป็นเครื่องมือหลักในการทดสอบแบบอัตโนมัติ (Automated Testing) ผ่านระบบ Mock API เพื่อให้สามารถตรวจสอบระบบได้อย่างรวดเร็ว มีเสถียรภาพ และเป็นมาตรฐานเดียวกันทั้งหมด

## Repository Structure
ในคลังข้อมูลนี้ประกอบด้วยโฟลเดอร์โครงการของนักศึกษาแต่ละคน ดังนี้:
- Phisit650710706: เน้นการทดสอบ SQL Injection, XSS และ RBAC
- Chonpasu650710234: เน้นการทดสอบ Auth Logic และ File Upload Limits
- Kittipong650710153: เน้นการทดสอบ Data Privacy และ SQL Injection
- Nutt660710170: เน้นการทดสอบ Data Validation และ Boundary Testing
- Purin_650710872: เน้นการทดสอบ UX Loading State และ State Transitions


## การใช้งานและวิธีการรัน (How to Run)
ขั้นตอนการเตรียมระบบและรันการทดสอบเบื้องต้น:

1. เข้าไปยังโฟลเดอร์ของนักศึกษาที่ต้องการทดสอบ และเข้าไปในโฟลเดอร์ playwright-tests:
   ```bash
   cd [Student_Folder]/playwright-tests
   ```

2. ติดตั้งไลบรารีที่จำเป็นสำหรับการทดสอบ:
   ```bash
   npm install
   ```

3. สั่งรันชุดทดสอบอัตโนมัติ (Automated Tests):
   ```bash
   npx playwright test
   ```
   หรือรันเฉพาะไฟล์ที่ต้องการ:
   ```bash
   npx playwright test tests/[StudentName].spec.js
   ```

## เอกสาร
- README.md: รายละเอียดรายการทดสอบ Manual Test Cases ลำดับที่ 1-30 และวิธีการรันสคริปต์
- Test_Report.md: รายงานสรุปผลการรันชุดทดสอบอัตโนมัติ (สรุปจำนวนเคสที่ผ่าน/ไม่ผ่าน พร้อม Log หลักฐานการรัน)
- playwright-tests/: โฟลเดอร์บรรจุสคริปต์ Playwright สำหรับการ Mock และทดสอบแบบอัตโนมัติ