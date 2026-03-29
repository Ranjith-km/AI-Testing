# 🏗️ PHASE 3 — POM ARCHITECTURE DESIGN
## Joyalukkas Foundation Website — Enterprise Playwright Framework

**Status:** ✅ **ARCHITECTURE DESIGNED** — **AWAITING APPROVAL TO PROCEED TO PHASE 4**

> **IMPORTANT:** This phase is DESIGN ONLY. No runtime code or test execution is included. This defines the blueprint that will be implemented in Phase 5.

---

## 📐 EXECUTIVE ARCHITECTURE SUMMARY

```
Framework Type:           Page Object Model (POM) + BDD (Gherkin)
Language:                JavaScript (Node.js ES6+)
Test Runner:             @playwright/test
Design Pattern:          BDD/Gherkin + POM Hybrid
Test Parallelization:    4 workers max
Report Formats:          HTML + JSON + JUnit XML
Browser Targets:         Chrome, Firefox, Safari, Edge
Execution Mode:          CI/CD compatible (headless)
Scalability:             126 tests modular, reusable, maintainable
Development Effort:      7-8 weeks (1 Senior QA + 1 Mid-level QA shared)
```

---

## 1️⃣ FOLDER STRUCTURE & ORGANIZATION

### **Project Root Directory Layout**

```
joyalukkas-qa-automation/
│
├── .github/workflows/                    # CI/CD Configuration
│   ├── smoke-tests.yml                 # Smoke test pipeline (every commit)
│   ├── regression-tests.yml            # Regression tests (daily 2am UTC)
│   ├── full-suite.yml                  # Full test suite (pre-release)
│   └── failed-tests-report.yml         # Failed test report template
│
├── .env.example                         # Environment template
├── .env.staging                         # Staging environment config
├── .env.production                      # Production environment config
├── .env.local                          # Local development config
│
├── playwright.config.ts                 # Main Playwright config
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript config
│
├── src/
│   ├── pages/                          # Page Object Model classes
│   │   ├── BasePage.ts                # Base class (all pages inherit)
│   │   ├── HomePage.ts                # Home page POM
│   │   ├── AboutUsPage.ts             # About Us page POM
│   │   ├── ContactUsPage.ts           # Contact Us form page POM
│   │   ├── InitiativesPage.ts         # Initiatives listing page POM
│   │   ├── InsightsPage.ts            # News/Insights page POM
│   │   └── [11 more pages...]
│   │
│   ├── components/                     # Reusable UI component classes
│   │   ├── Header.ts                  # Header/Navigation component
│   │   ├── MobileMenu.ts              # Hamburger menu component
│   │   ├── Footer.ts                  # Footer component
│   │   ├── ContactForm.ts             # Contact form component
│   │   └── [More components...]
│   │
│   ├── utils/                         # Utility & helper functions
│   │   ├── logger.ts                  # Logging utility
│   │   ├── waitHelpers.ts             # Wait strategies
│   │   ├── retryHelpers.ts            # Retry mechanism
│   │   ├── screenshotHelper.ts        # Screenshot on failure
│   │   ├── dataGenerator.ts           # Test data generation
│   │   ├── configLoader.ts            # Environment config
│   │   └── [More utilities...]
│   │
│   ├── constants/                     # Global constants
│   │   ├── endpoints.ts               # API endpoint URLs
│   │   ├── testData.ts                # Static test data
│   │   ├── timeouts.ts                # Wait timeout values
│   │   └── config.ts
│   │
│   └── fixtures/                      # Test fixtures
│       ├── browserSetup.ts
│       ├── pageFixtures.ts
│       └── apiMocks.ts
│
├── tests/                              # Test specifications
│   ├── smoke/                         # Smoke test suite (P0)
│   ├── regression/                    # Regression tests (P0 + P1)
│   ├── e2e/                           # End-to-end tests
│   └── api/                           # API response validation
│
├── reports/                            # Test execution reports
│   ├── html/
│   ├── json/
│   ├── junit/
│   ├── screenshots/
│   ├── videos/
│   └── logs/
│
└── docs/                               # Documentation
    ├── SETUP.md
    ├── ARCHITECTURE.md
    ├── WRITING_TESTS.md
    └── TROUBLESHOOTING.md
```

