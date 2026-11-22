# 🛒 PurelyProducts

PurelyProducts is a full-stack e-commerce application with a React and Vite frontend and a Node.js, Express, and MongoDB backend. The Express application keeps the MVC routes and models for customer, administrator, and delivery workflows, while React provides the shared storefront and role-based interfaces.
## Project links

- **Live demo:** [purelyproducts.onrender.com](https://purelyproducts.onrender.com)
- **GitHub:** [MAHESH549990/PurelyProducts](https://github.com/MAHESH549990/PurelyProducts)
## Features
### Customer storefront

- Register, sign in, and manage a profile with saved delivery addresses.
- Browse the product catalogue, view product details, and read ratings and reviews.
- Add products to the cart, update quantities, and remove items.
- Place orders using the built-in demo payment flow.
- Review delivered products, optionally attach an image, and delete your own reviews.
- Pay a ₹35 delivery charge when the product subtotal is below ₹299.
- Use the Hindi and English shopping assistant to check live stock and get product, cart, and checkout guidance.
- See personalized product recommendations informed by recent searches, cart additions, and placed orders.
### Administrator

- View an order and sales operations dashboard.
- Add, edit, and remove products, and manage available stock.
- Review customers and order details.
- Confirm orders and assign them to approved delivery partners.
- Manage delivery partner applications and view administrator profile details.
- View an earnings graph and a fixed ₹30 benefit for each assigned order.
### Delivery partner

- View assigned orders and customer, item, and delivery address details.
- Move orders through delivery and mark them as delivered.
- View delivery history, profile information, earnings totals, and a six-month graph.
- Earn a fixed ₹40 per delivered order, regardless of how many items the order contains.
### Inventory and order earnings

- Stock is tracked per product, checked when customers add items to the cart, and reduced when checkout completes.
- Administrators can update quantities from the Inventory page and see low-stock and out-of-stock counts.
- Admin benefit is counted when an order is assigned. Delivery earnings are counted when an order is marked delivered.
### Payment note

Checkout uses a simulated card form for demonstration. It does not connect to a payment provider or charge a real card. Completing the demo payment creates the order from the customer's server-side cart.
## Technology

| Technology | Use |
| --- | --- |
| React 19, Vite | Customer, admin, and delivery interfaces |
| CSS | Responsive page styling |
| Node.js, Express 5 | Server and HTTP routes |
| MongoDB, Mongoose | Database and models |
| Passport.js, Express Session | Login, sessions, and role-based access |
| Joi | Request data validation |
| Cloudinary, Multer | Product and review image uploads |
## Project structure

```text
PurelyProducts/
├── admin/
│   ├── init/              # Product seed data and initializer
│   └── routes/            # Admin routes, including inventory
├── delivery/              # Delivery partner routes and workflows
├── frontend/
│   ├── src/               # React pages, components, and styles
│   └── vite.config.mjs    # Vite dev server and production build
├── models/                # Mongoose models
├── public/                # Static files and built React app in public/app
├── user/                  # Customer routes and workflows
├── utils/                 # Rendering and earnings helpers
├── cloudConfig.js         # Cloudinary configuration
├── index.js               # Express entry point
├── schema.js              # Joi validation schemas
├── upload.js              # Multer upload configuration
├── package.json
└── README.md
```
## Setup
### Requirements

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- Cloudinary credentials for image uploads
### Install

```bash
git clone https://github.com/MAHESH549990/PurelyProducts.git
cd PurelyProducts
npm install
```
### Configure environment variables

Create a `.env` file in the project root. Use your own values and keep the file private:

```env
PORT=8080
ATLAS_URL=your_mongodb_connection_string
SECRET=your_session_secret
GEMINI_API_KEY=your_google_ai_studio_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ADMIN_NAME=your_admin_username
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

The Cloudinary variable names must match the names above. Set environment variables in the Render service settings for deployment. Never commit `.env` or publish real credentials.

The shopping assistant checks product names and stock directly in MongoDB. To enable its AI-generated Hindi and English replies, create a Gemini API key in Google AI Studio (https://aistudio.google.com/app/apikey) and set GEMINI_API_KEY in your local environment file and Render environment settings. Gemini currently offers a limited free tier; quotas and model availability can change. If no key is set or the API is temporarily unavailable, the assistant still answers common product availability and shopping-flow questions using built-in bilingual responses.
### Run the Express app

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080).
### Develop the React frontend

Run the Express server in one terminal, then run Vite in another:

```bash
npm run dev
```

Vite runs at [http://localhost:5173/app/](http://localhost:5173/app/) and proxies application requests to Express on port 8080.
### Build for deployment

```bash
npm run build
npm start
```

Vite writes the production frontend to `public/app`, which Express serves. The Render deployment should run the build before starting the server, for example with `npm run build && npm start`.
### Seed catalogue data

The sample catalogue is in `admin/init/data.js`. To initialize it, run:

```bash
node admin/init/app.js
```

**Warning:** the initializer deletes all existing product documents before inserting the sample catalogue. Back up or otherwise preserve any product records you need before running it.

## Extended Technical Reference

This appendix adds route-level behavior, operations notes, troubleshooting, and a report-writing outline.
Implementation details can change; verify against the current source before publishing a formal report.
### Endpoint behavior reference
#### GET /product
Purpose: Public catalogue
Access: Product browsing and storefront data.
Behavior: Personalized section only appears for relevant signed-in results.
#### GET /product/:id
Purpose: Product detail
Access: Product description, stock, rating, and reviews.
Behavior: Cart and review actions apply their own authentication checks.
#### POST /product/:id/cart
Purpose: Add cart item
Access: Validates product and requested quantity.
Behavior: Records cart activity for the signed-in customer.
#### GET /product/cart
Purpose: View cart
Access: Loads the signed-in customer's current cart.
Behavior: Displays calculated subtotal and checkout action.
#### DELETE /product/cart/:id
Purpose: Remove cart item
Access: Removes a line from the current customer's cart.
Behavior: Requires a valid customer session.
#### GET /product/cart/place
Purpose: Payment page
Access: Shows the simulated checkout step.
Behavior: Requires sign-in and a saved delivery address.
#### POST /product/cart/payment-session
Purpose: Start payment session
Access: Creates a temporary server-side checkout snapshot.
Behavior: Amounts are based on the stored cart.
#### POST /product/cart/payment/complete
Purpose: Complete demo payment
Access: Creates the order after stock validation.
Behavior: Clears the cart after successful completion.
#### GET /orders/ordered
Purpose: Order history
Access: Lists orders belonging to the signed-in customer.
Behavior: Does not expose other customers' orders.
#### GET /orders/ordered/:id/details
Purpose: Order detail
Access: Shows product lines, address, totals, and status.
Behavior: Ownership is verified for the current customer.
#### POST /users/:id/reviews
Purpose: Submit review
Access: Creates a rating and comment for a product.
Behavior: Optional image goes through configured upload service.
#### DELETE /users/:id/reviews/:reviewId
Purpose: Delete own review
Access: Removes the selected product review.
Behavior: Server checks that the signed-in user owns it.
#### POST /api/recommendations/search
Purpose: Record search activity
Access: Stores meaningful customer searches.
Behavior: Recent history is capped to bound stored activity.
#### GET /api/recommendations
Purpose: Get personalized products
Access: Ranks in-stock catalogue items against activity.
Behavior: Returns no results when signals are weak or missing.
#### POST /api/chat
Purpose: Ask shopping assistant
Access: Responds in Hindi or English.
Behavior: Can use product stock from MongoDB; AI key is optional.
#### GET /admin/products
Purpose: Admin catalogue
Access: Lists products and product management actions.
Behavior: Requires admin role.
#### POST /admin/products/new
Purpose: Create product
Access: Validates product data and optional image.
Behavior: Image upload uses Cloudinary configuration.
#### PUT /admin/products/:id
Purpose: Update product
Access: Edits product data and optional image.
Behavior: Existing image remains when no replacement is uploaded.
#### DELETE /admin/products/:id
Purpose: Delete product
Access: Removes the product and its associated reviews.
Behavior: Requires admin role.
#### GET /admin/inventory
Purpose: View inventory
Access: Lists available stock information.
Behavior: Requires admin role.
#### POST or PUT /admin/inventory/:id/stock
Purpose: Save stock
Access: Sets the absolute current on-hand quantity.
Behavior: This action is not an incremental stock receipt.
#### GET /admin/users/orders/pending
Purpose: Pending orders
Access: Lists placed orders awaiting review.
Behavior: Requires admin role.
#### PATCH /admin/users/orders/confirmed/:id/accept
Purpose: Confirm order
Access: Moves a placed order to confirmed.
Behavior: Admin can then assign an approved partner.
#### GET /admin/users/orders/accepted
Purpose: Accepted orders
Access: Shows confirmed and assigned orders.
Behavior: Provides access to delivery assignment.
#### POST /admin/users/orders/:id/assign-delivery
Purpose: Assign partner
Access: Associates approved partner and order.
Behavior: Records assigned time and fixed admin benefit.
#### GET /delivery/orders/assign
Purpose: Assigned orders
Access: Lists orders assigned to current partner.
Behavior: Partner ownership is checked by middleware and query.
#### POST /delivery/orders/:id/confirm
Purpose: Start delivery
Access: Moves an assigned order to out_for_delivery.
Behavior: Only the assigned partner can update the order.
#### POST /delivery/orders/assign/:id/delivered
Purpose: Mark delivered
Access: Moves an active order to delivered.
Behavior: Records delivery time and fixed ₹40 earnings.
#### GET /delivery/person/profile
Purpose: Partner profile
Access: Shows partner account and application details.
Behavior: Requires approved delivery partner access.
### Application behavior and business rules
#### Account sessions
Express sessions preserve the signed-in identity across requests.
Passport restores the account for protected handlers.
Logout ends the active authentication session.
#### Role authorization
React can tailor navigation to the current role.
Express middleware checks authorization on each protected route.
Client-side navigation alone is never treated as access control.
#### Validation
Joi schemas validate product fields before persistence.
Cart and checkout logic validate product availability and quantity.
Multer handles multipart uploads before Cloudinary storage.
#### Order lifecycle
placed is the state created by checkout.
confirmed is the state after admin review.
assigned records the selected delivery partner.
out_for_delivery means the partner started the delivery.
delivered records fulfillment completion; cancelled orders are excluded from recommendations.
#### Checkout amount
The subtotal is calculated from current product and quantity data.
A ₹35 charge applies only when subtotal is under ₹299.
The server computes the total instead of trusting a browser value.
#### Inventory meaning
Admin stock save sets the absolute on-hand quantity.
It does not add the submitted amount to the previous stock.
Checkout validates stock and updates inventory during order creation.
#### Admin benefit
The application assigns ₹30 benefit per order.
The qualifying point is delivery partner assignment.
The amount is a fixed project rule, not an accounting settlement.
#### Partner earning
The application records ₹40 per delivered order.
An order with many products still counts as one delivery.
The earning is recorded when delivery status becomes delivered.
#### Recommendation signals
Search history, cart additions, current cart, and recent orders are signals.
Names and categories are stronger than generic description overlap.
Candidate products must be in stock and above the score threshold.
#### Recommendation exclusions
Products already in the cart are excluded.
Products in recent non-cancelled orders are excluded.
No popular-product fallback appears when the match is weak.
#### Assistant context
The backend checks the catalogue for product information.
Only relevant product facts should be sent as answer context.
The assistant does not perform purchase actions or expose private orders.
#### Assistant availability
A Gemini key enables generated responses when provider access is available.
Built-in English and Hindi help covers common questions without the key.
Provider quota or outage should not be described as a database failure.
#### Image lifecycle
Cloudinary stores hosted media while MongoDB stores references.
Editing without a replacement retains the existing product image.
Review photos and product photos are optional user-facing media.
#### Map display
Mapbox is an optional profile enhancement.
A usable address and public token are required.
No address means no map is rendered.
#### Flash feedback
Successful and failed actions can produce flash feedback.
Redirect targets should return the user to the relevant module.
Flash data is session-based and commonly consumed once.
### Troubleshooting reference
#### MongoDB authentication fails
1. Verify database username, password, and database permissions.
2. URL-encode reserved password characters inside the URI.
3. Confirm ATLAS_URL is the active environment variable.
#### MongoDB SRV DNS lookup fails
1. Confirm the Atlas cluster hostname in the connection string.
2. Test DNS SRV separately from port connectivity.
3. Use the seed-list URI supplied by Atlas if your resolver blocks SRV.
#### React page is blank
1. Rebuild the frontend using npm run build.
2. Inspect browser console and network errors for missing assets.
3. Restart Express and hard-refresh to clear stale bundles.
#### Vite page cannot reach the backend
1. Run Express and Vite in two terminals.
2. Check the Vite proxy target and backend port.
3. Make sure the client request matches an Express mounted path.
#### Login or signup fails
1. Check the database connection and server logs.
2. Confirm the form field names match the Passport route.
3. Clear stale cookies and retry with the current session secret.
#### Checkout cannot continue
1. Sign in and add a delivery address to the profile.
2. Check that cart products remain in stock.
3. Read the flash feedback and server logs for validation details.
#### Delivery charge is unexpected
1. A subtotal below ₹299 adds ₹35.
2. A subtotal of ₹299 or higher has no low-order delivery charge.
3. The server derives the subtotal from cart records.
#### Payment page asks for card details
1. Payment is simulated and only intended for demonstration.
2. No gateway charges money or validates real card data.
3. Do not enter real card information into the app.
#### Product image upload fails
1. Set all Cloudinary credentials in the server environment.
2. Submit the form as multipart form data.
3. Check upload limits and server logs without exposing credentials.
#### Admin route redirects or denies access
1. Verify the current account has admin role.
2. Sign in again to refresh the session.
3. Inspect the exact request route and middleware behavior.
#### Delivery partner sees no assigned orders
1. Confirm the partner application was approved.
2. Check the order was assigned to this account.
3. Ensure the order status is assigned or out_for_delivery.
#### Delivery completion is rejected
1. Start delivery before marking it complete.
2. Confirm this order is assigned to the signed-in partner.
3. Check that the order has not already been delivered.
#### Recommendations are empty
1. Use the same signed-in account that generated activity.
2. Search a concrete product name or category and browse related items.
3. Empty results are intentional when no good match is found.
#### Recommendations seem unrelated
1. Current cart products and recently bought products are excluded.
2. Inspect product category and name overlap in the catalogue.
3. Broad searches and generic descriptions are weighted less strongly.
#### Hindi assistant response is mixed
1. Select Hindi before sending a new message.
2. Product names and technical vocabulary may remain in English.
3. Built-in bilingual responses work without Gemini.
#### AI reply is unavailable
1. Check GEMINI_API_KEY on the backend only.
2. Check provider availability, quota, and model access.
3. Stock lookup and built-in help do not require Gemini.
#### Profile map is missing
1. Check MAP_TOKEN and browser console errors.
2. Make sure the saved address has location information.
3. The app omits the map when no usable address is available.
#### Flash message does not appear
1. Check session and flash middleware ordering.
2. Verify the action redirects to the expected page.
3. Flash content is commonly consumed on the next request.
#### Inventory value appears wrong
1. The stock form sets an absolute quantity rather than adding a delta.
2. Reload the inventory page after saving.
3. Confirm the selected product still exists.
#### Review deletion opens an error page
1. Check product and review identifiers in the request.
2. Server permits removal only by the review owner.
3. Verify the redirect returns to the originating product page.
### Project report chapter outline

1. Introduction
   - Context and motivation for the e-commerce project.
   - Introduce customer, admin, and delivery roles.

2. Problem statement
   - Describe catalogue and order coordination challenges.
   - Explain why user-specific discovery matters.

3. Objectives and scope
   - List the workflows delivered in this version.
   - Clarify simulated payment and project boundaries.

4. Requirements
   - Group functional requirements by user role.
   - Include responsive design and persistence requirements.

5. Technology stack
   - Explain React, Vite, Node, Express, MongoDB, and Mongoose.
   - Cover Passport, Joi, Cloudinary, and optional APIs.

6. Architecture
   - Draw browser, frontend, backend, middleware, and database layers.
   - Explain the MVC-oriented code organization.

7. Database design
   - Document User, Product, Cart, Order, Delivery, and Review records.
   - Show references and key ownership relationships.

8. Customer module
   - Describe catalogue, details, cart, checkout, and address pages.
   - Explain reviews, orders, and profile management.

9. Admin module
   - Describe dashboard, products, inventory, customers, and orders.
   - Explain application review and partner assignment.

10. Delivery module
   - Describe assigned, active, and completed order pages.
   - Explain access scoping and status progression.

11. Recommendation module
   - Describe search, cart, and purchase activity signals.
   - Explain matching weights, exclusions, and empty results.

12. Assistant module
   - Describe language selection and live product lookup.
   - Explain Gemini integration and fallback behavior.

13. Checkout logic
   - Show subtotal, delivery charge, stock validation, and order creation.
   - State clearly that payment is simulated.

14. Security
   - Describe sessions, server-side role checks, and validation.
   - Explain secret handling and data ownership restrictions.

15. Testing and evaluation
   - Record manual test cases and actual observations.
   - Do not claim an automated test suite when none is configured.

16. Deployment
   - Document Render commands and required environment variables.
   - Explain database network access and post-deploy checks.

17. Limitations
   - Disclose rule-based recommendations and optional integrations.
   - Describe simulation and current test coverage accurately.

18. Future work
   - Suggest payment integration, monitoring, and audit history.
   - Consider automated tests and improved discovery.

19. Conclusion
   - Summarize completed roles and workflows.
   - Connect outcomes to the objectives stated earlier.
### Report screenshot and evidence checklist

1. Storefront home at a desktop viewport.
2. Storefront home at a mobile viewport.
3. Product listing with category navigation.
4. Product detail page with stock and review information.
5. Cart page with quantity and subtotal.
6. Checkout page showing the low-order delivery charge.
7. Simulated payment page and completion feedback.
8. Customer profile with saved address information.
9. Interactive map when a valid location and token are configured.
10. Customer order list and an individual order detail.
11. Product review submission and owner delete action.
12. Admin dashboard with the current test dataset.
13. Product add form and image selection.
14. Product edit form displaying its existing image.
15. Inventory page before and after saving stock.
16. Pending and accepted admin order lists.
17. Delivery partner assignment page.
18. Delivery profile and partner detail information.
19. Assigned order details with customer and item information.
20. Active delivery status and delivered history.
21. Admin and delivery earnings graphs.
22. Personalized products after creating customer activity.
23. Assistant response in English.
24. Assistant response in Hindi.
25. Use test accounts and remove personal information from screenshots.
26. Hide API keys, addresses, phone numbers, and customer identifiers.
27. Label figures and refer to them consistently in the report.
### Demonstration sequence

1. Start the backend after configuring the database connection.
2. Start the frontend development server or use the built React app.
3. Create or sign in to a customer test account.
4. Save a delivery address to the customer profile.
5. Search for a specific category or product.
6. Open a product detail page and review its stock and ratings.
7. Add the item to the cart and inspect the cart contents.
8. Use an under-₹299 subtotal to demonstrate the ₹35 charge.
9. Complete the simulated payment using test-only input.
10. Open the resulting order from the customer order history.
11. Sign in as an administrator with a separate test session.
12. Confirm the placed order from the pending order list.
13. Assign an approved delivery partner.
14. Sign in to that delivery partner account.
15. Start the delivery and verify the active order list.
16. Mark the order delivered and verify completed history.
17. Review the ₹30 admin benefit and ₹40 partner earning.
18. Return to the customer account and submit an eligible review.
19. Revisit recommendations after searches, cart, or order activity.
### Additional report notes

1. State that payment is simulated and no funds are collected.
2. Describe recommendation ranking as deterministic, rule-based matching.
3. Explain that a new user may initially receive no recommendations.
4. Describe why cart and recently purchased products are excluded.
5. Document the stock check as a server-side checkout responsibility.
6. Distinguish admin benefit from customer revenue and delivery earnings.
7. Explain that ₹30 and ₹40 are fixed per-order demonstration rules.
8. Describe Gemini as optional, and avoid promising free unlimited usage.
9. Describe Mapbox as optional and dependent on address location data.
10. Explain Cloudinary as the hosted image provider.
11. Use a database diagram to show references between models.
12. Use a sequence diagram for checkout and delivery status changes.
13. Keep report screenshots aligned with the deployed application version.
14. Include only results actually observed during project demonstration.
15. List manual verification separately from automated tests.
16. Do not publish secret configuration values in report appendices.
17. Do not include real customer details in sample screenshots.
18. Record project limitations and practical next steps honestly.
19. Use figure captions and cite external resources if included.
20. Check that the README and report describe the same feature behavior.

## Author

**Mahesh Bhatt**  
BCA — Artificial Intelligence and Data Science  
GitHub: [MAHESH549990](https://github.com/MAHESH549990)

---

⭐ Explore the repository or try the live demo to see the customer, administrator, and delivery workflows.
