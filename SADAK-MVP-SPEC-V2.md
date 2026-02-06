# SADAK Platform — MVP Demo Build Specification

## 1. What is SADAK?

SADAK is a **travel privilege & services super-app**. Think of it as "Priority Pass meets corporate benefits meets travel marketplace" — all in one platform.

A user opens SADAK and sees all their travel privileges from their employer, bank, or card provider in one place. They can use these privileges to access airport lounges, skip security lines, buy eSIM data for international trips, book airport transfers, and get travel insurance — all from one app.

**The demo will use sample/mock data throughout. No real integrations needed. Focus on beautiful UI and realistic user flows.**

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **User App** | Next.js (mobile-first responsive — demo as a phone-sized web app) |
| **Admin Panel** | Next.js (desktop-first) |
| **Provider Console** | Next.js (desktop-first) |
| **Backend** | Node.js |
| **Database & Auth** | Supabase (PostgreSQL + Auth) |
| **Styling** | Tailwind CSS |
| **i18n** | next-intl (Turkish + English for MVP) |

---

## 3. User App — Complete Screen & Feature Breakdown

### 3.1 Onboarding Flow (First Launch)

**Welcome Screens (3-4 swipeable slides):**
1. "Your Privileges, One Place" — illustration showing multiple company cards merging into one app
2. "Travel Smarter" — illustration showing eSIM, transfer, lounge icons
3. "Personalized For You" — illustration showing AI recommendations
4. CTA: "Get Started"

**Sign Up / Login Screen:**
- Clean, minimal design
- Input: Phone number or email
- CTA: "Continue"
- Demo mode: any input works, skip real OTP — show a fake OTP screen with pre-filled code, auto-verify after 1.5 seconds
- For the demo, provide 3-4 pre-built user profiles with different tiers and companies to showcase different experiences

**Profile Setup (first-time only):**
- First name, last name
- Optional: profile photo upload
- Optional: Turkish National ID (for TROY verification demo)
- Language preference selector
- "Complete Setup" CTA

**Company Discovery Screen (first-time only, key differentiator):**
- Title: "Let's find your privileges"
- System shows a list of partner companies with logos
- Auto-detected memberships are highlighted with checkmarks: "We found you at [Company X]!"
- User can tap other companies to request membership
- Each company card shows: logo, name, short tagline, tier badge if member
- CTA: "Continue to Dashboard"
- This screen demonstrates the multi-membership model which is the core value prop

---

### 3.2 Main Navigation (Bottom Tab Bar)

```
[ Home ]  [ Privileges ]  [ Marketplace ]  [ My Trips ]  [ Profile ]
```

**"My Trips" is a new addition** — not in the original doc but essential for a travel-focused app. This ties all services together around actual trips.

---

### 3.3 Home (Dashboard)

**Layout (top to bottom, scrollable):**

**A. Header Bar**
- User avatar (small, left) + greeting: "Good morning, Efe"
- Notification bell icon (right) with badge count
- Current active company context pill (tappable to switch): "[Company Logo] Gold Member ▾"

**B. Active Company Switcher** (when tapped)
- Bottom sheet showing all memberships
- Each: company logo, name, tier badge, status
- Quick switch — selecting changes the entire app context

**C. Upcoming Trip Card** (prominent, if trip exists)
- Auto-detected or manually added upcoming trip
- Card shows: destination city/country flag, dates, flight number
- Quick-action chips below: "Buy eSIM", "Book Transfer", "Get Insurance", "Airport Lounge"
- This is the primary conversion driver — contextual services tied to an actual trip
- If no upcoming trip: "Plan your next trip +" prompt

**D. Quick Actions Grid (2x2 or horizontal scroll)**
- eSIM (icon + label)
- Transfer (icon + label)
- Insurance (icon + label)
- Lounge Access (icon + label)
- Fast Track (icon + label)
- All Services → (see all)

**E. AI Recommendations Section**
- Title: "Recommended for you"
- Horizontal scrolling cards (min 3)
- Each card: gradient background, icon, title, subtitle, CTA
- Examples:
  - "Get eSIM for your Berlin trip" → links to eSIM flow pre-filled with trip data
  - "You have 2 free lounge visits this month" → links to lounge
  - "Travel insurance from €9.99" → links to insurance
- For demo: static but realistic recommendations based on user profile