---

## 2️⃣ BASE PAGE CLASS ARCHITECTURE

**BasePage.ts** provides:
- Browser context & page management
- Wait strategies (element visible, clickable, text, page load)
- Retry mechanisms with exponential backoff
- Screenshot on failure with metadata
- Structured logging system
- Common interactions (click, type, select, navigate)
- Accessibility helpers (focus, ARIA labels, color contrast)
- Error handling with context-aware logging

### **Key Methods in BasePage**

```
WAIT UTILITIES:
├─ waitForElementVisible(locator, timeout)
├─ waitForElementHidden(locator, timeout)
├─ waitForClickable(locator, timeout)
├─ waitForText(locator, expectedText)
├─ waitForPageLoad(timeout)
└─ waitForCount(locator, count)

RETRY MECHANISMS:
├─ retryWithExponentialBackoff(operation, maxRetries, initialDelay)
└─ retryAssertion(assertion, maxRetries, delay)

INTERACTIONS:
├─ click(locator, retries)
├─ fill(locator, value)
├─ selectDropdownOption(locator, value)
├─ goto(url, waitUntil)
└─ waitForNavigation(action)

ASSERTIONS:
├─ getText(locator)
├─ getAttribute(locator, name)
├─ getAllTexts(locator)
├─ isVisible(locator)
├─ isEnabled(locator)
└─ getCount(locator)

ACCESSIBILITY:
├─ isFocused(locator)
├─ getAriaLabel(locator)
└─ getComputedStyle(locator, property)

SCREENSHOT & LOGGING:
├─ captureScreenshot(testName)
├─ logErrorWithContext(error, context)
└─ getCurrentUrl()

CLEANUP:
├─ closeBrowser()
├─ clearLocalStorage()
├─ clearCookies()
└─ clearCache()
```

---

## 3️⃣ LOCATOR SELECTION STRATEGY

### **Locator Priority (1 = Highest)**

```
PRIORITY 1: [data-testid='...']
  ├─ Purpose: QA automation specific
  ├─ Stability: HIGHEST
  ├─ Example: [data-testid='contact-form-submit']
  └─ Recommendation: ✅ PREFERRED

PRIORITY 2: id or name attributes
  ├─ Purpose: Unique HTML identifiers
  ├─ Stability: HIGH
  ├─ Example: #contact-form or [name='email']
  └─ Recommendation: ✅ Use as primary fallback

PRIORITY 3: CSS Selectors (specific)
  ├─ Purpose: element targeting
  ├─ Stability: MEDIUM
  ├─ Example: .contact-btn.primary:not(:disabled)
  └─ Recommendation: ⚠️ Use with caution

PRIORITY 4: XPath
  ├─ Purpose: Complex element queries
  ├─ Stability: LOW
  ├─ Example: //button[contains(text(), 'Submit')]
  └─ Recommendation: ❌ AVOID if possible
```

---

## 4️⃣ WAIT & RETRY STRATEGIES

### **Wait Timeout Values**

```
IMPLICIT_WAIT        = 10 seconds (element visibility)
EXPLICIT_WAIT        = 5 seconds  (specific condition)
PAGE_LOAD_TIMEOUT    = 30 seconds (full page load)
API_RESPONSE_TIMEOUT = 15 seconds (API call)
QUICK_RESPONSE       = 2 seconds  (quick operations)
```

### **Retry Strategy**

```
Retry with Exponential Backoff:
├─ Attempt 1: Fail → Wait 1 second → Retry
├─ Attempt 2: Fail → Wait 2 seconds → Retry
├─ Attempt 3: Fail → Wait 4 seconds → Retry
└─ Attempt 4: Fail → Throw Error

Retry Assertion (for async state):
├─ Attempt 1: Assertion fails → Wait 500ms → Retry
├─ Attempt 2: Assertion fails → Wait 500ms → Retry
└─ Attempt 3: Assertion fails → Throw Error
```

---

