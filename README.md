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

## Author

**Mahesh Bhatt**  
BCA — Artificial Intelligence and Data Science  
GitHub: [MAHESH549990](https://github.com/MAHESH549990)

---

⭐ Explore the repository or try the live demo to see the customer, administrator, and delivery workflows.
