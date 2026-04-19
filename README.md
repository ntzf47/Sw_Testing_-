# Software Testing กฬุ่ม

## สมาชิก

- Phisit650710706: ทดสอบ SQL Injection, XSS และ RBAC
- Chonpasu650710234: ทดสอบ Auth Logic และ File Upload Limits
- Kittipong650710153: ทดสอบ Data Privacy และ SQL Injection
- Nutt660710170: ทดสอบ Data Validation และ Boundary Testing
- Purin_650710872: ทดสอบ UX Loading State และ State Transitions

## How to Run

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
- มีเอกสาร SW-testing-กฬุ่ม ที่รวม Manualtest ของทุกคนรวมกัน และโฟลเดอร์ของแต่ละคนมีเอกสาร manualtest.docx
