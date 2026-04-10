// tests/auth.setup.js — runs once before all test projects
import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join('auth', 'storageState.json');
const MAX_AGE_MINUTES = 30;

setup('authenticate as Admin and save state', async ({ page }) => {
  // Check if we already have a valid session less than 30 minutes old
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const mtime = new Date(stats.mtime).getTime();
    const ageInMinutes = (Date.now() - mtime) / (1000 * 60);

    if (ageInMinutes < MAX_AGE_MINUTES) {
      console.log(`✅ Reusing existing auth state (${Math.round(ageInMinutes)} mins old)`);
      return; // Skip login, state is still valid
    } else {
      console.log(`⏳ Auth state is ${Math.round(ageInMinutes)} mins old. Logging in again...`);
    }
  }

  await page.goto('/web/index.php/auth/login');
  await page.locator('input[name="username"]').fill(process.env.TEST_USER_EMAIL   || 'Admin');
  await page.locator('input[name="password"]').fill(process.env.TEST_USER_PASSWORD || 'admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Confirm successful login
  await expect(page).toHaveURL(/dashboard/);

  // Persist cookies + localStorage for all downstream tests
  await page.context().storageState({ path: authFile });
  console.log('✅ Auth state saved to auth/storageState.json');
});
