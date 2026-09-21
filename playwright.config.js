import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    // 1. Backend Express
    {
      command: 'npm run start --prefix backend',
      url: 'http://127.0.0.1:5000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        PORT: '5000',
        JWT_SECRET: process.env.JWT_SECRET || 'secret_de_test',
        MONGO_URI: process.env.MONGO_URI || '',
      },
    },
    // 2. Frontend React (Vite)
    {
      // En CI: on compile et on sert la version preview sur l'IP 127.0.0.1
      // En local: on lance le serveur de dev classique
      command: process.env.CI
        ? 'npm run build --prefix frontend && npm run preview --prefix frontend -- --host 127.0.0.1 --port 5173'
        : 'npm run dev --prefix frontend',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
  // Exécuter uniquement Chromium sur GitHub Actions pour optimiser les ressources
  projects: process.env.CI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
});