describe('ระบบจัดการผลงานและโปรไฟล์ผู้สมัคร (TC-015 ถึง TC-019)', () => {
  
  beforeEach(() => {
    // จำลองการเข้าสู่ระบบในฐานะผู้เข้าแข่งขันก่อนเริ่มเทสต์ทุกข้อ
    cy.visit('/login');
    cy.get('input[name="email"]').type('applicant@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    // ยืนยันว่าเข้าสู่ระบบสำเร็จ
    cy.url().should('include', '/dashboard');
  });

  context('โมดูล: การจัดการผลงาน (Submission Management)', () => {
    
    it('TC-015: ผู้สมัครแก้ไขผลงาน (ยังไม่หมดเขต)', () => {
      cy.visit('/profile/submissions'); // เข้าหน้าผลงานของฉัน
      cy.get('.edit-submission-btn').first().click(); // กดปุ่มแก้ไขผลงานล่าสุด
      
      // อัปโหลดไฟล์ใหม่เข้าไปแทนที่
      cy.get('input[type="file"]').selectFile('cypress/fixtures/updated_poem.pdf');
      cy.get('button[type="submit"]').click();
      
      // ตรวจสอบผลลัพธ์
      cy.get('.alert-success').should('contain', 'อัปเดตผลงานสำเร็จ');
    });

    it('TC-016: ผู้สมัครแก้ไขผลงาน (หมดเขตแล้ว)', () => {
      cy.visit('/profile/submissions');
      
      // ค้นหารายการผลงานที่หมดเขตไปแล้ว ปุ่มแก้ไขต้องถูก Disabled หรือไม่แสดง
      cy.get('.submission-item.expired')
        .find('.edit-submission-btn')
        .should('be.disabled')
        .or('not.exist');
    });

    it('TC-017: ยกเลิกการส่งผลงาน', () => {
      cy.visit('/profile/submissions');
      
      // กดปุ่มยกเลิกผลงาน
      cy.get('.cancel-submission-btn').first().click();
      
      // สมมติว่ามี Modal Popup เด้งขึ้นมาให้กดยืนยัน
      cy.get('.modal-confirm-btn').click(); 
      
      // ตรวจสอบผลลัพธ์
      cy.get('.alert-success').should('contain', 'ยกเลิกการส่งผลงานเรียบร้อย');
    });
  });

  context('โมดูล: การจัดการโปรไฟล์ (Profile Management)', () => {
    
    it('TC-018: แก้ไขข้อมูลส่วนตัวผู้สมัคร', () => {
      cy.visit('/profile/settings'); // เข้าหน้าตั้งค่าบัญชี
      
      // ล้างข้อมูลเดิมและพิมพ์ชื่อใหม่
      cy.get('input[name="name"]').clear().type('วัชรมน เผือกกลาง (แก้ไขข้อมูล)');
      cy.get('button').contains('บันทึกข้อมูล').click();
      
      // ตรวจสอบผลลัพธ์
      cy.get('.alert-success').should('contain', 'อัปเดตข้อมูลส่วนตัวสำเร็จ');
    });

    it('TC-019: เปลี่ยนรหัสผ่านโดยกรอกรหัสเดิมผิด', () => {
      cy.visit('/profile/settings');
      
      // กรอกรหัสผ่านเก่าผิด และตั้งรหัสผ่านใหม่
      cy.get('input[name="current_password"]').type('WrongOldPassword');
      cy.get('input[name="new_password"]').type('NewPassword123!');
      cy.get('input[name="confirm_password"]').type('NewPassword123!');
      cy.get('button').contains('เปลี่ยนรหัสผ่าน').click();
      
      // ตรวจสอบผลลัพธ์ (Negative Case)
      cy.get('.alert-error').should('contain', 'รหัสผ่านเดิมไม่ถูกต้อง');
    });
  });

});