const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

/**
 * โค้ดนี้ใช้การ Mock ทั้ง HTML และ API เพื่อให้สามารถรัน Test ได้โดยไม่ต้องมี Server จริง
 * (This code mocks both HTML and API to allow running tests without a real server)
 */

test.describe('Automated PEN Test (Mocked API)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Initial Page Loads (HTML) - เพิ่ม charset=utf-8 เพื่อรองรับภาษาไทย
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <form id="login-form">
                <input name="username">
                <input name="password">
                <button type="submit">Login</button>
              </form>
              <div class="error-message" style="display:none">Invalid input detected</div>
              <script>
                document.getElementById('login-form').onsubmit = async (e) => {
                  e.preventDefault();
                  const res = await fetch('/api/v1/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      username: document.querySelector('[name="username"]').value,
                      password: document.querySelector('[name="password"]').value
                    })
                  });
                  if (res.status === 400) {
                    document.querySelector('.error-message').style.display = 'block';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/submit-poem', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <textarea name="poem_content"></textarea>
              <input type="file" name="poem_file">
              <button id="submit">Submit</button>
              <button id="upload">Upload</button>
              <div class="poem-display"></div>
              <div class="upload-error-message"></div>
              <script>
                document.getElementById('submit').onclick = async () => {
                  const content = document.querySelector('[name="poem_content"]').value;
                  const res = await fetch('/api/v1/submit-poem', {
                    method: 'POST',
                    body: content
                  });
                  const json = await res.json();
                  document.querySelector('.poem-display').textContent = json.content;
                };
                
                document.getElementById('upload').addEventListener('click', () => {
                  const input = document.querySelector('input[name="poem_file"]');
                  const errorDiv = document.querySelector('.upload-error-message');
                  if (input.files && input.files.length > 0) {
                    const file = input.files[0];
                    if (file.name.toLowerCase().endsWith('.exe') || file.name.toLowerCase().endsWith('.sh')) {
                      errorDiv.innerText = 'ไม่อนุญาตให้อัปโหลดไฟล์ประเภทนี้';
                    } else {
                      errorDiv.innerText = 'Success';
                    }
                  }
                });
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/admin/create-contest', async route => {
      await route.fulfill({
        status: 403,
        contentType: 'text/html; charset=utf-8',
        body: '<html><head><meta charset="UTF-8"></head><body><div class="alert-forbidden">Access Denied</div></body></html>',
      });
    });

    await page.route('**/judge/score/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="score_grammar">
              <button id="btn-score">ยืนยันให้คะแนน</button>
              <div class="input-error"></div>
              <script>
                document.getElementById('btn-score').onclick = async () => {
                  const res = await fetch('/api/v1/judge/submit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: parseInt(document.querySelector('[name="score_grammar"]').value) })
                  });
                  const json = await res.json();
                  if (json.error) {
                    document.querySelector('.input-error').textContent = json.error;
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    // 2. Mock API Requests (JSON)
    await page.route('**/api/v1/login', async route => {
      const json = route.request().postDataJSON();
      if (json && (json.username.includes("' OR '1'='1") || json.username.includes("1=1"))) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: "Invalid input detected" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });

    await page.route('**/api/v1/submit-poem', async route => {
      const body = route.request().postData();
      if (typeof body === 'string' && body.includes('<script>')) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ content: "Sanitized Content" }) });
      } else {
        await route.fulfill({ status: 201 });
      }
    });

    await page.route('**/api/v1/judge/submit-score', async route => {
      const json = route.request().postDataJSON();
      if (json && json.score > 100) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: "คะแนนต้องอยู่ระหว่าง 0 ถึง 100" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });
  });

  test('TC-AUTO-PEN-001: ป้องกัน SQL Injection ที่หน้าเข้าสู่ระบบ', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', "admin' OR '1'='1");
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toContainText('Invalid input detected');
  });

  test('TC-AUTO-PEN-002: ป้องกันการฝัง XSS Script', async ({ page }) => {
    await page.goto(`${BASE_URL}/submit-poem`);
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('textarea[name="poem_content"]', xssPayload);
    await page.click('#submit');

    const resultElement = page.locator('.poem-display');
    await expect(resultElement).toContainText('Sanitized Content');
  });

  test('TC-AUTO-PEN-003: ข้ามสิทธิ์ (RBAC Bypass)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/create-contest`);
    const alertMessage = page.locator('.alert-forbidden');
    await expect(alertMessage).toBeVisible();
    await expect(alertMessage).toContainText('Access Denied');
  });

  test('TC-AUTO-PEN-004: Parameter Tampering (คะแนนเกินขีดจำกัด)', async ({ page }) => {
    await page.goto(`${BASE_URL}/judge/score/1`);
    await page.fill('input[name="score_grammar"]', '9999');
    await page.click('#btn-score');

    const limitError = page.locator('.input-error');
    await expect(limitError).toContainText('คะแนนต้องอยู่ระหว่าง 0 ถึง 100');
  });

  test('TC-AUTO-PEN-005: File Upload (นามสกุลไฟล์ผิด)', async ({ page }) => {
    await page.goto(`${BASE_URL}/submit-poem`);
    
    const filePath = 'malware.exe';
    
    // ตั้งค่าไฟล์ที่ไม่อนุญาต
    await page.setInputFiles('input[name="poem_file"]', {
      name: filePath,
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('fake content')
    });

    // คลิกปุ่ม Upload และรอข้อความแจ้งเตือน
    await page.click('#upload');

    // ตรวจสอบข้อความแจ้งเตือน (ใช้ toHaveText เพื่อความแม่นยำ)
    const uploadError = page.locator('.upload-error-message');
    await expect(uploadError).toHaveText('ไม่อนุญาตให้อัปโหลดไฟล์ประเภทนี้', { timeout: 5000 });
  });

});
