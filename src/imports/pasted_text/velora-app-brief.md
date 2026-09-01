Build this as a polished, production-quality mobile application using Expo React Native.

IMPORTANT:
The attached Figma/Stitch frames are the PRIMARY VISUAL REFERENCE and SOURCE OF TRUTH for the visual language of this application.

Do NOT blindly reproduce every interaction or content decision from the reference frames. I will specify functional changes below. Where my instructions conflict with the attached frames, MY INSTRUCTIONS TAKE PRIORITY.

The final application should feel like one coherent, professionally designed product — not a collection of separately generated screens.

==================================================
1. PRODUCT OVERVIEW
==================================================

The app is for "Velora", an interior works company.

Velora provides:

1. Complete interior solutions
   - Design-to-execution interior projects
   - Residential and commercial spaces

2. Individual interior/trade services
   - Customers can request only the service they need
   - Customers must NOT be forced to purchase a complete interior package

Core positioning:

"One call for any interior need."

The product should communicate:

- Trust
- Reliability
- Quality craftsmanship
- Convenience
- Professional execution
- Flexible service selection
- A simple, no-hassle experience

The primary users are:
- Homeowners
- Flat owners
- People renovating/upgrading their homes
- Small offices
- Shops/commercial spaces
- Customers requiring a single repair/service
- Customers requiring complete interior transformation

==================================================
2. TECHNICAL REQUIREMENTS
==================================================

Build an Expo React Native application.

Use:
- React Native primitives
- StyleSheet
- Expo Router
- Modular reusable components
- Reusable design tokens
- Reusable cards, buttons, headers, inputs, chips, modals, sheets, etc.

DO NOT use browser HTML elements such as:
- div
- button
- img
- input
- CSS intended for browsers

Use React Native equivalents:
- View
- Text
- Pressable
- Image
- TextInput
- ScrollView
- FlatList
- etc.

Use Expo Router for navigation.

Create a logical route structure for the complete app.

Do not leave dead-end screens.

Every important CTA should lead somewhere meaningful.

Do not implement backend controllers/API routes yet.
Use realistic local/mock data and state so the complete UX can be demonstrated.

The code should be structured so API integration can be added later without redesigning the UI architecture.

==================================================
3. DESIGN SYSTEM — EXTREMELY IMPORTANT
==================================================

First, analyze the attached reference frames deeply.

Extract and recreate their visual design language:

- Color palette
- Primary color
- Secondary colors
- Background colors
- Surface colors
- Text colors
- Muted text
- Borders
- Dividers
- Card styling
- Corner radii
- Shadows/elevation
- Typography hierarchy
- Font weights
- Font sizes
- Line heights
- Spacing scale
- Icon treatment
- Button styles
- Input styles
- Chips/tags
- Navigation styling
- Image treatment
- Section spacing
- Interaction states

Create a coherent reusable design system from these observations.

DO NOT invent a completely different visual identity.

The attached frames should clearly feel like the same original design after implementation.

However, improve inconsistencies where necessary so the entire application feels professionally designed.

Create reusable design tokens for:

- colors
- typography
- spacing
- radii
- shadows
- borders
- component heights
- icon sizes

All screens must use the same tokens.

Do not manually create unrelated styling values on every screen.

==================================================
4. VISUAL CONSISTENCY
==================================================

The entire application must have ONE visual language.

Maintain consistency across:

- Home
- Explore
- Services
- Service detail
- Service cart
- Checkout/request flow
- Quotation flow
- Projects
- Project details
- Maintenance
- Warranty
- How We Work
- Cost Estimator
- Profile
- Hamburger menu
- My Quotations
- Work Map
- Locations We Serve
- Support
- Offers
- Inspiration
- FAQ
- Empty states
- Loading states
- Error states
- Confirmation states

Buttons must look like they belong to the same design system.

Cards must look like they belong to the same design system.

Typography must remain consistent.

Spacing must remain consistent.

Do not allow Figma Make to generate screen-by-screen visual drift.

==================================================
5. IMAGERY + CONTENT
==================================================

Use high-quality interior/design/work imagery where imagery is required.

Avoid generic Western/foreign-looking stock imagery and foreign names.

Use contextually appropriate imagery and realistic local customer/professional names.

Do not use obviously fake names such as:
- John
- Sarah
- Michael
- Emily

Use appropriate Indian/local names such as:
- Rahul
- Ananya
- Arjun
- Priya
- etc.

Images should feel premium, realistic, architectural/interior-design focused, and consistent with the reference design.

