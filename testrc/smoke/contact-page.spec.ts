/**
 * tests/smoke/contact-page.spec.ts
 * Smoke tests for Contact Us Page
 * Tests for contact form submission and validation
 * Marked with @smoke tag for inclusion in smoke test suite
 */

import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../../src/pages/ContactUsPage';
import { TEST_DATA } from '../../src/constants/testData';

test.describe('Contact Us Page - Smoke Tests @smoke', () => {
  let contactPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactUsPage(page);
    await contactPage.navigateToContact();
  });

  test('CONTACT-001: Verify contact page loads successfully', async ({ page }) => {
    // Verify page title
    const title = await contactPage.getPageTitle();
    expect(title).toBeTruthy();

    // Verify page description
    const description = await contactPage.getPageDescription();
    expect(description).toBeTruthy();

    // Verify contact form is visible
    const formVisible = await contactPage.isFormVisible();
    expect(formVisible).toBe(true);
  });

  test('CONTACT-002: Verify contact information is displayed', async () => {
    // Verify contact info section is visible
    const sectionVisible = await contactPage.isElementVisible(contactPage.contactInfoSection);
    expect(sectionVisible).toBe(true);

    // Get contact details
    const address = await contactPage.getContactAddress();
    const email = await contactPage.getContactEmail();
    const phone = await contactPage.getContactPhone();

    // Verify all details are present
    expect(address).toBeTruthy();
    expect(email).toBeTruthy();
    expect(phone).toBeTruthy();
  });

  test('CONTACT-003: Verify contact form has all required fields', async () => {
    // Verify all input fields are present
    const nameVisible = await contactPage.isElementVisible(contactPage.nameInput);
    const emailVisible = await contactPage.isElementVisible(contactPage.emailInput);
    const messageVisible = await contactPage.isElementVisible(contactPage.messageTextarea);
    const submitVisible = await contactPage.isElementVisible(contactPage.submitButton);

    expect(nameVisible).toBe(true);
    expect(emailVisible).toBe(true);
    expect(messageVisible).toBe(true);
    expect(submitVisible).toBe(true);
  });

  test('CONTACT-004: Test successful contact form submission', async () => {
    // Fill contact form with valid data
    const contactData = TEST_DATA.VALID_CONTACT;

    await contactPage.fillContactForm({
      fullName: contactData.fullName,
      email: contactData.email,
      phoneNumber: contactData.phoneNumber,
      subject: contactData.subject,
      message: contactData.message
    });

    // Submit form
    await contactPage.submitForm();

    // Wait for processing
    await contactPage.waitForFormProcessing();

    // Verify success message
    await contactPage.waitForSuccessMessage();
    const successMsg = await contactPage.getSuccessMessage();
    expect(successMsg?.toLowerCase()).toContain('success');
  });

  test('CONTACT-005: Test form validation - empty name field', async () => {
    // Fill form without name
    await contactPage.fillEmail(TEST_DATA.VALID_CONTACT.email);
    await contactPage.fillMessage(TEST_DATA.VALID_CONTACT.message);

    // Try to submit
    await contactPage.submitForm();

    // Verify name error message appears
    const nameError = await contactPage.getNameErrorMessage();
    expect(nameError).toBeTruthy();
  });

  test('CONTACT-006: Test form validation - invalid email format', async () => {
    // Fill form with invalid email
    await contactPage.fillName(TEST_DATA.VALID_CONTACT.fullName);
    await contactPage.fillEmail(TEST_DATA.INVALID_EMAILS[0]);
    await contactPage.fillMessage(TEST_DATA.VALID_CONTACT.message);

    // Try to submit
    await contactPage.submitForm();

    // Verify email error message
    const emailError = await contactPage.getEmailErrorMessage();
    expect(emailError).toBeTruthy();
  });

  test('CONTACT-007: Test form reset functionality', async () => {
    // Fill form
    await contactPage.fillName(TEST_DATA.VALID_CONTACT.fullName);
    await contactPage.fillEmail(TEST_DATA.VALID_CONTACT.email);
    await contactPage.fillMessage(TEST_DATA.VALID_CONTACT.message);

    // Verify fields are filled
    let nameValue = await contactPage.getNameValue();
    expect(nameValue).toBe(TEST_DATA.VALID_CONTACT.fullName);

    // Click reset
    await contactPage.resetForm();

    // Verify fields are cleared
    nameValue = await contactPage.getNameValue();
    expect(nameValue === '' || nameValue === null).toBe(true);
  });

  test('CONTACT-008: Test form submission with minimum required fields', async () => {
    // Fill only required fields
    await contactPage.fillName(TEST_DATA.VALID_CONTACT.fullName);
    await contactPage.fillEmail(TEST_DATA.VALID_CONTACT.email);
    await contactPage.fillMessage(TEST_DATA.VALID_CONTACT.message);

    // Submit form
    await contactPage.submitForm();

    // Wait for processing
    await contactPage.waitForFormProcessing();

    // Verify success
    await contactPage.waitForSuccessMessage();
  });

  test('CONTACT-009: Test form field population with multiple entries', async () => {
    // Test with different contact variations
    for (const contactData of TEST_DATA.CONTACT_VARIATIONS.slice(0, 2)) {
      // Fill form
      await contactPage.fillContactForm(contactData);

      // Verify fields are populated correctly
      const populated = await contactPage.verifyFormFieldsPopulated(contactData);
      expect(populated).toBe(true);

      // Reset for next iteration
      await contactPage.clearFormFields();
    }
  });

  test('CONTACT-010: Verify submit button functionality', async () => {
    // Check button is enabled initially
    let buttonEnabled = await contactPage.isSubmitButtonEnabled();
    expect(buttonEnabled).toBe(true);

    // Fill form
    await contactPage.fillContactForm(TEST_DATA.VALID_CONTACT);

    // Button should still be enabled
    buttonEnabled = await contactPage.isSubmitButtonEnabled();
    expect(buttonEnabled).toBe(true);
  });

  test.afterEach(async () => {
    // Capture screenshot on failure
    if (test.info().status !== 'passed') {
      await contactPage.captureScreenshot(`contact-failure-${Date.now()}.png`);
    }
    // Cleanup
    await contactPage.tearDown();
  });
});

test.describe('Contact Page - Accessibility Tests @smoke', () => {
  let contactPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactUsPage(page);
    await contactPage.navigateToContact();
  });

  test('CONTACT-A001: Verify form fields have proper labels', async () => {
    // Check for label associations
    const form = contactPage.page.locator('[data-testid="contact-form"]');
    const labels = form.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThanOrEqual(3);
  });

  test('CONTACT-A002: Verify form is keyboard navigable', async () => {
    // Tab to first field
    await contactPage.page.keyboard.press('Tab');
    await contactPage.page.waitForTimeout(100);

    // Check if any form field is focused
    const nameFieldFocused = await contactPage.isFocused(contactPage.nameInput);
    const emailFieldFocused = await contactPage.isFocused(contactPage.emailInput);

    expect(nameFieldFocused || emailFieldFocused).toBe(true);
  });

  test.afterEach(async () => {
    if (test.info().status !== 'passed') {
      await contactPage.captureScreenshot(`a11y-failure-${Date.now()}.png`);
    }
    await contactPage.tearDown();
  });
});
