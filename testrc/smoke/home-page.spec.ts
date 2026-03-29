/**
 * tests/smoke/home-page.spec.ts
 * Smoke tests for Home Page
 * These are critical tests for core home page functionality
 * Marked with @smoke tag for inclusion in smoke test suite
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { TEST_DATA } from '../../src/constants/testData';

test.describe('Home Page - Smoke Tests @smoke', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('HOME-001: Verify home page loads successfully', async ({ page }) => {
    // Verify page title
    const title = await homePage.getPageTitle();
    expect(title).toBeTruthy();
    expect(title?.toLowerCase()).toContain('home');

    // Verify hero section is visible
    const heroVisible = await homePage.isElementVisible(homePage.heroBanner);
    expect(heroVisible).toBe(true);

    // Verify hero title
    const heroTitle = await homePage.getHeroTitle();
    expect(heroTitle).toBeTruthy();
    expect(heroTitle?.length).toBeGreaterThan(0);
  });

  test('HOME-002: Verify landing page hero section displays correctly', async () => {
    // Check hero image is visible
    const imageVisible = await homePage.isHeroImageDisplayed();
    expect(imageVisible).toBe(true);

    // Check hero subtitle is visible
    const subtitle = await homePage.getHeroSubtitle();
    expect(subtitle).toBeTruthy();

    // Check CTA button is clickable
    const buttonEnabled = await homePage.isElementEnabled(homePage.ctaButton);
    expect(buttonEnabled).toBe(true);
  });

  test('HOME-003: Verify initiatives section displays on home page', async () => {
    // Scroll to initiatives section
    await homePage.scrollToSection(homePage.initiativesSection);

    // Verify section is visible
    const sectionVisible = await homePage.isInitiativesSectionVisible();
    expect(sectionVisible).toBe(true);

    // Verify initiative cards are present
    const cardCount = await homePage.getInitiativeCardCount();
    expect(cardCount).toBeGreaterThan(0);

    // Verify first initiative card has title
    const firstCardTitle = await homePage.getInitiativeCardTitle(1);
    expect(firstCardTitle).toBeTruthy();
  });

  test('HOME-004: Verify news section displays on home page', async () => {
    // Scroll to news section
    await homePage.scrollToSection(homePage.newsSection);

    // Verify section is visible
    const sectionVisible = await homePage.isNewsSectionVisible();
    expect(sectionVisible).toBe(true);

    // Verify news cards are present
    const cardCount = await homePage.getNewsCardCount();
    expect(cardCount).toBeGreaterThan(0);

    // Verify first news card has title
    const firstCardTitle = await homePage.getNewsCardTitle(1);
    expect(firstCardTitle).toBeTruthy();
  });

  test('HOME-005: Verify statistics section displays on home page', async () => {
    // Scroll to stats section
    await homePage.scrollToSection(homePage.statsSection);

    // Verify section is visible
    const statsVisible = await homePage.isStatsSectionVisible();
    expect(statsVisible).toBe(true);

    // Verify statistics are displayed
    const stats = await homePage.getAllStatistics();
    expect(stats.length).toBeGreaterThan(0);

    // Verify each stat has label and value
    for (const stat of stats) {
      expect(stat.label).toBeTruthy();
      expect(stat.value).toBeTruthy();
    }
  });

  test('HOME-006: Verify newsletter section is visible and functional @smoke', async () => {
    // Scroll to newsletter section
    await homePage.scrollToSection(homePage.newsletterSection);

    // Verify section is visible
    const sectionVisible = await homePage.isNewsletterSectionVisible();
    expect(sectionVisible).toBe(true);

    // Verify newsletter input is visible
    const inputVisible = await homePage.isElementVisible(homePage.newsletterInput);
    expect(inputVisible).toBe(true);

    // Verify subscribe button is visible and enabled
    const buttonVisible = await homePage.isElementVisible(homePage.newsletterButton);
    expect(buttonVisible).toBe(true);
  });

  test('HOME-007: Test newsletter subscription with valid email', async () => {
    // Get valid email from test data
    const email = TEST_DATA.VALID_EMAILS[0];

    // Scroll to newsletter section
    await homePage.scrollToSection(homePage.newsletterSection);

    // Subscribe to newsletter
    await homePage.subscribeToNewsletter(email);

    // Verify success message
    const message = await homePage.getNewsletterSuccessMessage();
    expect(message?.toLowerCase()).toContain('subscribed');
  });

  test('HOME-008: Verify navigation menu links are present', async () => {
    // Verify navigation menu is visible
    const navVisible = await homePage.isElementVisible(homePage.navigationMenu);
    expect(navVisible).toBe(true);

    // Verify nav links are present
    const aboutVisible = await homePage.isElementVisible(homePage.aboutLink);
    const initiativesVisible = await homePage.isElementVisible(homePage.initiativesLink);
    const newsVisible = await homePage.isElementVisible(homePage.newsLink);
    const contactVisible = await homePage.isElementVisible(homePage.contactLink);

    expect(aboutVisible).toBe(true);
    expect(initiativesVisible).toBe(true);
    expect(newsVisible).toBe(true);
    expect(contactVisible).toBe(true);
  });

  test('HOME-009: Verify all main sections are visible on page', async () => {
    // Verify all sections visible
    const allVisible = await homePage.verifyAllSectionsVisible();
    expect(allVisible).toBe(true);
  });

  test('HOME-010: Test page navigation to contact page from home', async () => {
    // Click contact link
    await homePage.navigateToContact();

    // Verify URL changed
    const url = homePage.getCurrentUrl();
    expect(url).toContain('contact');
  });

  test.afterEach(async () => {
    // Capture screenshot on failure
    if (test.info().status !== 'passed') {
      await homePage.captureScreenshot(`failure-${Date.now()}.png`);
    }
    // Cleanup
    await homePage.tearDown();
  });
});

test.describe('Home Page - Accessibility Tests @smoke', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('HOME-A001: Verify page has proper heading hierarchy', async () => {
    // Verify main heading (h1) exists
    const h1 = homePage.page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('HOME-A002: Verify links are accessible', async () => {
    // Get all nav links
    const navLinks = await homePage.navigationMenu.locator('a').count();
    expect(navLinks).toBeGreaterThan(0);

    // Verify each link is visible
    for (let i = 0; i < navLinks && i < 5; i++) {
      const link = homePage.navigationMenu.locator('a').nth(i);
      const isVisible = await link.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test.afterEach(async () => {
    if (test.info().status !== 'passed') {
      await homePage.captureScreenshot(`a11y-failure-${Date.now()}.png`);
    }
    await homePage.tearDown();
  });
});
