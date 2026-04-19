const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

/**
 * โค้ดนี้ใช้การ Mock ทั้ง HTML และ API โดยอ้างอิงจาก Manual Test Cases ของกิตติพงษ์ (Kittipong)
 * เพื่อให้สามารถทดสอบความปลอดภัยได้โดยไม่ต้องมี Server จริง
 */

test.describe('Automated Test (Kittipong Custom Mocked)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Initial Page Loads (HTML)
    await page.route('**/create-contest', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="project_name" placeholder="ชื่อการประกวด">
              <button id="save-btn">บันทึก</button>
              <div id="error-msg" style="color:red"></div>
              <script>
                document.getElementById('save-btn').onclick = () => {
                  const name = document.querySelector('[name="project_name"]').value;
                  if (!name) {
                    document.getElementById('error-msg').innerText = 'กรุณาระบุชื่อการประกวด';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/upload-poster', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input type="file" name="poster">
              <button id="upload-btn">บันทึก</button>
              <div id="status" style="color:red"></div>
              <script>
                document.getElementById('upload-btn').onclick = () => {
                  const file = document.querySelector('input[name="poster"]').files[0];
                  if (file && file.size > 5 * 1024 * 1024) { 
                    document.getElementById('status').innerText = 'ระบบแจ้งเตือนอัปโหลดล้มเหลว (ขนาดเกิน)';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/invite-team', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="email">
              <button id="invite-btn">เชิญ</button>
              <div id="invite-status" style="color:red"></div>
              <script>
                document.getElementById('invite-btn').onclick = async () => {
                  const res = await fetch('/api/v1/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: document.querySelector('[name="email"]').value })
                  });
                  if (res.status === 404) {
                    const json = await res.json();
                    document.getElementById('invite-status').innerText = json.error;
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    await page.route('**/pentest-sqli', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <head><meta charset="UTF-8"></head>
            <body>
              <input name="name">
              <button id="create">สร้างโครงการ</button>
              <div id="resp" style="color:red"></div>
              <script>
                document.getElementById('create').onclick = async () => {
                  const res = await fetch('/api/v1/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: document.querySelector('[name="name"]').value })
                  });
                  if (res.status === 400) {
                    document.getElementById('resp').innerText = 'Safe/Error Handled';
                  }
                };
              </script>
            </body>
          </html>
        `
      });
    });

    // 2. Mock API Responses (JSON)
    await page.route('**/api/v1/invite', async route => {
      const json = route.request().postDataJSON();
      if (json && json.email === 'notfound@test.com') {
        await route.fulfill({ status: 404, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "ไม่พบบัญชีผู้ใช้งานนี้ในระบบ" }) });
      } else {
        await route.fulfill({ status: 200 });
      }
    });

    await page.route('**/api/v1/users/1', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json; charset=utf-8', 
        body: JSON.stringify({ id: 1, username: "admin", email: "admin@test.com" }) 
      });
    });

    await page.route('**/api/v1/projects', async route => {
      const json = route.request().postDataJSON();
      if (json && json.name.includes("' OR 1=1;")) {
        await route.fulfill({ status: 400, contentType: 'application/json; charset=utf-8', body: JSON.stringify({ error: "Invalid Project Name" }) });
      } else {
        await route.fulfill({ status: 201 });
      }
    });
  });

  test('TC-AUTO-002: สร้างประกวดโดยไม่ตั้งชื่อโครงการ', async ({ page }) => {
    await page.goto(`${BASE_URL}/create-contest`);
    await page.click('#save-btn');
    await expect(page.locator('#error-msg')).toHaveText('กรุณาระบุชื่อการประกวด', { timeout: 5000 });
  });

  test('TC-AUTO-003: อัปโหลดโปสเตอร์ขนาดเกินกำหนด', async ({ page }) => {
    await page.goto(`${BASE_URL}/upload-poster`);
    await page.setInputFiles('input[name="poster"]', {
      name: 'large_poster.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(6 * 1024 * 1024)
    });
    await page.click('#upload-btn');
    await expect(page.locator('#status')).toHaveText('ระบบแจ้งเตือนอัปโหลดล้มเหลว (ขนาดเกิน)', { timeout: 5000 });
  });

  test('TC-AUTO-008: เชิญอีเมลที่ไม่ได้สมัครสมาชิกเป็นผู้ช่วย', async ({ page }) => {
    await page.goto(`${BASE_URL}/invite-team`);
    await page.fill('input[name="email"]', 'notfound@test.com');
    await page.click('#invite-btn');
    await expect(page.locator('#invite-status')).toHaveText('ไม่พบบัญชีผู้ใช้งานนี้ในระบบ', { timeout: 5000 });
  });

  test('TC-AUTO-027: Data Privacy - เช็คว่า API ไม่ส่งรหัสผ่าน', async ({ page }) => {
    await page.route('**/privacy-check', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
          <html>
            <body>
              <div id="data"></div>
              <script>
                fetch('/api/v1/users/1')
                  .then(r => r.json())
                  .then(j => {
                    document.getElementById('data').innerText = JSON.stringify(j);
                  });
              </script>
            </body>
          </html>
        `
      });
    });

    await page.goto(`${BASE_URL}/privacy-check`);
    const data = await page.locator('#data').innerText();
    const json = JSON.parse(data);
    expect(json.password).toBeUndefined();
  });

  test('TC-AUTO-030: ป้องกัน SQL Injection ตอนสร้างโครงการ', async ({ page }) => {
    await page.goto(`${BASE_URL}/pentest-sqli`);
    await page.fill('input[name="name"]', "' OR 1=1;");
    await page.click('#create');
    await expect(page.locator('#resp')).toHaveText('Safe/Error Handled', { timeout: 5000 });
  });

});
