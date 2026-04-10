// tests/auth.setup.js — runs once before all test projects
import { test as setup, expect } from '@playwright/test';

setup('authenticate as Admin and save state', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await page.locator('input[name="username"]').fill(process.env.TEST_USER_EMAIL   || 'Admin');
  await page.locator('input[name="password"]').fill(process.env.TEST_USER_PASSWORD || 'admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Confirm successful login
  await expect(page).toHaveURL(/dashboard/);

  // Persist cookies + localStorage for all downstream tests
  await page.context().storageState({ path: 'auth/storageState.json' });
  console.log('✅ Auth state saved to auth/storageState.json');
});