Do not use random unrelated stock imagery.

Use the attached reference imagery wherever appropriate if the environment permits it.

==================================================
6. GLOBAL APP STRUCTURE
==================================================

Primary bottom navigation:

1. Home
2. Explore
3. Services
4. Projects

Profile should also be easily accessible.

A profile button may appear in the top area of screens where appropriate.

A hamburger menu should be available from Home and can be consistently exposed in the primary application header where appropriate.

==================================================
7. HOME SCREEN
==================================================

Home is the most important screen.

It should follow the attached Home frame very closely while applying the functional changes below.

------------------------------------------
HEADER
------------------------------------------

Top area:

- Hamburger menu on the left
- Greeting such as:
  "Hi Rahul"
- Profile/avatar/action on the right where appropriate

Below the greeting, show an existing-user active-work area ONLY when the user actually has active work.

Example:

"Continue your work"
or
"See your project status"

This should feel like a useful continuation card rather than an advertisement.

If there is no active work, do not show an empty active-work block.

------------------------------------------
PRIMARY QUESTION
------------------------------------------

Show prominently:

"What are you looking for?"

Below it, present TWO large horizontal choices.

Choice 1:

"Transform your entire home"

This represents the complete interior solution.

Use an attractive interior image and a clear CTA.

Choice 2:

"Need something specific?"

or equivalent wording communicating:

"Individual service"

This represents customers who only need one or several specific services.

These two choices are a critical part of the product positioning.

Make the difference between them immediately understandable.

------------------------------------------
SERVICES WE OFFER
------------------------------------------

On Home, include a section such as:

"Services We Offer"

The service list should be horizontally scrollable.

Services currently offered:

- Complete Interior
- Electrical
- Plumbing
- Carpentry
- Painting
- Tiling
- False Ceiling
- Plaster Work

Use attractive service cards.

The carousel should continuously move/auto-scroll.

Interaction requirement:

- When the customer presses/holds the carousel, pause the auto-scroll.
- When they release, resume auto-scroll.
- Tapping a service opens that service's detail screen.

The carousel must feel smooth and premium, not distracting.

------------------------------------------
INSPIRATION
------------------------------------------

After Services We Offer, show:

"Inspiration"

IMPORTANT:
The original reference frame presents inspiration vertically.

CHANGE THIS.

Make the inspiration section HORIZONTAL.

Use horizontally scrollable inspiration/design cards or thumbnails.

Show different interior/design ideas relevant to the services Velora provides.

Tapping an inspiration item should navigate to the Explore/Inspiration experience.

------------------------------------------
FROM IDEA TO REALITY
------------------------------------------

Add the "From Idea to Reality" section.

This is a step-by-step visual explanation of how Velora works.

Use the existing reference design/content as the basis.

The conceptual steps are:

Step 1:
"Tell us what you need"

Step 2:
"Get matched with a professional and review proposal"

Step 3:
"Contribute easily"

Use the exact wording/design from the attached frame where available, while correcting typography/layout inconsistencies.

This section is HORIZONTAL.

It should communicate progression visually.

IMPORTANT:
This section is NOT a navigation menu.

It is NOT clickable.

Users should not be taken to another screen when tapping these steps.

It is purely informational.

------------------------------------------
OFFERS
------------------------------------------

Include an Offers area/action on Home.

CRITICAL BEHAVIOUR:

If an active offer exists:
- Show the offer.

If there is no active offer:
- DO NOT show an "Offers" placeholder.
- DO NOT show an empty card.
- DO NOT show the word "Offer".

The section should simply disappear when there are no offers.

------------------------------------------
FAQ
------------------------------------------

After the previous content, show:

"Frequently Asked Questions"

Use expandable FAQ rows/accordions.

Questions should have polished expanded/collapsed states.

------------------------------------------
SUPPORT
------------------------------------------

Add a support/contact area toward the bottom of Home.

Make it easy for users to get help.

------------------------------------------
WHATSAPP FLOATING ACTION
------------------------------------------

Add a floating WhatsApp action on the Home screen.

Position it toward the lower-right area, slightly below the central content area / above bottom navigation.

It should use the WhatsApp visual/icon treatment appropriately.

Tapping it should conceptually open WhatsApp/contact flow.

Make it visually integrated with the design system.

Do not make it look like an unrelated third-party widget.

==================================================
8. EXPLORE SCREEN
==================================================

Explore is the second primary tab.

The reference Explore design should largely remain as-is.

