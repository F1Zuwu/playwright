// @ts-check
import { test, expect } from '@playwright/test';

test('has the correct page loaded', async ({ page }) => {
  await page.goto('https://raimokivi.ee/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Raimo Kivi/);
});

test('has a project card loaded', async ({ page }) => {
  await page.goto('https://raimokivi.ee/projects/');
  await page.waitForLoadState('domcontentloaded');

  const firstProjectCard = page.locator(
    '#root > div > div > div.w-3\\/4.lg\\:w-1\\/2.mobile-full > div.flex.flex-col.gap-4.mt-8.projects-container.opacity-0.pb-12 > div:nth-child(1)'
  );

  // Only require it to exist in the DOM.
  await expect(firstProjectCard).toBeAttached();
});

test('has featured projects loaded in the front page', async ({ page }) => {
  await page.goto('https://raimokivi.ee/');
  await page.waitForLoadState('domcontentloaded');

  // Featured projects load after scrolling into view (lazy-load / intersection observer).
  await page.locator('#projects-container').scrollIntoViewIfNeeded();

  const firstProjectCard = page.locator(
    '#projects-container > div > div.p-4.b-1.rounded-sm.flex.items-center.flex-col.gap-4.load-in-view-6.opacity-0.translate-y-20 > div:nth-child(2)'
  );

  // Only require it to exist in the DOM.
  await expect(firstProjectCard).toBeAttached({ timeout: 15_000 });
});
