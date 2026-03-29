/**
 * src/pages/HomePage.ts
 * Home page object for Joyalukkas Foundation website
 * Inherits from BasePage and includes home page-specific locators and methods
 */

import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';
import { COMMON_SELECTORS } from '../constants/selectors';

export class HomePage extends BasePage {
  // ========== HOME PAGE LOCATORS ==========
  readonly header: Locator = this.page.locator(COMMON_SELECTORS.HEADER.primary);
  readonly footer: Locator = this.page.locator(COMMON_SELECTORS.FOOTER.primary);
  readonly pageTitle: string = 'Home Page';

  // Hero Section
  readonly heroBanner: Locator = this.page.locator('[data-testid="hero-banner"]');
  readonly heroTitle: Locator = this.page.locator('[data-testid="hero-title"]');
  readonly heroSubtitle: Locator = this.page.locator('[data-testid="hero-subtitle"]');
  readonly heroImage: Locator = this.page.locator('[data-testid="hero-image"]');
  readonly ctaButton: Locator = this.page.locator('[data-testid="cta-button"]');

  // Featured Initiatives
  readonly initiativesSection: Locator = this.page.locator('[data-testid="initiatives-section"]');
  readonly initiativeCards: Locator = this.page.locator('[data-testid="initiative-card"]');
  readonly initiativeCard = (index: number): Locator => 
    this.page.locator(`[data-testid="initiative-card"]:nth-child(${index})`);

  // Latest News Section
  readonly newsSection: Locator = this.page.locator('[data-testid="news-section"]');
  readonly newsCards: Locator = this.page.locator('[data-testid="news-card"]');
  readonly newsCard = (index: number): Locator =>
    this.page.locator(`[data-testid="news-card"]:nth-child(${index})`);
  readonly viewAllNewsLink: Locator = this.page.locator('[data-testid="view-all-news"]');

  // Statistics Section
  readonly statsSection: Locator = this.page.locator('[data-testid="stats-section"]');
  readonly statItems: Locator = this.page.locator('[data-testid="stat-item"]');
  readonly statItem = (index: number): Locator =>
    this.page.locator(`[data-testid="stat-item"]:nth-child(${index})`);
  readonly statValue = (index: number): Locator =>
    this.page.locator(`[data-testid="stat-item"]:nth-child(${index}) [data-testid="stat-value"]`);
  readonly statLabel = (index: number): Locator =>
    this.page.locator(`[data-testid="stat-item"]:nth-child(${index}) [data-testid="stat-label"]`);

  // Newsletter Subscription
  readonly newsletterSection: Locator = this.page.locator('[data-testid="newsletter-section"]');
  readonly newsletterInput: Locator = this.page.locator('[data-testid="newsletter-email"]');
  readonly newsletterButton: Locator = this.page.locator('[data-testid="newsletter-submit"]');
  readonly newsletterMessage: Locator = this.page.locator('[data-testid="newsletter-message"]');

  // Navigation
  readonly navigationMenu: Locator = this.page.locator(COMMON_SELECTORS.NAV_MENU.primary);
  readonly aboutLink: Locator = this.page.locator('a[href*="about"]');
  readonly initiativesLink: Locator = this.page.locator('a[href*="initiatives"]');
  readonly newsLink: Locator = this.page.locator('a[href*="news"], a[href*="insights"]');
  readonly contactLink: Locator = this.page.locator('a[href*="contact"]');

  constructor(page: Page) {
    super(page, 'HomePage');
  }

