const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* การตั้งค่าระบบจำลองให้มี Browser 3 แบบ แม้เงื่อนไขบอก 3 Browser นับเป็น Case เดียว แต่มีไว้เพื่อความเป็นมาตรฐาน */
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