## 5️⃣ SCREENSHOT & LOGGING ARCHITECTURE

### **Screenshot Capture Points**

```
1. BEFORE TEST START       → Verify baseline page state
2. AFTER EACH ACTION       → Optional: verify state changed
3. ON ASSERTION FAILURE    → MANDATORY for debugging
4. ON NAVIGATION           → Verify page loaded correctly
5. ON TEST FAILURE         → MANDATORY: full page screenshot
```

### **Log Levels & Templates**

```
ERROR   → "❌ Element not found: [selector]"
WARN    → "⚠️ Retrying operation... (attempt 2/3)"
INFO    → "✅ Element clicked: [selector]"
DEBUG   → "🔄 Polling for condition... (attempt 1/3)"

Special:
📸 Screenshot saved: test-name-[timestamp].png
⏳ Waiting for element visible: [selector]
🖱️ Filling: [selector] = "value"
```

---

## 6️⃣ SELF-HEALING LOCATOR STRATEGY (Design Only)

### **Multi-Level Fallback Pattern**

```
When primary locator [data-testid='...'] fails:

Level 1 (PRIMARY):     [data-testid='button']
         ↓ Not found
Level 2 (FALLBACK 1):  #button-id
         ↓ Not found
Level 3 (FALLBACK 2):  [name='button_name']
         ↓ Not found
Level 4 (FALLBACK 3):  .button-class.primary
         ↓ Not found
Level 5 (LAST RESORT): //button[contains(text(),'...')]
         ↓ All failed
         
RESULT: Test fails with clear error message
        Document which locators were tried
        Create ticket to fix primary locator
        Recommend: 50%+ fallback use = locator needs update
```

### **Recovery & Reporting**

```
If fallback used:
├─ Log WARNING: "Primary locator failed, using fallback"
├─ Continue test (NO failure)
├─ Document in report
└─ Track frequency

If all locators fail:
├─ Log ERROR: "All locators failed"
├─ Capture screenshot
├─ Mark for manual review
└─ Fail test with context
```

---

## 7️⃣ TEST DATA MANAGEMENT

### **Test Data Organization**

```
test-data/
├─ contact-form-valid.json       (Valid submissions)
├─ contact-form-invalid.json     (Invalid data for negative tests)
├─ initiatives-mock.json         (Mock API responses)
├─ news-mock.json               (Mock API responses)
└─ users.json                   (Test credentials if needed)

dataGenerator.ts provides:
├─ generateValidContactFormData()
├─ generateInvalidEmails()
├─ generateInvalidNames()
├─ generateRandomUser()
└─ generateLargePayload() (for edge cases)
```

---

## 8️⃣ CONFIGURATION MANAGEMENT

### **Environment Configurations**

```
ENVIRONMENTS:

LOCAL (Developer Machine)
├─ Base URL: http://localhost:3000
├─ Headless: false (see browser)
├─ Mock APIs: true
└─ Max Workers: 1

STAGING (QA Environment)
├─ Base URL: https://qa-joyalukkas-next.webc.in
├─ Headless: true (CI mode)
├─ Mock APIs: false
└─ Max Workers: 4

PRODUCTION (Live Site)
├─ Base URL: https://joyalukkas.org
├─ Headless: true
├─ Mock APIs: false
└─ Max Workers: 4
```

---

## 9️⃣ CI/CD INTEGRATION

### **Playwright Config**

```yaml
Parallel Execution:
├─ Workers: 4 (in CI environment)
├─ Retries: 2 (only in CI)
├─ Timeout: 30 seconds per test

Reporting:
├─ Format 1: HTML report (visual, interactive)
├─ Format 2: JSON (tools integration)
├─ Format 3: JUnit XML (CI system integration)
└─ Format 4: Screenshots on failure (debugging)

Video Recording:
├─ Local: disabled
├─ CI: only on failure
└─ Reason: Reduce artifact size
```

---

## 🔟 PAGE OBJECT TEMPLATE EXAMPLE

### **Contact Us Page Example**

