/**
 * src/constants/endpoints.ts
 * API endpoint constants for the Joyalukkas Foundation website
 */

export const ENDPOINTS = {
  // Navigation
  HOME: '/',
  ABOUT_US: '/about-us',
  CONTACT_US: '/contact-us',
  
  // Core Pages
  INITIATIVES: '/initiatives',
  INSIGHTS: '/insights',
  NEWS: '/insights',
  AWARDS: '/awards',
  ANNUAL_REPORT: '/annual-report',
  GALLERY: '/gallery',
  
  // Programs
  PROGRAMS: '/programs',
  SCHOLARSHIP: '/programs/scholarship',
  RELIEF: '/programs/relief',
  EDUCATION: '/programs/education',
  HEALTHCARE: '/programs/healthcare',
  
  // Legal
  PRIVACY_POLICY: '/legal/privacy-policy',
  TERMS_OF_SERVICE: '/legal/terms-of-service',
  COOKIE_POLICY: '/legal/cookie-policy',
  DISCLAIMER: '/legal/disclaimer',
  
  // Forms / API
  SUBMIT_CONTACT_FORM: '/api/contact',
  SUBSCRIBE_NEWSLETTER: '/api/newsletter/subscribe',
  DOWNLOAD_REPORT: '/api/reports/download',
  SEARCH: '/api/search',
  
  // Admin / Special Pages
  SITEMAP: '/sitemap.xml',
  ROBOTS: '/robots.txt',
  
  // Not Found
  NOT_FOUND: '/404',
  ERROR: '/error'
};

export const API_ENDPOINTS = {
  // Contact & Newsletter
  CONTACT_SUBMIT: 'POST /api/contact',
  NEWSLETTER_SUBSCRIBE: 'POST /api/newsletter/subscribe',
  NEWSLETTER_UNSUBSCRIBE: 'POST /api/newsletter/unsubscribe',
  
  // Content
  GET_INITIATIVES: 'GET /api/initiatives',
  GET_INITIATIVES_BY_ID: 'GET /api/initiatives/:id',
  GET_NEWS: 'GET /api/news',
  GET_NEWS_BY_ID: 'GET /api/news/:id',
  GET_AWARDS: 'GET /api/awards',
  GET_GALLERY_IMAGES: 'GET /api/gallery',
  
  // Reports
  GET_ANNUAL_REPORTS: 'GET /api/reports/annual',
  DOWNLOAD_REPORT: 'GET /api/reports/download/:id',
  
  // Search
  SEARCH: 'GET /api/search',
  SEARCH_INITIATIVES: 'GET /api/search/initiatives',
  SEARCH_NEWS: 'GET /api/search/news',
  
  // User Data
  GET_USER_DETAILS: 'GET /api/user',
  UPDATE_USER_PREFERENCES: 'PUT /api/user/preferences'
};

export default { ENDPOINTS, API_ENDPOINTS };