  // ========== NAVIGATION METHODS ==========

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    this.logger.info('Navigating to home page');
    await this.goto(process.env.ENVIRONMENT === 'production' 
      ? 'https://joyalukkas.org' 
      : `${process.env.BASE_URL || 'http://localhost:3000'}${ENDPOINTS.HOME}`
    );
    await this.verifyHomePage();
  }

  /**
   * Verify home page loaded
   */
  async verifyHomePage(): Promise<void> {
    this.logger.info('Verifying home page loaded');
    await this.waitForElementVisible(this.heroBanner);
    await this.waitForElementVisible(this.heroTitle);
  }

  // ========== HERO SECTION METHODS ==========

  /**
   * Get hero title text
   */
  async getHeroTitle(): Promise<string | null> {
    this.logger.info('Getting hero title');
    return this.getText(this.heroTitle);
  }

  /**
   * Get hero subtitle text
   */
  async getHeroSubtitle(): Promise<string | null> {
    this.logger.info('Getting hero subtitle');
    return this.getText(this.heroSubtitle);
  }

  /**
   * Click hero CTA button
   */
  async clickHeroCtaButton(): Promise<void> {
    this.logger.info('Clicking hero CTA button');
    await this.click(this.ctaButton);
  }

  /**
   * Verify hero image is displayed
   */
  async isHeroImageDisplayed(): Promise<boolean> {
    this.logger.info('Checking if hero image is displayed');
    return this.isElementVisible(this.heroImage);
  }

  // ========== INITIATIVES SECTION METHODS ==========

  /**
   * Verify initiatives section is visible
   */
  async isInitiativesSectionVisible(): Promise<boolean> {
    this.logger.info('Checking if initiatives section is visible');
    return this.isElementVisible(this.initiativesSection);
  }

  /**
   * Get number of initiative cards
   */
  async getInitiativeCardCount(): Promise<number> {
    this.logger.info('Getting initiative card count');
    return this.getElementCount(this.initiativeCards);
  }

  /**
   * Get initiative card title
   */
  async getInitiativeCardTitle(index: number): Promise<string | null> {
    this.logger.info(`Getting initiative card title at index ${index}`);
    const titleLocator = this.page.locator(
      `[data-testid="initiative-card"]:nth-child(${index}) [data-testid="card-title"]`
    );
    return this.getText(titleLocator);
  }

  /**
   * Click initiative card
   */
  async clickInitiativeCard(index: number): Promise<void> {
    this.logger.info(`Clicking initiative card at index ${index}`);
    await this.click(this.initiativeCard(index));
  }

  // ========== NEWS SECTION METHODS ==========

  /**
   * Verify news section is visible
   */
  async isNewsSectionVisible(): Promise<boolean> {
    this.logger.info('Checking if news section is visible');
    return this.isElementVisible(this.newsSection);
  }

  /**
   * Get number of news cards
   */
  async getNewsCardCount(): Promise<number> {
    this.logger.info('Getting news card count');
    return this.getElementCount(this.newsCards);
  }

  /**
   * Get news card title
   */
  async getNewsCardTitle(index: number): Promise<string | null> {
    this.logger.info(`Getting news card title at index ${index}`);
    const titleLocator = this.page.locator(
      `[data-testid="news-card"]:nth-child(${index}) [data-testid="card-title"]`
    );
    return this.getText(titleLocator);
  }

  /**
   * Click news card
   */
  async clickNewsCard(index: number): Promise<void> {
    this.logger.info(`Clicking news card at index ${index}`);
    await this.click(this.newsCard(index));
  }

  /**
   * Click "View All News" link
   */
  async clickViewAllNews(): Promise<void> {
    this.logger.info('Clicking "View All News" link');
    await this.click(this.viewAllNewsLink);
  }

  // ========== STATISTICS SECTION METHODS ==========

  /**
   * Verify stats section is visible
   */
  async isStatsSectionVisible(): Promise<boolean> {
    this.logger.info('Checking if stats section is visible');
    return this.isElementVisible(this.statsSection);
  }

  /**
   * Get stat value by index
   */
  async getStatValue(index: number): Promise<string | null> {
    this.logger.info(`Getting stat value at index ${index}`);
    return this.getText(this.statValue(index));
  }

  /**
   * Get stat label by index
   */
  async getStatLabel(index: number): Promise<string | null> {
    this.logger.info(`Getting stat label at index ${index}`);
    return this.getText(this.statLabel(index));
  }

  /**
   * Get all statistics
   */
  async getAllStatistics(): Promise<Array<{ label: string | null; value: string | null }>> {
    this.logger.info('Getting all statistics');
    const count = await this.getElementCount(this.statItems);
    const stats = [];

    for (let i = 1; i <= count; i++) {
      const label = await this.getStatLabel(i);
      const value = await this.getStatValue(i);
      stats.push({ label, value });
    }

    return stats;
  }

  // ========== NEWSLETTER SECTION METHODS ==========

  /**
   * Verify newsletter section is visible
   */
  async isNewsletterSectionVisible(): Promise<boolean> {
    this.logger.info('Checking if newsletter section is visible');
    return this.isElementVisible(this.newsletterSection);
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    this.logger.info(`Subscribing to newsletter with email: ${email}`);
    await this.fill(this.newsletterInput, email);
    await this.click(this.newsletterButton);
    await this.waitForText(this.newsletterMessage, 'subscribed', 10000);
  }

  /**
   * Get newsletter success message
   */
  async getNewsletterSuccessMessage(): Promise<string | null> {
    this.logger.info('Getting newsletter success message');
    return this.getText(this.newsletterMessage);
  }

  // ========== NAVIGATION METHODS ==========

  /**
   * Navigate to initiatives page
   */
  async navigateToInitiatives(): Promise<void> {
    this.logger.info('Navigating to initiatives page');
    await this.click(this.initiativesLink);
    await this.waitForUrlChange('**/initiatives', 10000);
  }

  /**
   * Navigate to news page
   */
  async navigateToNews(): Promise<void> {
    this.logger.info('Navigating to news page');
    await this.click(this.newsLink);
    await this.waitForUrlChange('**/news', 10000);
  }

  /**
   * Navigate to about page
   */
  async navigateToAbout(): Promise<void> {
    this.logger.info('Navigating to about page');
    await this.click(this.aboutLink);
    await this.waitForUrlChange('**/about', 10000);
  }

  /**
   * Navigate to contact page
   */
  async navigateToContact(): Promise<void> {
    this.logger.info('Navigating to contact page');
    await this.click(this.contactLink);
    await this.waitForUrlChange('**/contact', 10000);
  }

  // ========== VERIFICATION METHODS ==========

  /**
   * Verify all main sections are visible
   */
  async verifyAllSectionsVisible(): Promise<boolean> {
    this.logger.info('Verifying all main sections are visible');
    const heroVisible = await this.isElementVisible(this.heroBanner);
    const initiativesVisible = await this.isInitiativesSectionVisible();
    const newsVisible = await this.isNewsSectionVisible();
    const statsVisible = await this.isStatsSectionVisible();
    const newsletterVisible = await this.isNewsletterSectionVisible();

    return heroVisible && initiativesVisible && newsVisible && statsVisible && newsletterVisible;
  }

  /**
   * Scroll to section
   */
  async scrollToSection(sectionLocator: Locator): Promise<void> {
    this.logger.info('Scrolling to section');
    await sectionLocator.scrollIntoViewIfNeeded();
    await this.waitForTimeout(500);
  }
}

export default HomePage;
