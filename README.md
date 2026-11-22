# PurelyProducts

A full-stack e-commerce application with a React storefront and role-based tools for customers, administrators, and delivery partners. The backend uses Node.js, Express, MongoDB, and Mongoose in an MVC-style structure.

## Project links

- Live demo: [purelyproducts.onrender.com](https://purelyproducts.onrender.com)
- GitHub: [MAHESH549990/PurelyProducts](https://github.com/MAHESH549990/PurelyProducts)

## Main features

### Customer

- Sign up, log in, manage profile, and save delivery addresses.
- Browse products, view details and reviews, and manage cart items.
- Checkout with a simulated payment flow and track orders.
- Submit product reviews with optional photos; delete your own reviews.
- Get a ₹35 delivery charge when the product subtotal is below ₹299.
- Use the English/Hindi shopping assistant and personalized recommendations.

### Administrator

- Manage products, product images, and inventory.
- View customer details and order information.
- Confirm orders and assign them to approved delivery partners.
- Review delivery partner applications.
- View order metrics and a graph; the app records ₹30 per assigned order.

### Delivery partner

- View assigned orders with customer, item, and address details.
- Start delivery and mark orders delivered.
- View delivery history, profile, and earnings graph.
- The app records ₹40 per delivered order, regardless of item count.

## Recommendation system

Recommendations are personalized for signed-in customers from their recent search history, cart additions, current cart, and recent non-cancelled orders.

The backend compares those activity signals with product names and categories. Specific description matches can contribute, but are weighted lower. It returns only in-stock products with a strong enough match and excludes products already in the current cart or recent orders.

A new customer has no recommendations until they create activity. If the available products do not match the activity, the recommendation list stays empty instead of showing unrelated popular items.

Relevant endpoints:

- POST /api/recommendations/search records a meaningful search.
- GET /api/recommendations returns matching products for the signed-in customer.

## Bilingual shopping assistant

The chat interface supports English and Hindi. It can respond to greetings, answer shopping questions, check product availability using live catalogue data, and guide customers through adding products to the cart and checkout.

When GEMINI_API_KEY is configured, the backend can use Gemini to generate conversational replies using relevant product information. Without the key, built-in bilingual responses still cover common product, cart, and checkout questions. The assistant is rate-limited and does not place orders or access private customer order/address details.

Endpoint: POST /api/chat.

## Checkout, inventory, and earnings

Checkout uses a simulated payment form; it does not connect to a payment gateway or charge a card. The server calculates the order from the customer's cart, checks product stock, and creates the order after the simulated payment step.

The delivery charge is ₹35 when the product subtotal is below ₹299. Admin stock updates set the product's on-hand quantity. Inventory is checked and reduced when checkout completes.

The earnings values are fixed project rules: ₹30 for each order assigned by an administrator, and ₹40 for each order marked delivered by a delivery partner.

## Technology

| Area                          | Technology                   |
| ----------------------------- | ---------------------------- |
| Frontend                      | React, Vite, CSS             |
| Backend                       | Node.js, Express 5           |
| Database                      | MongoDB, Mongoose            |
| Authentication and sessions   | Passport.js, Express Session |
| Validation                    | Joi                          |
| Image uploads                 | Multer, Cloudinary           |
| Optional assistant generation | Gemini API                   |
| Optional interactive maps     | Mapbox                       |

## Project structure

    PurelyProducts/
    ├── admin/       Admin dashboard, product, inventory, and order routes
    ├── delivery/    Delivery partner routes and workflows
    ├── frontend/   React source and Vite configuration
    ├── models/     Mongoose models
    ├── public/     Static assets and production React build
    ├── user/       Customer, product, order, review, and API routes
    ├── utils/      Shared helpers
    ├── index.js    Express entry point and route mounting
    ├── schema.js   Joi validation schemas
    └── upload.js   Multer upload configuration

## Run locally

Requirements: Node.js, npm, MongoDB, and Cloudinary credentials for image uploads.

    git clone https://github.com/MAHESH549990/PurelyProducts.git
    cd PurelyProducts
    npm install

Create a private .env file in the project root:

    PORT=8080
    ATLAS_URL=your_mongodb_connection_string
    SECRET=your_session_secret

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    GEMINI_API_KEY=your_optional_gemini_api_key
    MAP_TOKEN=your_optional_mapbox_public_token

    ADMIN_NAME=your_admin_username
    ADMIN_EMAIL=your_admin_email
    ADMIN_PASSWORD=your_admin_password

Start Express:

    npm start

Open http://localhost:8080.

For frontend development, run Express in one terminal and Vite in another:

    npm run dev

Build the React frontend for production:

    npm run build
    npm start

Vite writes the production bundle to public/app. On Render, build with npm install && npm run build and start with npm start. Set environment variables in Render settings; never commit .env or publish credentials.

## Important configuration notes

- ATLAS_URL must contain valid MongoDB credentials and point to a reachable database.
- Cloudinary variables are required for product and review image uploads.
- GEMINI_API_KEY is optional; without it, the assistant uses built-in responses.
- MAP_TOKEN is optional and enables interactive profile maps when an address has location data.
- Use a strong SECRET in production.
- Do not put private API keys in frontend code.

## Main workflows

### Customer order

1. Customer browses a product and adds it to the cart.
2. Customer chooses a saved address and reviews the server-calculated total.
3. Customer completes the simulated payment step.
4. The server checks stock, creates the order, and clears the cart.
5. Admin confirms the order and assigns an approved delivery partner.
6. The partner starts delivery and marks it delivered.
7. Customer can view the order and submit an eligible review.

### Delivery partner application

A customer submits the delivery application with contact and vehicle details. An administrator reviews it. Approved partners become available for order assignment.

### Product and stock management

Administrators can create and edit products, upload or replace images, and save stock quantities. Saving stock sets the new on-hand amount; it does not add a quantity to the previous value.

## Data models

- User: account, role, saved addresses, recent searches, and cart activity.
- Product: catalogue information, category, price, stock, image, rating, and reviews.
- Cart: customer reference and product/quantity lines.
- Order: customer, product lines, totals, address snapshot, status, and partner assignment.
- Delivery: partner contact, vehicle, licence image, and application status.
- Review: product, author, rating, comment, and optional image.

## Security and limitations

- Protected routes verify user role on the server.
- Customer order access and review deletion are scoped to ownership.
- Checkout totals and stock are calculated or validated by the backend.
- Payment is simulated; no real card is charged.
- Recommendations use weighted rules, not a trained machine-learning model.
- Gemini responses depend on provider configuration and availability.
- The npm test script is currently a placeholder; no automated test suite is configured.

## Troubleshooting

- MongoDB authentication errors: verify ATLAS_URL credentials and URL-encode special characters in the password.
- MongoDB SRV errors: verify DNS SRV resolution and the Atlas hostname; TCP connectivity alone does not confirm SRV works.
- Missing product images: check Cloudinary configuration, multipart form submission, and server logs.
- Empty recommendations: use the same signed-in account, search specific products/categories, and create relevant cart or order activity.
- Missing map: verify MAP_TOKEN and that the saved address includes location information.
- Missing AI-generated chat replies: check GEMINI_API_KEY and provider quota; built-in bilingual help does not require Gemini.

## Author

**Mahesh Bhatt**
GitHub: [MAHESH549990](https://github.com/MAHESH549990)

**Rohit Singh**