Do NOT overcomplicate this page.

Its purpose is primarily:

- Inspiration
- Design discovery
- Interior ideas
- Different design styles
- Service-related inspiration

Keep the overall visual structure close to the attached Explore frame.

IMPORTANT CHANGE:

REMOVE:

"Discover Professionals"

or any equivalent professional marketplace/discovery functionality.

Velora is NOT a professional marketplace.

Customers should NOT browse a list of professionals and choose one.

There should be NO:
- Top Rated Professionals
- Discover Professionals
- Professional marketplace
- Browse all professionals
- Public professional directory

Only the professional assigned to the customer's project/service may be visible later inside the relevant project/work context.

==================================================
9. SERVICES SCREEN
==================================================

Services is a primary bottom-navigation tab.

The Services screen should clearly communicate:

"What do you need?"

Provide a complete list of Velora's current services.

Services:

- Complete Interior
- Electrical
- Plumbing
- Carpentry
- Painting
- Tiling
- False Ceiling
- Plaster Work

Use the design language from the attached reference.

Include a prominent:

"Service Cart"

button/action near the top.

Users can select individual services.

Users can choose multiple services based on their needs.

==================================================
10. SERVICE DETAIL SCREEN
==================================================

Every service must have its own proper detail screen.

Do NOT make service cards dead ends.

For example:

Services
→ Painting
→ Painting Detail

The service detail screen should contain:

- Hero image
- Service name
- Description
- What is included
- Relevant requirements/options
- Quantity/size/details where applicable
- Relevant input controls
- Notes/details from customer
- Appropriate CTA

At the bottom provide two important actions:

1. "Add to Cart"
2. "Proceed to Checkout"

------------------------------------------
SINGLE-SERVICE FLOW
------------------------------------------

If the customer only needs this service:

Service Detail
→ Proceed to Checkout
→ Request/booking flow

------------------------------------------
MULTI-SERVICE FLOW
------------------------------------------

If the customer chooses:

"Add to Cart"

then:

- Add the service
- Keep the customer in a multi-service journey
- Allow them to continue browsing other services
- Let them add additional services
- Maintain previously selected requirements

Example:

Painting
→ Configure painting requirements
→ Add to Cart
→ Browse More Services
→ Electrical
→ Configure electrical requirements
→ Add to Cart
→ View Cart

The cart must support multiple unique services.

==================================================
11. SERVICE CART
==================================================

Create a dedicated Service Cart screen.

The cart is NOT a traditional product-shopping cart.

It represents a customer's collection of required interior services.

Example:

Painting
Electrical
Plumbing

Each service should show its relevant configured requirements.

Allow:

- Review service
- Edit service requirements
- Remove service
- Add another service
- Continue
- Proceed to quotation/checkout

The UI should clearly communicate that the customer is requesting multiple services from Velora.

Do not force a full interior package.

==================================================
12. CHECKOUT / REQUEST FLOW
==================================================

Create the complete logical flow for proceeding from:

- Single service
or
- Multiple services

The customer should be able to review:

- Selected services
- Requirements
- Location
- Property/project information
- Size/details
- Notes
- Preferred communication/contact details

Then continue into the quotation/request process.

This can use mock/local state.

Do NOT implement backend APIs yet.

==================================================
13. GET A QUOTATION
==================================================

Create a dedicated "Get a Quotation" experience.

The quotation journey should account for:

- WhatsApp/contact
- Location sharing
- Site visit
- Property/project size
- Requirements
- Final quotation

Make this a clear guided process rather than dumping every field onto one screen.

Possible conceptual flow:

Requirements
→ Location
→ Site Visit
→ Size / Property Details
→ Review
→ Request Quotation
→ Quotation Received

The exact visual styling should follow the reference frames.

==================================================
14. PROFESSIONAL VISIBILITY
==================================================

VERY IMPORTANT BUSINESS RULE:

Customers must ONLY see professionals who are actually assigned to their work.

Remove all marketplace-style professional discovery.

Do NOT show:
- Top Rated Professionals
- Recommended Professionals
- Discover Professionals
- All Professionals
- Professional ranking
- Public professional profiles

When a professional is assigned to a customer's project, show that assigned professional inside the relevant project/work context.

Example:

"My Project"
→ Assigned Professional
→ Professional details/contact if appropriate

==================================================
15. PROJECTS SCREEN
==================================================

Projects is a primary bottom-navigation tab.

The existing project reference frame is generally good.

Retain its core design language but implement these functional requirements.

