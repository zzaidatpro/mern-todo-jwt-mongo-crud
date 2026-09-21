import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Charger le fichier .env situé dans le dossier backend
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

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
      command: 'npm start',
      cwd: './backend',
      url: 'http://127.0.0.1:5000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        PORT: '5000',
        JWT_SECRET: process.env.JWT_SECRET || 'secret_de_test_local',
        MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenforest_e2e_test',
      },
    },
    // 2. Frontend React (Vite)
    {
      command: process.env.CI
        ? 'npm run preview -- --host 127.0.0.1 --port 5173'
        : 'npm run dev',
      cwd: './frontend',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  projects: process.env.CI
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
      //  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
});