import { test, expect } from '@playwright/test';

test.describe('PrayLock Main Flow', () => {
  test('Landing page loads and navigates to Login', async ({ page }) => {
    await page.goto('/landing');
    
    // Check main title is visible
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Check pricing section
    await expect(page.getByText('Get Started', { exact: false }).first()).toBeVisible();

    // Click on CTA and verify navigation to signup
    const ctaButton = page.locator('a', { hasText: 'Get Started' }).first();
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await expect(page).toHaveURL(/.*\/auth\/signup.*/);
    }
  });

  test('Login page has correct fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check form fields
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    
    // Check navigation to signup
    await page.getByRole('link', { name: 'S\'inscrire' }).click();
    await expect(page).toHaveURL(/.*\/auth\/signup.*/);
  });
});
