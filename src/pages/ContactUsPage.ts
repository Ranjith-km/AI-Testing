/**
 * src/pages/ContactUsPage.ts
 * Contact Us page object for Joyalukkas Foundation website
 * Handles contact form interactions and validation
 */

import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';
import { COMMON_SELECTORS } from '../constants/selectors';

export interface ContactFormData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  subject?: string;
  message?: string;
  category?: string;
}

export class ContactUsPage extends BasePage {
  // ========== PAGE LOCATORS ==========
  readonly pageTitle: string = 'Contact Us Page';
  readonly pageHeading: Locator = this.page.locator('[data-testid="page-title"]');
  readonly pageDescription: Locator = this.page.locator('[data-testid="page-description"]');

  // Contact Information Section
  readonly contactInfoSection: Locator = this.page.locator('[data-testid="contact-info-section"]');
  readonly address: Locator = this.page.locator('[data-testid="address"]');
  readonly email: Locator = this.page.locator('[data-testid="contact-email"]');
  readonly phone: Locator = this.page.locator('[data-testid="contact-phone"]');

  // Contact Form Elements
  readonly contactForm: Locator = this.page.locator(COMMON_SELECTORS.CONTACT_FORM.primary);
  readonly nameInput: Locator = this.page.locator(COMMON_SELECTORS.CONTACT_NAME.primary);
  readonly emailInput: Locator = this.page.locator(COMMON_SELECTORS.CONTACT_EMAIL.primary);
  readonly phoneInput: Locator = this.page.locator('[data-testid="contact-phone-input"]');
  readonly subjectInput: Locator = this.page.locator('[data-testid="contact-subject"]');
  readonly categorySelect: Locator = this.page.locator('[data-testid="contact-category"]');
  readonly messageTextarea: Locator = this.page.locator(COMMON_SELECTORS.CONTACT_MESSAGE.primary);
  readonly submitButton: Locator = this.page.locator(COMMON_SELECTORS.CONTACT_SUBMIT.primary);
  readonly resetButton: Locator = this.page.locator('[data-testid="contact-reset"]');

  // Form Validation Messages
  readonly nameErrorMessage: Locator = this.page.locator('[data-testid="name-error"]');
  readonly emailErrorMessage: Locator = this.page.locator('[data-testid="email-error"]');
  readonly phoneErrorMessage: Locator = this.page.locator('[data-testid="phone-error"]');
  readonly messageErrorMessage: Locator = this.page.locator('[data-testid="message-error"]');

  // Form Response Messages
  readonly successMessage: Locator = this.page.locator('[data-testid="form-success-message"]');
  readonly errorMessage: Locator = this.page.locator('[data-testid="form-error-message"]');
  readonly processingMessage: Locator = this.page.locator('[data-testid="form-processing"]');

  // Captcha Elements
  readonly captchaContainer: Locator = this.page.locator('[data-testid="captcha"]');
  readonly captchaCheckbox: Locator = this.page.locator('iframe[src*="recaptcha"]');

  // Additional Elements
  readonly formLoadingSpinner: Locator = this.page.locator('[data-testid="form-loading"]');

  constructor(page: Page) {
    super(page, 'ContactUsPage');
  }

  // ========== NAVIGATION METHODS ==========

  /**
   * Navigate to contact page
   */
  async navigateToContact(): Promise<void> {
    this.logger.info('Navigating to contact page');
    await this.goto(`${process.env.BASE_URL || 'http://localhost:3000'}${ENDPOINTS.CONTACT_US}`);
    await this.verifyContactPage();
  }

  /**
   * Verify contact page loaded correctly
   */
  async verifyContactPage(): Promise<void> {
    this.logger.info('Verifying contact page loaded');
    await this.waitForElementVisible(this.pageHeading);
    await this.waitForElementVisible(this.contactForm);
  }

  // ========== CONTACT INFO METHODS ==========

  /**
   * Get page heading
   */
  async getPageHeading(): Promise<string | null> {
    this.logger.info('Getting page heading');
    return this.getText(this.pageHeading);
  }

  /**
   * Get page description
   */
  async getPageDescription(): Promise<string | null> {
    this.logger.info('Getting page description');
    return this.getText(this.pageDescription);
  }

  /**
   * Get contact address
   */
  async getContactAddress(): Promise<string | null> {
    this.logger.info('Getting contact address');
    return this.getText(this.address);
  }

  /**
   * Get contact email
   */
  async getContactEmail(): Promise<string | null> {
    this.logger.info('Getting contact email');
    return this.getText(this.email);
  }

  /**
   * Get contact phone
   */
  async getContactPhone(): Promise<string | null> {
    this.logger.info('Getting contact phone');
    return this.getText(this.phone);
  }

  // ========== FORM INTERACTION METHODS ==========

  /**
   * Fill contact form with all details
   */
  async fillContactForm(contactData: ContactFormData): Promise<void> {
    this.logger.info('Filling contact form');
    
    if (contactData.fullName) {
      await this.fillName(contactData.fullName);
    }
    
    if (contactData.email) {
      await this.fillEmail(contactData.email);
    }
    
    if (contactData.phoneNumber) {
      await this.fillPhone(contactData.phoneNumber);
    }
    
    if (contactData.subject) {
      await this.fillSubject(contactData.subject);
    }
    
    if (contactData.category) {
      await this.selectCategory(contactData.category);
    }
    
    if (contactData.message) {
      await this.fillMessage(contactData.message);
    }
  }