------------------------------------------
ONGOING PROJECT
------------------------------------------

Show current ongoing project(s).

Include relevant progress/status.

Users should be able to open the project.

------------------------------------------
MAINTENANCE
------------------------------------------

Projects must also support maintenance work.

If a previous project was completed, the customer should be able to access relevant maintenance functionality.

Example:

Completed Project
→ Maintenance

------------------------------------------
WARRANTY
------------------------------------------

If applicable, customers should be able to check:

- Warranty coverage
- Warranty-related information
- Relevant work covered under warranty

Make warranty information accessible from the relevant project/work history.

------------------------------------------
PROJECT HISTORY
------------------------------------------

Show previously completed projects.

The user should be able to open historical projects and see relevant details.

------------------------------------------
BOOK NEW PROJECT
------------------------------------------

Provide a clear CTA:

"Book a New Project"

This should start the appropriate project/request journey.

==================================================
16. PROJECT DETAIL
==================================================

Create a proper project detail screen.

Include logical sections such as:

- Project overview
- Current status
- Progress
- Work completed
- Current work
- Upcoming work
- Assigned professional
- Documents/quotation where relevant
- Maintenance
- Warranty
- Project history/context

Use mock data for demonstration.

==================================================
17. HOW WE WORK / WORK ROADMAP
==================================================

Inside Projects, provide:

"How We Work"

This should be represented as a clear visual roadmap.

The roadmap should communicate project progression.

Example conceptual stages:

Request
→ Assessment
→ Site Visit
→ Proposal/Quotation
→ Approval
→ Planning
→ Execution
→ Completion

Use the reference design language.

The roadmap should have clear states such as:

- Completed
- Current
- Upcoming

Make it visually easy to understand.

==================================================
18. COST ESTIMATOR
==================================================

Projects should expose a:

"Cost Estimator"

Create a polished estimator interface.

It can use mock calculations for now.

Allow users to enter/select relevant project information and see an estimated cost/result.

This is an estimate only and should visually distinguish it from an official quotation.

Also expose the Cost Calculator through the hamburger/profile menu.

==================================================
19. PROFILE
==================================================

The attached Profile frame is already good.

Do not unnecessarily redesign it.

Preserve its overall structure and visual language.

Only adjust what is necessary to make it consistent with the final app design system and updated functionality.

Profile should be accessible:

- Through a profile button
- Potentially through the bottom/header area where appropriate

==================================================
20. HAMBURGER MENU
==================================================

The Home hamburger menu should contain:

1. Work Map
2. My Quotations
3. Cost Calculator
4. Locations We Serve
5. Support
6. Privacy & Terms and Conditions
7. Logout
8. Delete Account

Keep the menu visually consistent with the reference frames.

------------------------------------------
WORK MAP
------------------------------------------

"Work Map" represents a visual/map-like view of work performed by Velora.

For example, it can represent locations/work areas associated with:

- Interior work
- Plumbing
- Electrical
- Other services

Create a polished map/work visualization screen using mock data.

------------------------------------------
MY QUOTATIONS
------------------------------------------

Create a proper quotations list.

Users can see:

- Requested quotations
- Pending quotations
- Received quotations
- Accepted/previous quotations

Each quotation should open into a quotation detail screen.

------------------------------------------
COST CALCULATOR
------------------------------------------

Link to the Cost Estimator.

------------------------------------------
LOCATIONS WE SERVE
------------------------------------------

Create a proper location/service availability screen.

Users should be able to understand where Velora provides services.

Do not leave this as a static dead-end placeholder.

------------------------------------------
SUPPORT
------------------------------------------

Create a support screen with:

- Contact details
- WhatsApp/contact action
- Relevant support options

------------------------------------------
PRIVACY + TERMS
------------------------------------------

Create proper screens for:

- Privacy Policy
- Terms & Conditions

Use realistic placeholder/legal content structure rather than leaving an empty screen.

------------------------------------------
LOGOUT
------------------------------------------

Provide a confirmation interaction before logging out.

------------------------------------------
DELETE ACCOUNT
------------------------------------------

Provide a proper account deletion confirmation flow.

This should clearly communicate that account deletion is permanent.

Do not make deletion a single accidental tap.

==================================================
21. EMPTY / LOADING / ERROR STATES
==================================================

Every data-dependent screen should have intentional states.

Examples:

No ongoing project:
- Friendly empty state
- CTA to start/book a project

No quotations:
- Friendly empty state
- CTA to request quotation

No offers:
- Do not show the offer section on Home