```typescript
class ContactUsPage extends BasePage {
  
  // LOCATORS (Priority 1-3)
  private readonly FORM_NAME = "[data-testid='contact-form-name']"
  private readonly FORM_EMAIL = "[data-testid='contact-form-email']"
  private readonly FORM_MESSAGE = "[data-testid='contact-form-message']"
  private readonly FORM_SUBMIT = "[data-testid='contact-form-submit']"
  private readonly SUCCESS_MESSAGE = "[data-testid='form-success-msg']"
  
  // NAVIGATION
  async navigateToContactPage() { }
  
  // VERIFICATION
  async isContactFormDisplayed() { }
  async verifyAllFieldsVisible() { }
  async verifySubmitButtonEnabled() { }
  
  // INTERACTION
  async fillContactForm(name, email, message) { }
  async submitForm() { }
  async clearForm() { }
  
  // DATA RETRIEVAL
  async getSuccessMessage() { }
  async getErrorMessage() { }
  async getFormData() { }
  
  // RESILIENCE
  async verifyFormWithRetry() { }
}
```

---

## 1️⃣1️⃣ COMPONENT REUSABILITY

### **Header Component Example**

```typescript
class Header extends BasePage {
  
  // Navigation methods (reusable across all pages)
  async navigateHome() { }
  async navigateAbout() { }
  async navigateInitiatives() { }
  async navigateInsights() { }
  async navigateAwards() { }
  
  // Contact CTA (available on every page)
  async clickContactButton() { }
  
  // Logo interaction
  async clickLogo() { }
  
  // Mobile menu
  async openMobileMenu() { }
  async closeM obileMenu() { }
}

// Used in every page object:
async goToHomePage() {
  const header = new Header(this.page, ...);
  await header.navigateHome();
}
```

---

## 1️⃣2️⃣ ARCHITECTURE LAYER DIAGRAM

```
┌──────────────────────────────┐
│     TEST SPECIFICATIONS      │  ← What QAs write
│  (tests/ directory)          │
└──────────────────────────────┘
            ↑ Uses
            │
┌──────────────────────────────┐
│    PAGE OBJECTS (POM)        │  ← Encapsulates UI
│  (src/pages/ directory)      │    selectors & logic
└──────────────────────────────┘
            ↑ Uses & Inherits from
            │
┌──────────────────────────────┐
│   REUSABLE COMPONENTS        │  ← Shareable UI
│  (src/components/)           │    patterns
└──────────────────────────────┘
            ↑ Inherits from
            │
┌──────────────────────────────┐
│   BASE PAGE CLASS            │  ← Core utilities
│  (src/pages/BasePage.ts)     │    and helpers
└──────────────────────────────┘
            ↑ Uses
            │
┌──────────────────────────────┐
│   UTILITY FUNCTIONS          │  ← Shared tools
│  (src/utils/ directory)      │
└──────────────────────────────┘
            ↑ Uses
            │
┌──────────────────────────────┐
│ CONSTANTS & CONFIG           │  ← Global values
│ (src/constants/)             │
└──────────────────────────────┘
            ↑ Uses
            │
┌──────────────────────────────┐
│  PLAYWRIGHT FRAMEWORK        │  ← Browser engine
```

---

## ✅ PHASE 3 COMPLETION STATUS

- ✅ Enterprise folder structure designed
- ✅ Base page class architecture documented
- ✅ Locator selection strategy (Priority 1-5)
- ✅ Wait utilities & timeout values defined
- ✅ Retry mechanisms with exponential backoff
- ✅ Screenshot & logging system designed
- ✅ Self-healing locator strategy (design only)
- ✅ Component reusability patterns shown
- ✅ Configuration management system
- ✅ Test data management approach
- ✅ CI/CD integration points
- ✅ Page object templates provided
- ✅ Architecture layer diagrams

---

## 🛑 AWAITING YOUR APPROVAL

**Would you like me to proceed to PHASE 4 — TEST CASE GENERATION?**

This phase will convert the architecture into:
- 126 test cases formally specified
- Each test mapped to modules & priority
- Pre-conditions, steps, expected results
- Linked to POM classes that will be created in Phase 5

**Please confirm: Ready for PHASE 4? (Yes/No)**