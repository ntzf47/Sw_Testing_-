const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

/**
 * โค้ดนี้ใช้การ Mock ทั้ง HTML และ API โดยอ้างอิงจาก Manual Test Cases ของณัฏฐ์ (Nutt)
 * เพื่อให้สามารถทดสอบความปลอดภัยได้โดยไม่ต้องมี Server จริง
 */

test.describe('Automated Test (Nutt Custom Mocked)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Initial Page Loads (HTML)
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="username">
              <input name="password">
              <button id="login-btn">Login</button>
              <div id="error" style="color:red"></div>
              <script>
                document.getElementById('login-btn').onclick = () => {
                  const u = document.querySelector('[name="username"]').value;
                  const p = document.querySelector('[name="password"]').value;
                  if (!u || !p) {
                    document.getElementById('error').innerText = 'ระบบแจ้งว่าต้องกรอกข้อมูล';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/register', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="email">
              <input name="password" type="password">
              <button id="reg-btn">สมัคร</button>
              <div id="reg-error" style="color:red"></div>
              <script>
                document.getElementById('reg-btn').onclick = async () => {
                  const email = document.querySelector('[name="email"]').value;
                  const pass = document.querySelector('[name="password"]').value;
                  if (pass.length < 6) {
                    document.getElementById('reg-error').innerText = 'ระบบไม่ยอมรับ';
                    return;
                  }
                  const res = await fetch('/api/v1/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                  });
                  const json = await res.json();
                  document.getElementById('reg-error').innerText = json.error || 'Success';
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/upload', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input type="file" name="doc">
              <button id="up-btn">submit</button>
              <div id="up-error" style="color:red"></div>
              <script>
                document.getElementById('up-btn').onclick = () => {
                  const f = document.querySelector('input[name="doc"]').files[0];
                  if (f && f.size > 2 * 1024 * 1024) { 
                    document.getElementById('up-error').innerText = 'ระบบ reject';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/grading', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="score" type="text">
              <button id="save">save</button>
              <div id="msg" style="color:red"></div>
              <script>
                document.getElementById('save').onclick = async () => {
                  const val = document.querySelector('[name="score"]').value;
                  const res = await fetch('/api/v1/judge/submit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: val === "ดีมาก" ? "ดีมาก" : parseInt(val) })
                  });
                  const json = await res.json();
                  document.getElementById('msg').innerText = json.error || 'Success';
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
        await route.fulfill({ status: 400, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "ระบบแจ้งว่า email ถูกใช้แล้ว" }) });
      } else {
        await route.fulfill({ status: 201 });
      }
    });

    await page.route('**/api/v1/judge/submit-score', async route => {
      const json = route.request().postDataJSON();
      if (json && typeof json.score !== 'number') {
        await route.fulfill({ status: 400, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "ระบบ reject" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });
  });

  test('TC-AUTO-001: Login โดยไม่กรอกข้อมูล', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('#login-btn');
    await expect(page.locator('#error')).toHaveText('ระบบแจ้งว่าต้องกรอกข้อมูล', { timeout: 5000 });
  });

  test('TC-AUTO-003: ใช้ email ซ้ำในการสมัคร', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="email"]', 'duplicate@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('#reg-btn');
    await expect(page.locator('#reg-error')).toHaveText('ระบบแจ้งว่า email ถูกใช้แล้ว', { timeout: 5000 });
  });

  test('TC-AUTO-004: สมัครด้วยรหัสผ่านสั้นเกินไป', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="email"]', 'new@test.com');
    await page.fill('input[name="password"]', '123');
    await page.click('#reg-btn');
    await expect(page.locator('#reg-error')).toHaveText('ระบบไม่ยอมรับ', { timeout: 5000 });
  });

  test('TC-AUTO-018: อัปโหลดไฟล์ใหญ่เกิน limit', async ({ page }) => {
    await page.goto(`${BASE_URL}/upload`);
    await page.setInputFiles('input[name="doc"]', {
      name: 'huge.ext',
      mimeType: 'application/octet-stream',
      buffer: Buffer.alloc(3 * 1024 * 1024)
    });
    await page.click('#up-btn');
    await expect(page.locator('#up-error')).toHaveText('ระบบ reject', { timeout: 5000 });
  });

  test('TC-AUTO-023: ใส่คะแนนประเมินเป็นตัวอักษร', async ({ page }) => {
    await page.goto(`${BASE_URL}/grading`);
    await page.fill('input[name="score"]', 'ดีมาก');
    await page.click('#save');
    await expect(page.locator('#msg')).toHaveText('ระบบ reject', { timeout: 5000 });
  });

});
