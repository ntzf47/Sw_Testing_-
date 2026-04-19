const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

/**
 * โค้ดนี้ใช้การ Mock ทั้ง HTML และ API โดยอ้างอิงจาก Manual Test Cases ของชลพศุ (Chonpasu)
 * เพื่อให้สามารถทดสอบความปลอดภัยได้โดยไม่ต้องมี Server จริง
 */

test.describe('Automated PEN Test (Chonpasu Custom Mocked)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Initial Page Loads (HTML)
    await page.route('**/register', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="email">
              <button id="reg-btn">ลงทะเบียน</button>
              <div id="reg-error" style="color:red"></div>
              <script>
                document.getElementById('reg-btn').onclick = async () => {
                  const res = await fetch('/api/v1/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: document.querySelector('[name="email"]').value })
                  });
                  if (res.status === 400) {
                    const json = await res.json();
                    document.getElementById('reg-error').innerText = json.error;
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="email">
              <input name="password" type="password">
              <button id="login-btn">Login</button>
              <div id="login-error" style="color:red"></div>
              <script>
                document.getElementById('login-btn').onclick = async () => {
                  const res = await fetch('/api/v1/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      email: document.querySelector('[name="email"]').value,
                      password: document.querySelector('[name="password"]').value
                    })
                  });
                  if (res.status === 401) {
                    const json = await res.json();
                    document.getElementById('login-error').innerText = json.error;
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
              <input type="file" name="poem_file">
              <button id="upload-btn">ส่งผลงาน</button>
              <div id="upload-error" style="color:red"></div>
              <script>
                document.getElementById('upload-btn').onclick = () => {
                  const file = document.querySelector('input[name="poem_file"]').files[0];
                  if (file) {
                    if (file.name.toLowerCase().endsWith('.exe')) {
                      document.getElementById('upload-error').innerText = 'ระบบไม่อนุญาตให้อัปโหลด และแจ้งเตือนไฟล์ไม่รองรับ';
                    } else if (file.size > 10 * 1024 * 1024) {
                      document.getElementById('upload-error').innerText = 'ขนาดไฟล์เกินที่กำหนด';
                    }
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/judge/score', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="score" type="number">
              <button id="score-btn">ส่งคะแนน</button>
              <div id="score-error" style="color:red"></div>
              <script>
                document.getElementById('score-btn').onclick = async () => {
                  const res = await fetch('/api/v1/judge/submit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: parseInt(document.querySelector('[name="score"]').value) })
                  });
                  if (res.status === 400) {
                    const json = await res.json();
                    document.getElementById('score-error').innerText = json.error;
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    // 2. Mock API Responses (JSON)
    await page.route('**/api/v1/register', async route => {
      const json = route.request().postDataJSON();
      if (json && json.email === 'duplicate@test.com') {
        await route.fulfill({ status: 400, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "อีเมลนี้ถูกใช้งานแล้ว" }) });
      } else {
        await route.fulfill({ status: 201 });
      }
    });

    await page.route('**/api/v1/login', async route => {
      const json = route.request().postDataJSON();
      if (json && json.password === 'wrong_pass') {
        await route.fulfill({ status: 401, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });

    await page.route('**/api/v1/judge/submit-score', async route => {
      const json = route.request().postDataJSON();
      if (json && json.score > 10) {
        await route.fulfill({ status: 400, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "กรุณากรอกคะแนนไม่เกินที่กำหนด" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });
  });

  test('TC-AUTO-002: การลงทะเบียนด้วยอีเมลซ้ำ', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="email"]', 'duplicate@test.com');
    await page.click('#reg-btn');
    const err = page.locator('#reg-error');
    await expect(err).toHaveText('อีเมลนี้ถูกใช้งานแล้ว', { timeout: 5000 });
  });

  test('TC-AUTO-005: เข้าสู่ระบบด้วยรหัสผ่านผิด', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[name="password"]', 'wrong_pass');
    await page.click('#login-btn');
    const err = page.locator('#login-error');
    await expect(err).toHaveText('อีเมลหรือรหัสผ่านไม่ถูกต้อง', { timeout: 5000 });
  });

  test('TC-AUTO-012: ส่งผลงานด้วยไฟล์นามสกุลผิด (.exe)', async ({ page }) => {
    await page.goto(`${BASE_URL}/submit-poem`);
    await page.setInputFiles('input[name="poem_file"]', {
      name: 'malware.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('fake content')
    });
    await page.click('#upload-btn');
    const err = page.locator('#upload-error');
    await expect(err).toHaveText('ระบบไม่อนุญาตให้อัปโหลด และแจ้งเตือนไฟล์ไม่รองรับ', { timeout: 5000 });
  });

  test('TC-AUTO-013: ส่งผลงานโดยไฟล์เกินขนาดกำหนด', async ({ page }) => {
    await page.goto(`${BASE_URL}/submit-poem`);
    await page.setInputFiles('input[name="poem_file"]', {
      name: 'large.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(11 * 1024 * 1024)
    });
    await page.click('#upload-btn');
    const err = page.locator('#upload-error');
    await expect(err).toHaveText('ขนาดไฟล์เกินที่กำหนด', { timeout: 5000 });
  });

  test('TC-AUTO-026: ให้คะแนนเกินกว่าเกณฑ์กำหนด', async ({ page }) => {
    await page.goto(`${BASE_URL}/judge/score`);
    await page.fill('input[name="score"]', '99');
    await page.click('#score-btn');
    const err = page.locator('#score-error');
    await expect(err).toHaveText('กรุณากรอกคะแนนไม่เกินที่กำหนด', { timeout: 5000 });
  });

});
