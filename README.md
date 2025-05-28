CHERIL Masterplan

1. Overview
CHERIL is a peer-to-peer rental marketplace that helps users rent or list everyday items — from clothes and footwear to books and utensils. The goal is to enable middle-class users to save money, earn extra income, and reduce waste through sustainable sharing.

2. MVP Scope (Minimum Viable Product)
Platform: Web application (mobile responsive)
Core Features:
User registration & login (OTP, Google, email-password)
List an item (name, photos, category, rent, deposit, availability, location)
Browse items by category
Search with filters (location, type, occasion, rent range, availability)
Product page (photos, price, deposit, condition, reviews, calendar)
Booking system (select dates, pay rent + deposit)
Online payment integration (UPI, cards, wallet)
Commission system for platform
Order tracking (status: booked, picked, returned)
Admin dashboard (view users, items, transactions)
Seller dashboard (view listings, bookings, earnings)



3. Technical Stack
Frontend:
React.js (Next.js for SEO support)
Tailwind CSS or Bootstrap
Backend:
Node.js with Express
MongoDB (item listings, users, orders)
Authentication:
Firebase Auth (Google, OTP, Email/Password)
Payments:
Razorpay or Stripe for rental & deposit transactions
Hosting:
Vercel (Frontend)
Render / Railway (Backend)
MongoDB Atlas (Database)

4. Pages & Components
User Side:
Home Page: Category grid, featured items, banners
Product Listing Page: Filters, search, pagination
Product Details Page
Checkout Page: Dates, charges, payment
My Orders Page: Current, Past Rentals
Profile: Saved items, payment info, settings
Seller Side:
Seller Dashboard: Listings, bookings, earnings
Add New Listing Page
Edit Listing Page
Admin Panel (MVP Light):
View All Users
View Items
View Bookings
Adjust commissions

5. Monetization Strategy
Platform commission: 10–15% on each successful rental
Premium listings: For vendors who want to boost visibility
Delivery service markup: Small margin on express delivery

6. Logistics & Operations
Partner with 3rd-party delivery/logistics in each city
Automated pickup/delivery scheduling
Add delivery charges dynamically based on location
Item condition checklist (before/after rental)
In-app support for returns, damage claims, and disputes




7. Go-To-Market Plan
Target Audience:
Urban youth (15–40 years), college students, working professionals
City Focus:
Tier-1: Pune, Mumbai, Delhi
Tier-2 (Beta Phase): Nagpur, Indore, Surat
Marketing Tactics:
Instagram reels with relatable rental scenarios
Referral program: Rs. 100 off per friend
Collaborate with fashion influencers, bridal stylists
Campus ambassador programs in colleges

8. Future Feature Roadmap
Mobile App (React Native or Flutter)
Ratings & Reviews per user and item
Aadhaar/KYC Verification system
Chat between renter & lender (in-app)
Try-at-home or store-visit option (optional)
Eco-score or reward points for sustainable usage
Section for wedding planners, event managers
Resale market for second-hand goods
Local language support

9. Team & Tools Recommendation
1 Product Manager – Oversee roadmap and business logic
1 UI/UX Designer – Figma designs, user flow
2 Full-Stack Developers – MVP build and testing
1 Growth Marketer – GTM strategy, influencer collabs
Tools:
Figma (Design)
Trello / Notion (Task mgmt)
Postman (API Testing)
Google Analytics (Insights)
Hotjar (User behavior analysis)

10. Vision
In 5 years, CHERIL will become India’s leading rental platform, promoting a circular economy and reducing consumer waste. The platform will empower local vendors, create extra income for common people, and expand across Southeast Asia.
Tagline: "Rent smart. Save big. Live light."
11. Design Guidelines & User Flows
As a professional web designer with 20+ years of experience, these guidelines ensure a cohesive, scalable, and delightful user experience.
11.1. Design Principles
Consistency: Reuse UI components, spacing, and typography to build familiarity.
Clarity: Clear hierarchy, legible text, intuitive icons, and feedback on interactions.
Efficiency: Minimize user effort with smart defaults, progressive disclosure, and clear CTAs.
Accessibility: WCAG AA compliance: sufficient contrast, keyboard navigation, semantic HTML.
Performance: Optimize images, lazy-load content, and minimize CSS/JS bundle sizes.
11.2. Color Theory
Primary Palette: #FF6F61 (Coral), #FFFFFF (White)
Secondary Palette: #F7E7E6 (Light Blush), #F0F4F8 (Neutral Gray)
Accent Colors: #2D817B (Teal), #FFB88C (Peach)
Usage: Primary for CTAs and highlights; secondary for backgrounds and surfaces; accents for interaction states and alerts.
Contrast Ratios: Maintain at least 4.5:1 for text against background.
11.3. Typography
Primary Font: Inter (variable font) for body and headings.
Fallbacks: system-ui, -apple-system, BlinkMacSystemFont.
Scale: Modular scale (1.25) for harmonious sizing:
H1: 2.5rem / 40px
H2: 2rem / 32px
H3: 1.75rem / 28px
Body: 1rem / 16px
Small text: 0.875rem / 14px
Line-height: 1.5 for body, 1.2 for headings.
Letter-spacing: 0.02em for body, 0.05em for uppercase labels.
11.4. Spacing & Layout
Base Unit: 8px.
Margins & Padding: Multiples of 8 (e.g., 8, 16, 24, 32px).
Container Widths:
Mobile: 100% width, 16px side padding.
Tablet: max-width 720px, 24px side padding.
Desktop: max-width 1200px, center-aligned, 32px padding.
Grid System: 12-column flex/grid with 16px gutter on desktop, 8px on mobile.
11.5. Iconography & Imagery
Icons: Outline style, 2px stroke, 24x24px default size.
Images: Use 16:9 ratio for banners; 1:1 ratio for product thumbnails; optimize to WebP.
Illustrations: Minimal line art or flat style to support brand tone.
11.6. Animations & Interactions
Micro-interactions: Subtle hover effects (scale 1.03), focus states with 2px outline.
Transitions: 200ms ease-in-out for hover and modal open/close.
Loading states: Skeleton screens for lists, spinners for form submissions.
11.7. User Flows (MVP)
Onboarding Flow:
Visit homepage → Click Sign Up → Choose OTP/Google → Welcome tutorial modal → Land on Home.
Browse & Search:
Home → Category click/search bar → Apply filters → View listing grid → Select item.
Listing an Item:
Dashboard → "List Item" → Fill form (details, photos, calendar) → Preview → Submit → Confirmation.
Rental Journey:
Product page → Select dates → View pricing breakdown → Click "Rent Now" → Payment modal → Success → Order tracking.
Post-Rental:
Order complete → Reminder for return → Post-return checklist → Release deposit → Prompt for rating.
These guidelines ensure your team designs and builds with precision, consistency, and user delight in mind. Feel free to reference these standards in every sprint, design review, and code implementation.