Empty cart:
- Explain that services can be added
- CTA to explore services

Loading:
- Use appropriate skeleton/loading treatment

Error:
- Clear retry action

These states must use the same design system.

==================================================
22. INTERACTION DETAILS
==================================================

Implement realistic interactions wherever possible.

Examples:

- Service carousel auto-scroll
- Press-and-hold pauses service carousel
- Release resumes carousel
- Horizontal inspiration scrolling
- FAQ expand/collapse
- Add service to cart
- Remove service
- Edit service requirements
- Multi-service cart
- Navigation between all logical screens
- Project status progression
- Quotation status
- Warranty information
- Maintenance flow
- Profile/menu navigation
- Logout confirmation
- Delete-account confirmation
- Offer conditional visibility
- WhatsApp CTA

Avoid fake buttons that do nothing.

==================================================
23. NAVIGATION ARCHITECTURE
==================================================

Use Expo Router.

Create a logical navigation architecture similar to:

Home
Explore
Services
Projects
Profile

And nested routes for:

Services
→ Service Detail
→ Configure Service
→ Service Cart
→ Checkout/Request

Explore
→ Inspiration Detail

Projects
→ Project Detail
→ Maintenance
→ Warranty
→ Work Roadmap
→ Cost Estimator
→ Project History

Menu
→ Work Map
→ My Quotations
→ Quotation Detail
→ Cost Calculator
→ Locations We Serve
→ Support
→ Privacy
→ Terms
→ Logout
→ Delete Account

Do not necessarily expose all of these as tabs.

Use nested navigation appropriately.

==================================================
24. COMPONENT ARCHITECTURE
==================================================

Build reusable components.

Examples:

- AppHeader
- GreetingHeader
- ProfileButton
- SectionHeader
- PrimaryButton
- SecondaryButton
- ServiceCard
- ServiceCarousel
- InspirationCard
- InspirationCarousel
- ProjectCard
- ProjectStatusCard
- QuotationCard
- ProfessionalCard
- AssignedProfessionalCard
- FAQItem
- Roadmap
- RoadmapStep
- OfferCard
- EmptyState
- LoadingState
- InputField
- Chip
- Modal
- BottomSheet
- CartItem
- FloatingWhatsAppButton

Do not duplicate components unnecessarily between screens.

==================================================
25. ACCESSIBILITY + UX
==================================================

Use:

- Comfortable touch targets
- Clear hierarchy
- Strong readable typography
- Good contrast
- Sensible spacing
- Clear pressed/active/disabled states
- Meaningful labels
- Accessible interaction targets

Avoid overcrowding.

The UI should feel premium but practical.

==================================================
26. MOBILE-FIRST DESIGN
==================================================

This is a mobile application.

Design specifically for phone screens.

Do not create desktop/web layouts.

Use:

- Safe areas
- Scrollable content
- Appropriate keyboard handling
- Bottom navigation
- Native-feeling gestures
- Native-feeling modals/sheets
- Proper touch interaction

Images should maintain good aspect ratios.

Avoid layouts that depend on fixed desktop dimensions.

==================================================
27. DO NOT OVERDESIGN
==================================================

Do not add random features simply to make the application appear larger.

Do not invent:
- Social feeds
- Reviews marketplace
- Professional discovery
- Chat marketplace
- Random loyalty programs
- Unrequested payment systems
- Unrequested dashboards

The goal is a focused interior-services application.

==================================================
28. SOURCE-OF-TRUTH PRIORITY
==================================================

When making design decisions, use this priority:

1. These instructions
2. Attached Figma/Stitch frames
3. Extracted design system from those frames
4. Existing visual patterns within the app
5. Sensible UX conventions

Do not allow individual reference frames to contradict the overall product requirements.

==================================================
29. FINAL QUALITY BAR
==================================================

The result should look like a real startup/product ready for a professional design review.

It should NOT look like:
- AI-generated template screens
- Generic React Native UI
- A collection of unrelated cards
- A generic home-services marketplace
- A copied e-commerce app

It should feel like a purpose-built Velora product.

The app should communicate:

"Whatever interior work you need — complete transformation or just one specific job — Velora can handle it."

Every screen should feel connected.

Every major flow should be complete.

Every CTA should have a logical destination.

Every component should follow the same design system.

Use the attached reference frames extensively as the visual foundation, while implementing all of the functional changes specified in this prompt.

Finally, ensure the generated implementation remains clean, modular, reusable, and ready for later API/controller integration.