  /**
   * Fill name field
   */
  async fillName(name: string): Promise<void> {
    this.logger.info(`Filling name: ${name}`);
    await this.fill(this.nameInput, name);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    this.logger.info(`Filling email: ${email}`);
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill phone field
   */
  async fillPhone(phone: string): Promise<void> {
    this.logger.info(`Filling phone: ${phone}`);
    await this.fill(this.phoneInput, phone);
  }

  /**
   * Fill subject field
   */
  async fillSubject(subject: string): Promise<void> {
    this.logger.info(`Filling subject: ${subject}`);
    await this.fill(this.subjectInput, subject);
  }

  /**
   * Select category from dropdown
   */
  async selectCategory(category: string): Promise<void> {
    this.logger.info(`Selecting category: ${category}`);
    await this.selectDropdownOption(this.categorySelect, category);
  }

  /**
   * Fill message textarea
   */
  async fillMessage(message: string): Promise<void> {
    this.logger.info(`Filling message (length: ${message.length})`);
    await this.fill(this.messageTextarea, message);
  }

  /**
   * Submit contact form
   */
  async submitForm(): Promise<void> {
    this.logger.info('Submitting contact form');
    await this.click(this.submitButton);
  }

  /**
   * Reset form
   */
  async resetForm(): Promise<void> {
    this.logger.info('Resetting contact form');
    await this.click(this.resetButton);
  }

  // ========== FORM VALIDATION METHODS ==========

  /**
   * Get name error message
   */
  async getNameErrorMessage(): Promise<string | null> {
    this.logger.info('Getting name error message');
    return this.getText(this.nameErrorMessage);
  }

  /**
   * Get email error message
   */
  async getEmailErrorMessage(): Promise<string | null> {
    this.logger.info('Getting email error message');
    return this.getText(this.emailErrorMessage);
  }

  /**
   * Get phone error message
   */
  async getPhoneErrorMessage(): Promise<string | null> {
    this.logger.info('Getting phone error message');
    return this.getText(this.phoneErrorMessage);
  }

  /**
   * Get message error message
   */
  async getMessageErrorMessage(): Promise<string | null> {
    this.logger.info('Getting message error message');
    return this.getText(this.messageErrorMessage);
  }

  /**
   * Check if name field is required
   */
  async isNameRequired(): Promise<boolean> {
    this.logger.info('Checking if name field is required');
    const required = await this.getAttribute(this.nameInput, 'required');
    return required !== null;
  }

  /**
   * Check if email field is required
   */
  async isEmailRequired(): Promise<boolean> {
    this.logger.info('Checking if email field is required');
    const required = await this.getAttribute(this.emailInput, 'required');
    return required !== null;
  }

  /**
   * Check if message field is required
   */
  async isMessageRequired(): Promise<boolean> {
    this.logger.info('Checking if message field is required');
    const required = await this.getAttribute(this.messageTextarea, 'required');
    return required !== null;
  }

  // ========== FORM RESPONSE METHODS ==========

  /**
   * Wait for success message
   */
  async waitForSuccessMessage(timeout?: number): Promise<void> {
    this.logger.info('Waiting for success message');
    await this.waitForElementVisible(this.successMessage, timeout || 10000);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string | null> {
    this.logger.info('Getting success message');
    return this.getText(this.successMessage);
  }

  /**
   * Wait for error message
   */
  async waitForErrorMessage(timeout?: number): Promise<void> {
    this.logger.info('Waiting for error message');
    await this.waitForElementVisible(this.errorMessage, timeout || 5000);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    this.logger.info('Getting error message');
    return this.getText(this.errorMessage);
  }

  /**
   * Wait for processing to complete
   */
  async waitForFormProcessing(timeout?: number): Promise<void> {
    this.logger.info('Waiting for form processing');
    await this.waitForElementHidden(this.formLoadingSpinner, timeout || 10000);
  }

  // ========== FORM STATE METHODS ==========

  /**
   * Get current name value
   */
  async getNameValue(): Promise<string | null> {
    this.logger.info('Getting name field value');
    return this.getAttribute(this.nameInput, 'value');
  }

  /**
   * Get current email value
   */
  async getEmailValue(): Promise<string | null> {
    this.logger.info('Getting email field value');
    return this.getAttribute(this.emailInput, 'value');
  }

  /**
   * Get current message value
   */
  async getMessageValue(): Promise<string | null> {
    this.logger.info('Getting message field value');
    return this.getAttribute(this.messageTextarea, 'value');
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    this.logger.info('Checking if submit button is enabled');
    return this.isElementEnabled(this.submitButton);
  }

  /**
   * Check if form is visible
   */
  async isFormVisible(): Promise<boolean> {
    this.logger.info('Checking if form is visible');
    return this.isElementVisible(this.contactForm);
  }

  // ========== COMPLETE WORKFLOW METHODS ==========

  /**
   * Submit form with complete data
   */
  async submitContactForm(contactData: ContactFormData): Promise<void> {
    this.logger.info('Submitting contact form with data');
    await this.fillContactForm(contactData);
    await this.submitForm();
    await this.waitForFormProcessing();
    await this.waitForSuccessMessage();
  }

  /**
   * Verify form fields are populated with data
   */
  async verifyFormFieldsPopulated(contactData: ContactFormData): Promise<boolean> {
    this.logger.info('Verifying form fields are populated');
    
    if (contactData.fullName) {
      const name = await this.getNameValue();
      if (name !== contactData.fullName) return false;
    }
    
    if (contactData.email) {
      const email = await this.getEmailValue();
      if (email !== contactData.email) return false;
    }
    
    if (contactData.message) {
      const message = await this.getMessageValue();
      if (message !== contactData.message) return false;
    }
    
    return true;
  }

  /**
   * Clear all form fields
   */
  async clearFormFields(): Promise<void> {
    this.logger.info('Clearing all form fields');
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.subjectInput.clear();
    await this.messageTextarea.clear();
  }
}

export default ContactUsPage;
