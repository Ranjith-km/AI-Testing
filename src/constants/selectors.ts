/**
 * src/constants/selectors.ts
 * CSS Selectors and XPath expressions for common page elements
 * Priority: data-testid > id > name > CSS > XPath
 */

export const COMMON_SELECTORS = {
  // Header Elements
  HEADER: {
    primary: '[data-testid="header"]',
    fallback: 'header',
    xpath: '//header'
  },
  
  LOGO: {
    primary: '[data-testid="logo"]',
    fallback: '.logo, .header-logo',
    xpath: '//img[@alt="Joyalukkas Foundation"]'
  },
  
  NAV_MENU: {
    primary: '[data-testid="nav-menu"]',
    fallback: 'nav, [role="navigation"]',
    xpath: '//nav'
  },
  
  NAV_LINK: {
    primary: '[data-testid="nav-link"]',
    fallback: 'a[href]',
    xpath: '//nav//a'
  },
  
  MOBILE_MENU_TOGGLE: {
    primary: '[data-testid="mobile-menu-toggle"]',
    fallback: '.hamburger, .menu-toggle',
    xpath: '//button[contains(@class, "hamburger") or contains(@class, "menu-toggle")]'
  },
  
  // Footer Elements
  FOOTER: {
    primary: '[data-testid="footer"]',
    fallback: 'footer',
    xpath: '//footer'
  },
  
  FOOTER_LINK: {
    primary: '[data-testid="footer-link"]',
    fallback: 'footer a[href]',
    xpath: '//footer//a'
  },
  
  // Form Elements
  FORM_CONTAINER: {
    primary: '[data-testid="form"]',
    fallback: 'form, [role="form"]',
    xpath: '//form'
  },
  
  INPUT_TEXT: {
    primary: '[data-testid="input-text"]',
    fallback: 'input[type="text"]',
    xpath: '//input[@type="text"]'
  },
  
  INPUT_EMAIL: {
    primary: '[data-testid="input-email"]',
    fallback: 'input[type="email"]',
    xpath: '//input[@type="email"]'
  },
  
  INPUT_PHONE: {
    primary: '[data-testid="input-phone"]',
    fallback: 'input[type="tel"], input[name*="phone"]',
    xpath: '//input[@type="tel" or contains(@name, "phone")]'
  },
  
  INPUT_TEXTAREA: {
    primary: '[data-testid="textarea"]',
    fallback: 'textarea',
    xpath: '//textarea'
  },
  
  SELECT_DROPDOWN: {
    primary: '[data-testid="select"]',
    fallback: 'select',
    xpath: '//select'
  },
  
  CHECKBOX: {
    primary: '[data-testid="checkbox"]',
    fallback: 'input[type="checkbox"]',
    xpath: '//input[@type="checkbox"]'
  },
  
  RADIO_BUTTON: {
    primary: '[data-testid="radio"]',
    fallback: 'input[type="radio"]',
    xpath: '//input[@type="radio"]'
  },
  
  FORM_BUTTON: {
    primary: '[data-testid="form-button"]',
    fallback: 'button[type="submit"], input[type="submit"]',
    xpath: '//button[@type="submit"] | //input[@type="submit"]'
  },
  
  // Contact Form Specific
  CONTACT_FORM: {
    primary: '[data-testid="contact-form"]',
    fallback: '.contact-form, form[name="contact"]',
    xpath: '//form[contains(@class, "contact")]'
  },
  
  CONTACT_NAME: {
    primary: '[data-testid="contact-name"]',
    fallback: 'input[name="name"], input[name="fullName"]',
    xpath: '//input[@name="name" or @name="fullName"]'
  },
  
  CONTACT_EMAIL: {
    primary: '[data-testid="contact-email"]',
    fallback: 'input[name="email"]',
    xpath: '//input[@name="email"]'
  },
  
  CONTACT_MESSAGE: {
    primary: '[data-testid="contact-message"]',
    fallback: 'textarea[name="message"]',
    xpath: '//textarea[@name="message"]'
  },
  
  CONTACT_SUBMIT: {
    primary: '[data-testid="contact-submit"]',
    fallback: 'button[type="submit"]',
    xpath: '//button[@type="submit"]'
  },
  
  // Content Elements
  PAGE_TITLE: {
    primary: '[data-testid="page-title"]',
    fallback: 'h1, .page-title',
    xpath: '//h1'
  },
  
  PAGE_DESCRIPTION: {
    primary: '[data-testid="page-description"]',
    fallback: 'p, .page-description',
    xpath: '//p'
  },
  
  CARD: {
    primary: '[data-testid="card"]',
    fallback: '.card, [role="article"]',
    xpath: '//*[@role="article"]'
  },
  
  IMAGE: {
    primary: '[data-testid="image"]',
    fallback: 'img',
    xpath: '//img'
  },
  
  // Button Elements
  PRIMARY_BUTTON: {
    primary: '[data-testid="button-primary"]',
    fallback: 'button.btn-primary, button.primary',
    xpath: '//button[contains(@class, "btn-primary") or contains(@class, "primary")]'
  },
  
  SECONDARY_BUTTON: {
    primary: '[data-testid="button-secondary"]',
    fallback: 'button.btn-secondary, button.secondary',
    xpath: '//button[contains(@class, "btn-secondary") or contains(@class, "secondary")]'
  },
  
  // Modal/Dialog Elements
  MODAL: {
    primary: '[data-testid="modal"]',
    fallback: '.modal, [role="dialog"]',
    xpath: '//*[@role="dialog"]'
  },
  
  MODAL_CLOSE: {
    primary: '[data-testid="modal-close"]',
    fallback: '.modal-close, [aria-label="Close"]',
    xpath: '//button[@aria-label="Close"]'
  },
  
  // Notification Elements
  ALERT: {
    primary: '[data-testid="alert"]',
    fallback: '.alert, [role="alert"]',
    xpath: '//*[@role="alert"]'
  },
  
  SUCCESS_MESSAGE: {
    primary: '[data-testid="success-message"]',
    fallback: '.alert-success, .success-message',
    xpath: '//*[contains(@class, "alert-success") or contains(@class, "success")]'
  },
  
  ERROR_MESSAGE: {
    primary: '[data-testid="error-message"]',
    fallback: '.alert-error, .error-message',
    xpath: '//*[contains(@class, "alert-error") or contains(@class, "error")]'
  },
  
  // Breadcrumb Elements
  BREADCRUMB: {
    primary: '[data-testid="breadcrumb"]',
    fallback: 'nav[aria-label="Breadcrumb"], .breadcrumb',
    xpath: '//nav[@aria-label="Breadcrumb"]'
  },
  
  BREADCRUMB_ITEM: {
    primary: '[data-testid="breadcrumb-item"]',
    fallback: '.breadcrumb-item',
    xpath: '//ol//li'
  },
  
  // Pagination Elements
  PAGINATION: {
    primary: '[data-testid="pagination"]',
    fallback: 'nav[aria-label="Pagination"], .pagination',
    xpath: '//nav[@aria-label="Pagination"]'
  },
  
  PAGINATION_NEXT: {
    primary: '[data-testid="pagination-next"]',
    fallback: 'a[rel="next"], button[aria-label*="next"]',
    xpath: '//a[@rel="next"] | //button[contains(@aria-label, "next")]'
  },
  
  // Search Elements
  SEARCH_INPUT: {
    primary: '[data-testid="search-input"]',
    fallback: 'input[type="search"], input[placeholder*="search"]',
    xpath: '//input[@type="search" or contains(@placeholder, "search")]'
  },
  
  SEARCH_RESULTS: {
    primary: '[data-testid="search-results"]',
    fallback: '.search-results',
    xpath: '//div[contains(@class, "search-results")]'
  },
  
  // Accessibility Elements
  SKIP_LINK: {
    primary: '[data-testid="skip-link"]',
    fallback: 'a.skip-link, a[href="#main"]',
    xpath: '//a[@class="skip-link" or @href="#main"]'
  },
  
  MAIN_CONTENT: {
    primary: '[data-testid="main"]',
    fallback: 'main, [role="main"]',
    xpath: '//main | //*[@role="main"]'
  }
};

export default { COMMON_SELECTORS };