**F. Recent Activity Section**
- Title: "Recent Activity"
- List of last 5 transactions
- Each item: icon (by type), title, date, status badge (completed/pending/failed), amount if applicable
- "See All" link → full transaction history

**G. Privilege Highlights**
- Title: "Your Top Privileges"
- 2-3 featured privilege cards from active company
- Card: privilege name, remaining quota visual (progress ring), validity, quick-use CTA
- "See All Privileges →"

---

### 3.4 Privileges Tab

**Layout:**

**A. Header**
- Title: "My Privileges"
- Active company pill (same switcher)
- Search icon

**B. Privilege Source Tabs (horizontal scrollable)**
- "All" (default)
- "[Company A] Privileges"
- "[Company B] Privileges"
- "TROY Privileges"
- "Discover" (companies user isn't a member of yet → browse & request)

**C. Category Filter Chips (horizontal scroll below tabs)**
- All, Lounge, Fast Track, eSIM, Transfer, Insurance, Dining, Shopping, Health, Entertainment
- Multi-select capable
- Active filters shown as filled chips

**D. Privilege Cards (vertical scrollable list)**

Each card:
- Left: category icon with color coding
- Title (bold): e.g., "Airport Lounge Access"
- Subtitle: provider name + tier requirement
- Quota indicator: "3 of 5 used this month" with mini progress bar
- Validity: "Valid until Dec 2026"
- Right: arrow indicator
- Visual distinction between free / discounted / paid privileges
- Dimmed styling for expired or quota-exhausted privileges with "Limit Reached" badge

**E. Privilege Detail Screen (on card tap)**
- Hero image/illustration for the privilege type
- Title + provider logo
- Full description (expandable)
- **Usage Rules Section:**
  - Quota: visual ring chart (e.g., "2 remaining of 5 monthly")
  - Validity dates
  - Eligible locations (for lounge: list of airports/terminals)
  - Eligible times / blackout dates
  - Guest policy (e.g., "+1 guest for Gold tier")
- **How to Use Section:** step-by-step visual guide
- **Terms & Conditions** (expandable accordion)
- **Primary CTA:** "Use Now" / "Book" / "Activate" (depending on type)
- **Secondary CTA:** "Add to Trip" (links privilege to an upcoming trip)

**F. "Discover" Tab Content**
- List of companies the user is NOT yet a member of
- Each card: company logo, name, description, sample privileges preview ("Access to 1,200+ lounges worldwide")
- CTA: "Request Membership" → creates pending request
- After requesting: card shows "Request Pending ⏳"

---

### 3.5 Marketplace Tab

**Layout:**

**A. Header with search bar**
- Prominent search: "Search services, providers..."
- Location-aware label: "Services in Istanbul" (from device or profile)

**B. Featured Campaigns Banner (auto-scrolling carousel)**
- Full-width cards with gradient overlays
- Title, subtitle, validity period, CTA
- Examples: "50% off Berlin eSIM packages", "Free lounge access this weekend"

**C. Service Categories (large tappable cards, 2-column grid)**
Each card:
- Large icon/illustration
- Category name
- Short description
- Badge if user has privileges for this category: "2 free uses"

Categories:
1. **eSIM** — "Stay connected abroad"
2. **Airport Transfer** — "Ride to/from airport"
3. **Travel Insurance** — "Travel worry-free"
4. **Airport Lounge** — "Relax before your flight"
5. **Fast Track** — "Skip the queues"
6. **Coming Soon** — greyed out card with "Parking, Museums, Beach Access..." teaser

**D. Popular Providers Section**
- Horizontal scroll of provider logos
- Tap → see all packages from that provider

**E. "Based on Your Trip" Section** (if upcoming trip exists)
- Contextual recommendations tied to destination
- "For your Berlin trip on Mar 22:"
  - "Germany eSIM from €4.99"
  - "BER Airport Lounge — you have 1 free visit"
  - "Airport Transfer from €29"

---

### 3.6 My Trips Tab (NEW — Not in original doc)

This is the glue that ties everything together. Users organize their travel around actual trips.

**Layout:**

**A. Upcoming Trips Section**
- Cards for each upcoming trip
- Card: destination flag + city, dates, flight number, status indicators for services booked

**B. Trip Detail Screen**
- **Header:** Destination city hero image, dates, flight info
- **Trip Timeline** (visual vertical timeline):
  - ✅ eSIM activated (or ➕ "Add eSIM")
  - ✅ Insurance purchased (or ➕ "Get Insurance")
  - ⏳ Transfer booked for arrival (or ➕ "Book Transfer")
  - 🔲 Lounge access available (or ➕ "Reserve Lounge")
  - 🔲 Fast Track available (or ➕ "Add Fast Track")
- Each item expands to show details or starts the booking flow pre-filled with trip data
- **Trip Completion Score:** "Your trip is 60% prepared" — gamified progress ring motivating users to complete all services
- **Documents Section:** boarding pass, insurance policy PDF, eSIM QR code — all in one place

**C. Add Trip**
- Manual: enter flight number + date → auto-fetch flight details (mocked)
- From PNR: paste booking reference (mocked)
- Manual entry: origin city, destination city, dates

**D. Past Trips Section**
- Collapsible list of completed trips
- Each shows services used, total savings from privileges
- "You saved €47 on your London trip!"

---

### 3.7 Profile Tab

**Layout (settings-style list):**

**A. Profile Header**
- Large avatar, name, email
- "Edit Profile" link

**B. My Account Section**
- Personal Information (edit screen)
- TROY Verification status (verified badge or "Verify now" CTA)
- Security (change phone/email)

**C. My Companies Section**
- List of memberships with status badges
- Each: company logo, name, tier, status (Active / Pending / Suspended)
- "Add Company +" button
- Tap → company detail: tier info, assigned privileges, membership since date

**D. Preferences Section**
- Language (Turkish 🇹🇷 / English 🇬🇧) — instant switch
- Notifications settings (push, email, SMS toggles)
- Currency preference
- Default travel preferences (home airport, preferred lounge, etc.)

**E. Documents Section**
- Insurance policies archive
- eSIM activation codes archive
- Past transfer confirmations
- All downloadable/shareable

**F. Legal & Support Section**
- Terms of Service
- Privacy Policy (KVKK/GDPR)
- Help Center / FAQ
- Contact Support
- App version

**G. Logout Button**

---

### 3.8 Notifications Center (bell icon from Home)

**Full-screen notification list:**
- Grouped by date (Today, Yesterday, Earlier)
- Types:
  - 🎉 New privilege unlocked: "You now have 3 free lounge visits!"
  - ✈️ Trip reminder: "Your Berlin trip is in 3 days — get eSIM now"
  - ✅ Transaction complete: "eSIM activated successfully"
  - 📋 Membership update: "Your request to [Company] was approved!"
  - 🔥 Campaign alert: "Limited time: 40% off transfer bookings"
- Each notification tappable → navigates to relevant screen
- Mark all as read / clear

---

### 3.9 eSIM Flow (from Marketplace or Trip)

**Step 1: Trip/Flight Selection**
- If launched from a trip: pre-filled, show confirmation
- If standalone: flight number + date input
- Flight info card appears after validation: "TK1933 — Istanbul → Berlin, Mar 22, 14:30"
- Destination country auto-detected

**Step 2: Package Selection**
- Country flag + name header: "🇩🇪 Germany eSIM Packages"
- Filter/sort bar: sort by price/data/duration
- Package cards (list):
  - Provider logo + name
  - Data amount: "5 GB"
  - Duration: "7 days"
  - Price: "€4.99" (or "FREE" with privilege badge if covered by privilege)
  - Speed badge: "4G/LTE"
  - "Best Value" / "Most Popular" badges on relevant packages
- If user has eSIM privilege: highlighted "Covered by [Company] privilege" banner on eligible packages

**Step 3: Review & Confirm**
- Summary card: package details, price (or "Free — covered by privilege"), flight link
- Privilege deduction notice: "This will use 1 of your 3 monthly eSIM credits"
- Terms checkbox
- CTA: "Activate eSIM"

**Step 4: Activation Result**
- Success animation (confetti/checkmark)
- QR code large and centered (for scanning by phone camera)
- "Copy Activation Link" button
- "How to install eSIM" expandable instructions (step by step with device-specific tabs: iOS / Android)
- "Add to Trip" button
- "Share" button (for sending QR to another device)
- "Done" → back to previous context

---

### 3.10 Transfer Flow

**Step 1: Route Input**
- Map view (top half of screen) with pin markers
- Origin field: "Pickup location" — autocomplete, current location button
- Destination field: "Drop-off location" — autocomplete
- Date/time picker: "Now" (default) or schedule for later
- Pre-filled if launched from trip: airport ↔ city

**Step 2: Provider Comparison**
- Loading state: "Finding best rides..." with skeleton cards
- Provider cards (vertical list, sortable):
  - Provider logo + name (Bitaksi, Uber, etc.)
  - Vehicle type + image: "Sedan", "Van", "Premium"
  - Price: "₺240" (or "FREE" / "₺120 after discount" with privilege)
  - ETA: "~35 min"
  - Rating: "4.8 ★"
- Sort options: price, time, rating
- If privilege applies: "Your Gold membership saves you ₺120" callout

**Step 3: Review & Confirm**
- Route summary with mini map
- Selected provider + vehicle details
- Pickup time, estimated arrival
- Price breakdown (base price, privilege discount, final price)
- CTA: "Confirm Booking"

**Step 4: Booking Confirmation**
- Success animation
- Reservation number (large, copyable)
- Driver assignment status: "Finding your driver..." or "Driver assigned: Mehmet ★4.9"
- Map with live-ish tracking (mock for demo)
- Contact driver button (mock)
- Cancel booking option
- "Add to Trip" button

---

### 3.11 Insurance Flow

**Step 1: Trip & Traveler Info**
- Pre-filled from profile + trip: name, age, destination, travel dates
- Editable fields if anything is wrong
- "Get Quotes" CTA

**Step 2: Quote Comparison**
- Cards for each provider/plan:
  - Provider logo + plan name: "Allianz Comfort"
  - Coverage amount: "€50,000"
  - Price: "€12.99" (or "FREE" / discounted with privilege)
  - Key coverages (icon list): ✈️ Flight cancellation, 🏥 Medical, 🧳 Lost baggage
  - "See Full Coverage" expandable
  - "Best Match" badge on recommended plan
- Compare toggle to see plans side by side

**Step 3: Review & Purchase**
- Selected plan details
- Full coverage breakdown (accordion sections)
- Beneficiary info (pre-filled from profile)
- Terms & conditions checkbox
- KVKK consent checkbox
- Price + payment method selector
- CTA: "Purchase Policy"

**Step 4: Policy Issued**
- Success animation
- Policy number (large, copyable)
- Validity dates
- "Download PDF" button (opens/downloads policy document)
- "View Policy Details" link
- "Add to Trip" button
- Summary card saved to Documents section

---

### 3.12 Lounge Access Flow

**Step 1: Airport & Terminal Selection**
- If from trip: auto-detected from flight
- If standalone: search/select airport → terminal
- Map of airport with lounge pins

**Step 2: Available Lounges**
- Cards for each lounge:
  - Photo (horizontal carousel)
  - Name: "Turkish Airlines Lounge — Miles&Smiles"
  - Terminal + gate proximity: "Terminal 1 — near Gate A12"
  - Amenities icons: 🍽 Food, 🛋 Seating, 🚿 Shower, 📶 Wi-Fi, 🍸 Bar
  - Operating hours: "05:00 — 23:00"
  - Capacity indicator: "Available" / "Busy" / "Full"
  - Price/privilege: "FREE with Gold" / "€35 / visit"
  - Rating: "4.6 ★ (234 reviews)"
  - Guest policy: "+1 guest included"

**Step 3: Lounge Detail (on tap)**
- Photo gallery
- Full description
- Amenities list with details
- Reviews section (mock)
- Location on terminal map
- CTA: "Get Access Pass"

**Step 4: Access Pass Generated**
- Large QR code for scanning at lounge entrance
- Valid until: "Today, 23:00"
- Guest pass included (if applicable)
- "Show this QR code at the lounge reception"
- Timer countdown for validity
- "Add to Apple/Google Wallet" button (mock)

---

### 3.13 Fast Track Flow

**Step 1: Airport & Service Selection**
- Airport + terminal (auto from trip or manual)
- Service type: "Security Fast Track" / "Passport Control Fast Track" / "Both"

**Step 2: Availability & Booking**
- Available time slots (or "Walk-in available")
- Price/privilege status
- CTA: "Reserve Fast Track"

**Step 3: Pass Generated**
- QR code / barcode for scanning
- Instructions: "Present this at the dedicated Fast Track lane"
- Terminal map highlighting the Fast Track entry point
- Valid for: specific date/time window

---

### 3.14 Global Search (accessible from multiple screens)

- Search bar with recent searches
- Results grouped by category: Privileges, Services, Companies, Lounges, Help Articles
- Auto-suggest as user types
- "No results" state with suggestions

---

## 4. Admin Panel — Screens

### 4.1 Auth
- Login page (email + password, simple for demo)
- After login → dashboard

### 4.2 Dashboard
- KPI cards: total users, active memberships, transactions today, revenue
- Charts: transactions over time, popular services, user growth
- Recent activity feed
- System health indicators (all green for demo)

### 4.3 User Management
- Searchable, filterable, paginated data table
- Columns: name, email, phone, company, tier, status, last active, actions
- User detail page: profile info, memberships, privileges, transaction history
- Actions: edit tier, suspend/activate, view details

### 4.4 Membership Requests
- Table: user name, company, requested date, status
- Actions: approve (assign tier) / reject (with reason)
- Bulk actions

### 4.5 Privilege Management
- CRUD table for privileges
- Create form: title, description, category, company, tier requirements, quota/limits, validity, usage model, provider
- Assign privileges to tiers/companies

### 4.6 Campaign Management
- CRUD table for campaigns
- Create form: title, description, type, linked privileges, priority, date range, target audience
- Preview how campaign appears in marketplace

### 4.7 Company Management
- CRUD for companies
- Tier structure management per company
- Company-level settings

### 4.8 Provider Management
- CRUD for providers
- Integration status indicators
- Service package overview per provider

### 4.9 Transaction Log
- Searchable data table
- Columns: ID, user, type, provider, status, amount, date
- Filters: type, status, date range, provider
- Detail view with full flow data

### 4.10 Audit Log
- All admin actions logged
- Columns: admin user, action, entity, timestamp, IP
- Read-only

### 4.11 System Settings
- Default language
- Supported languages toggle
- Maintenance mode toggle
- Notification templates

---

## 5. Provider Console — Screens

### 5.1 Auth
- Login page (email + password)

### 5.2 Dashboard
- Transaction summary (pending, approved, completed, rejected)
- Revenue chart
- Service health status

### 5.3 Package Management
- CRUD for service packages (eSIM plans, transfer options, insurance products, etc.)
- Pricing, availability, coverage details

### 5.4 Transaction Management
- Incoming requests table
- Approve/reject with notes
- Status tracking

### 5.5 Reports
- Usage reports, revenue breakdown, performance metrics
- Date range filters, export to CSV

---

## 6. Database Schema (Supabase/PostgreSQL)

### Core Tables

```sql
-- Users
users: id, email, phone, first_name, last_name, avatar_url, national_id, preferred_language, preferred_currency, home_airport, created_at, updated_at

-- Companies
companies: id, name, slug, logo_url, description, website, status (active/inactive), settings (jsonb), created_at

-- Tiers (per company)
tiers: id, company_id (FK), name, level (integer for ordering), description, color, icon, created_at

-- User ↔ Company Memberships
user_memberships: id, user_id (FK), company_id (FK), tier_id (FK), status (pending/active/rejected/suspended), request_source (auto_detected/troy/user_request), requested_at, approved_at, approved_by

-- Privileges
privileges: id, company_id (FK), title, description, category (esim/transfer/insurance/lounge/fast_track/dining/shopping/other), usage_model (free/discounted/paid), discount_percentage, quota_limit, quota_period (daily/monthly/yearly/once), eligible_tier_ids (integer[]), provider_id (FK), validity_start, validity_end, terms, status, sort_order, created_at

-- User Privilege Usage Tracking
user_privilege_usage: id, user_id (FK), privilege_id (FK), membership_id (FK), used_at, transaction_id (FK), period_key (e.g. "2026-02" for monthly tracking)

-- Campaigns
campaigns: id, title, description, image_url, type (discount/gift/extra_quota/promotion), linked_privilege_id (FK), priority, start_date, end_date, target_tier_ids (integer[]), status, created_at

-- Providers
providers: id, name, slug, type (esim/transfer/insurance/lounge/fast_track), logo_url, description, api_base_url, status, created_at

-- Marketplace Categories
marketplace_categories: id, name, slug, icon, description, sort_order, status

-- Trips
trips: id, user_id (FK), origin_city, origin_country, origin_airport_code, destination_city, destination_country, destination_airport_code, flight_number, departure_date, return_date, status (upcoming/active/completed/cancelled), created_at

-- Transactions (unified for all service types)
transactions: id, user_id (FK), trip_id (FK, nullable), type (esim/transfer/insurance/lounge/fast_track), status (pending/confirmed/completed/failed/cancelled), provider_id (FK), privilege_id (FK, nullable — if privilege was used), amount, currency, discount_amount, flow_data (jsonb — type-specific details), created_at, updated_at

-- eSIM Activations
esim_activations: id, transaction_id (FK), package_name, data_amount, duration_days, destination_country, flight_number, activation_type (qr/link), qr_code_data, activation_link, provider_package_id, status

-- Transfer Reservations
transfer_reservations: id, transaction_id (FK), provider_name, vehicle_type, origin_address, origin_lat, origin_lng, destination_address, dest_lat, dest_lng, pickup_time, estimated_duration_min, price, currency, reservation_ref, driver_name, driver_rating, driver_phone, status

-- Insurance Policies
insurance_policies: id, transaction_id (FK), provider_name, plan_name, coverage_amount, coverage_currency, premium_price, premium_currency, policy_number, policy_pdf_url, beneficiary_name, travel_start, travel_end, status

-- Lounge/Fast Track Access Passes
service_passes: id, transaction_id (FK), service_type (lounge/fast_track), venue_name, location (airport/terminal), access_code, access_code_type (qr/barcode), valid_from, valid_until, guest_count, used_at, status

-- Notifications
notifications: id, user_id (FK), type (privilege_unlocked/trip_reminder/transaction_complete/membership_update/campaign), title, body, data (jsonb — deep link info), read, created_at

-- TROY Verifications
troy_verifications: id, user_id (FK), national_id_hash, status (verified/not_verified/error), verified_at

-- Admin Users
admin_users: id, email, password_hash, name, role (super_admin/company_admin/operator/read_only), company_id (FK, nullable), status, created_at

-- Provider Users
provider_users: id, email, password_hash, name, provider_id (FK), role, status, created_at

-- Audit Logs
audit_logs: id, actor_id, actor_type (admin/provider/system), action, entity_type, entity_id, details (jsonb), ip_address, created_at

-- Translations
translations: id, key, locale (tr/en), value, namespace (common/privileges/marketplace/notifications/errors)
```

---

## 7. Sample Data for Demo

### Companies (4)
1. **Denizbank** — Banking, 3 tiers: Classic, Gold, Platinum
2. **Turkish Airlines** — Airline, 3 tiers: Classic, Elite, Elite Plus
3. **Garanti BBVA** — Banking, 3 tiers: Flexi, Bonus Gold, Bonus Platinum
4. **TROY** — Payment network (verification source, not a membership company)

### Sample Users (4 demo accounts)
1. **Efe Demir** — Denizbank Gold + TK Elite + TROY verified. Has upcoming Berlin trip. Power user.
2. **Ayşe Yılmaz** — Garanti Bonus Gold only. No upcoming trips. Moderate user.
3. **Mehmet Kaya** — Denizbank Platinum + Garanti Bonus Platinum + TROY verified. Has Istanbul→London and Istanbul→Dubai trips. Premium user.
4. **Zeynep Aksoy** — New user, no memberships yet. Demonstrates discovery/request flow.

### Sample Privileges (per company, 15-20 total)
- Denizbank Gold: 3 free lounge visits/month, 1 free eSIM/month, 10% transfer discount
- Denizbank Platinum: 5 free lounge visits/month + guest, 2 free eSIM/month, 20% transfer discount, free fast track, 1 free insurance/quarter
- TK Elite: 2 free lounge visits/month, priority fast track
- TK Elite Plus: unlimited lounge + guest, free fast track, free eSIM for international flights
- Garanti Bonus Gold: 2 lounge visits/month, 15% insurance discount
- Garanti Bonus Platinum: 4 lounge visits/month + guest, 1 free eSIM/month, free insurance for EU trips

### Sample Campaigns (5)
1. "Welcome Bonus" — First eSIM free for new users
2. "Summer Travel Deal" — 40% off transfer bookings in July
3. "Berlin Special" — Free lounge at BER airport
4. "Insurance Bundle" — Buy eSIM + Insurance together, save 25%
5. "Refer & Earn" — Extra lounge visit for referring a friend

### Sample Providers (8)
- eSIM: Airalo, Holafly
- Transfer: Bitaksi, Uber
- Insurance: Allianz, Axa
- Lounge: Priority Pass, LoungeKey
- Fast Track: Airport Dimensions

### Sample Trips (with linked transactions)
- Efe → Berlin, Mar 22-28 (eSIM activated, insurance purchased, transfer booked, lounge reserved)
- Mehmet → London, Apr 5-10 (partially prepared — insurance only)
- Mehmet → Dubai, May 15-22 (no services yet — shows "Plan your trip" state)

---

## 8. MVP Build Phases

### Phase 1 — Foundation & User App Core
1. Monorepo setup (Next.js apps + Node.js API + Supabase)
2. Database schema + seed with all sample data
3. Supabase Auth setup (simplified for demo — magic link or OTP mock)
4. User App: Onboarding flow (welcome slides → login → profile setup → company discovery)
5. User App: Bottom tab navigation + Home/Dashboard screen
6. User App: Privileges tab (list, filters, detail, source tabs)
7. User App: Profile tab (full settings screen)
8. i18n setup (TR + EN)
9. API: auth, user profile, privileges, dashboard endpoints

### Phase 2 — Marketplace & Service Flows
1. User App: Marketplace tab (categories, campaigns, search)
2. User App: My Trips tab (trip list, trip detail with timeline)
3. User App: eSIM complete flow (4 steps)
4. User App: Transfer complete flow (4 steps)
5. User App: Insurance complete flow (4 steps)
6. User App: Lounge access flow
7. User App: Fast Track flow
8. User App: Notifications center
9. API: marketplace, trips, all service flow endpoints

### Phase 3 — Admin & Provider Panels
1. Admin Panel: auth + dashboard
2. Admin Panel: user management + membership approvals
3. Admin Panel: privilege + campaign CRUD
4. Admin Panel: company + provider management
5. Admin Panel: transaction log + audit log
6. Provider Console: auth + dashboard
7. Provider Console: package + transaction management
8. Provider Console: reports

---

## 9. Key Business Rules

1. **Active company context** determines which privileges and dashboard content appear
2. **Privilege eligibility** = user must have active membership + correct tier + privilege is active + within validity dates
3. **Quota check** before every privilege use — reject if exhausted, warn at 80%
4. **Quota reset** per period: daily quotas reset at midnight, monthly at month start
5. **Membership request** stays pending until company admin approves — no privilege access until active
6. **TROY verification** unlocks additional TROY-source privileges for all companies that offer them
7. **Trip linking** — any service flow launched from a trip auto-links the transaction to that trip
8. **Price display** — if privilege covers cost: show "FREE" with strikethrough original price + "Covered by [Company] [Tier]" badge
9. **Fallback for no-membership users** — show SADAK default campaigns and "Discover" companies
10. **Multi-membership** — user can have active memberships in multiple companies simultaneously with different tiers

---

## 10. Project Structure

```
sadak/
├── apps/
│   ├── user-app/              # Next.js — mobile-first responsive
│   │   ├── app/               # App router
│   │   │   ├── [locale]/      # i18n routing
│   │   │   │   ├── (auth)/    # onboarding, login
│   │   │   │   ├── (main)/    # tab-based layout
│   │   │   │   │   ├── home/
│   │   │   │   │   ├── privileges/
│   │   │   │   │   ├── marketplace/
│   │   │   │   │   ├── trips/
│   │   │   │   │   └── profile/
│   │   │   │   └── (flows)/   # service flows (esim, transfer, insurance, lounge, fast-track)
│   │   ├── components/
│   │   └── lib/
│   ├── admin-panel/           # Next.js — desktop-first
│   └── provider-console/      # Next.js — desktop-first
├── packages/
│   ├── api/                   # Node.js backend
│   ├── database/              # Supabase migrations + seed data
│   ├── shared/                # Shared types, constants, utils
│   └── i18n/                  # Translation JSON files
├── package.json
└── turbo.json
```
