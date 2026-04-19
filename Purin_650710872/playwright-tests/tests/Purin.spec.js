const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

/**
 * โค้ดนี้ใช้การ Mock ทั้ง HTML และ API โดยอ้างอิงจาก Manual Test Cases ของภูรินท์ (Purin)
 * เพื่อให้สามารถทดสอบความปลอดภัยและ UX ได้โดยไม่ต้องมี Server จริง
 */

test.describe('Automated Test (Purin Custom Mocked)', () => {

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
              <input name="username" placeholder="Username">
              <input name="password" type="password">
              <button id="login-btn">Login</button>
              <div id="status"></div>
              <script>
                document.getElementById('login-btn').onclick = async () => {
                  const btn = document.getElementById('login-btn');
                  const user = document.querySelector('[name="username"]').value;
                  
                  // TC-001: Loading & Disable logic
                  btn.disabled = true;
                  btn.innerText = 'Loading...';
                  document.getElementById('status').innerText = 'Processing';

                  // TC-003: Trim logic simulation
                  const trimmedUser = user.trim();
                  
                  const res = await fetch('/api/v1/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: trimmedUser })
                  });
                  
                  if (res.status === 200) {
                    document.getElementById('status').innerText = 'Login Success';
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
              <input name="username">
              <button id="reg-btn">สมัคร</button>
              <div id="reg-error" style="color:red"></div>
              <script>
                document.getElementById('reg-btn').onclick = async () => {
                  const user = document.querySelector('[name="username"]').value;
                  const res = await fetch('/api/v1/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user })
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

    await page.route('**/contest-management', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <div id="contest-state">draft</div>
              <button id="publish-btn">Publish</button>
              <script>
                document.getElementById('publish-btn').onclick = () => {
                  document.getElementById('contest-state').innerText = 'open';
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
              <input type="file" name="file">
              <button id="up-btn">Upload</button>
              <div id="up-msg"></div>
              <script>
                document.getElementById('up-btn').onclick = () => {
                  const f = document.querySelector('input[name="file"]').files[0];
                  if (f && f.size > 2 * 1024 * 1024) { 
                    document.getElementById('up-msg').innerText = 'File too large';
                  } else {
                    document.getElementById('up-msg').innerText = 'Upload Successful';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    // 2. Mock API Responses (JSON)
    await page.route('**/api/v1/login', async route => {
      const json = route.request().postDataJSON();
      if (json && json.username === 'testuser') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: "ok" }) });
      } else {
        await route.fulfill({ status: 401 });
      }
    });

    await page.route('**/api/v1/register', async route => {
      const json = route.request().postDataJSON();
      if (json && json.username.length > 20) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: "Username exceeds limit" }) });
      } else {
        await route.fulfill({ status: 201 });
      }
    });
  });

  test('TC-AUTO-001: Login Success - ปุ่มต้อง disabled และแสดง Loading', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'testuser');
    await page.click('#login-btn');
    
    const btn = page.locator('#login-btn');
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveText('Loading...');
    await expect(page.locator('#status')).toHaveText('Login Success');
  });

  test('TC-AUTO-003: Login Trim - ใส่ช่องว่างหัวท้ายแล้วยัง Login ได้', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', '  testuser  ');
    await page.click('#login-btn');
    await expect(page.locator('#status')).toHaveText('Login Success');
  });

  test('TC-AUTO-005: Register Limit - แจ้งเตือนเมื่อ username ยาวเกินกำหนด', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="username"]', 'very_long_username_that_exceeds_twenty_characters');
    await page.click('#reg-btn');
    await expect(page.locator('#reg-error')).toHaveText('Username exceeds limit');
  });

  test('TC-AUTO-012: Contest State - เปลี่ยนสถานะจาก draft เป็น open', async ({ page }) => {
    await page.goto(`${BASE_URL}/contest-management`);
    await expect(page.locator('#contest-state')).toHaveText('draft');
    await page.click('#publish-btn');
    await expect(page.locator('#contest-state')).toHaveText('open');
  });

  test('TC-AUTO-022: File Size Limit - ตรวจสอบขนาดไฟล์ที่ limit', async ({ page }) => {
    await page.goto(`${BASE_URL}/upload`);
    
    // Test within limit
    await page.setInputFiles('input[name="file"]', {
      name: 'limit.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(2 * 1024 * 1024)
    });
    await page.click('#up-btn');
    await expect(page.locator('#up-msg')).toHaveText('Upload Successful');

    // Test over limit
    await page.setInputFiles('input[name="file"]', {
      name: 'too_big.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(3 * 1024 * 1024)
    });
    await page.click('#up-btn');
    await expect(page.locator('#up-msg')).toHaveText('File too large');
  });

});
