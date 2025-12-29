import { test, expect } from '@playwright/test';

test.describe('App Visual Tests', () => {
  test('homepage loads and displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForSelector('h1');
    
    // Check that the main title is visible
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('aussiedatagal');
    
    // Check that intro text is visible
    const intro = page.locator('text=/A collection of projects/');
    await expect(intro).toBeVisible();
  });

  test('all projects are displayed', async ({ page }) => {
    await page.goto('/');
    
    // Wait for projects to load
    await page.waitForSelector('.project-card', { timeout: 10000 });
    
    // Check that project cards are visible
    const projectCards = page.locator('.project-card');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that at least one project has a description
    const firstCard = projectCards.first();
    await expect(firstCard.locator('.project-description')).toBeVisible();
  });

  test('screenshot: homepage viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });
    
    // Wait for all loading spinners to disappear (project previews loading)
    const loadingSpinners = page.locator('.project-preview-loading');
    let spinnerCount = await loadingSpinners.count();
    
    // Wait up to 30 seconds for all spinners to disappear
    const maxWaitTime = 30000;
    const startTime = Date.now();
    while (spinnerCount > 0 && (Date.now() - startTime) < maxWaitTime) {
      await page.waitForTimeout(1000);
      spinnerCount = await loadingSpinners.count();
    }
    
    // Wait for any remaining network requests and animations to settle
    await page.waitForTimeout(3000);
    
    // Take a viewport screenshot (more stable than full page with dynamic content)
    await expect(page).toHaveScreenshot('homepage-viewport.png', {
      maxDiffPixels: 10000, // Higher tolerance for dynamic content
      threshold: 0.15, // Allow 15% pixel difference
    });
  });

  test('screenshot: header section', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
    
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header.png', {
      maxDiffPixels: 50,
    });
  });

  test('screenshot: first project card', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });
    
    // Wait for the first project's loading spinner to disappear
    const firstCard = page.locator('.project-card').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for loading spinner in first card to disappear
    const firstCardSpinner = firstCard.locator('.project-preview-loading');
    await firstCardSpinner.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {
      // If no spinner, that's fine
    });
    
    // Wait longer for preview content to fully load and settle
    await page.waitForTimeout(3000);
    
    // Screenshot just the first project card (more stable than entire section)
    // Note: Card height may vary based on preview content loading
    await expect(firstCard).toHaveScreenshot('first-project-card.png', {
      maxDiffPixels: 10000, // Higher tolerance for varying preview content
      threshold: 0.2, // Allow 20% pixel difference
    });
  });

  test('footer is visible and has correct links', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check footer text
    await expect(footer.locator('text=/All projects are open source/')).toBeVisible();
    
    // Check contact links
    const contactLink = footer.locator('a:has-text("Contact me")');
    await expect(contactLink).toBeVisible();
    
    const emailLink = footer.locator('a:has-text("Email")');
    await expect(emailLink).toBeVisible();
  });

  test('project cards have source code links', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.project-card', { timeout: 10000 });
    
    const sourceLinks = page.locator('.project-links a');
    const count = await sourceLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that links open in new tab
    const firstLink = sourceLinks.first();
    await expect(firstLink).toHaveAttribute('target', '_blank');
    await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

