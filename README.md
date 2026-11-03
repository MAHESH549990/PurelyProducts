# 🛒 PurelyProducts

**PurelyProducts** is a full-stack e-commerce web application built with a React frontend and a Node.js, Express, and MongoDB backend. It allows users to browse products, manage their shopping cart, place orders, and share product reviews. Separate Admin and Delivery modules manage products, orders, and deliveries.

## 🌐 Project Links

- **Live Demo:** [PurelyProducts](https://purelyproducts.onrender.com)
- **GitHub Repository:** [MAHESH549990/PurelyProducts](https://github.com/MAHESH549990/PurelyProducts)

## ✨ Features

### 👤 User Module

- User registration and login
- Browse and view product details
- Add and remove products from the shopping cart
- Manage cart quantities
- Place orders
- View product reviews and ratings
- Submit product reviews with optional images
- Manage user profile and delivery address
- View order information

### 🛠️ Admin Module

- Admin dashboard
- Add, update, and delete products
- Manage customer orders
- Confirm and process orders
- Manage delivery partner requests

### 🚚 Delivery Module

- Separate delivery partner module
- View assigned orders
- Manage order delivery status
- Track orders through different delivery stages

### 🔐 Authentication and Security

- User authentication using Passport.js
- Session-based authentication
- Role-based access for customers, admins, and delivery partners
- Protected routes for authorized actions

## 🛠️ Tech Stack

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| React           | Customer, admin, and delivery interfaces |
| Vite            | Frontend development/build|
| CSS3            | Responsive styling        |
| Node.js         | JavaScript runtime        |
| Express.js      | Backend framework         |
| MongoDB         | Database                  |
| Mongoose        | Database modeling         |
| Passport.js     | Authentication            |
| Express Session | Session management        |
| Cloudinary      | Review image storage      |

## 📁 Project Structure

```text
PurelyProducts/
├── admin/              # Admin routes and functionality
├── user/               # User routes and functionality
├── delivery/           # Delivery partner functionality
├── frontend/           # React customer, admin, and delivery interfaces
├── models/             # Mongoose database models
├── frontend/           # React application and Vite configuration
├── public/              # Static assets, CSS, and JavaScript
├── utils/               # Utility functions
├── middleware.js        # Upload middleware
├── cloudConfig.js       # Cloudinary configuration
├── index.js             # Application entry point
├── package.json         # Dependencies and scripts
├── .gitignore           # Git ignored files
└── README.md             # Project documentation
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MAHESH549990/PurelyProducts.git
```

### 2. Navigate to the Project Directory

```bash
cd PurelyProducts
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and add the environment variables required by your application.

Example:

```env
PORT=8080
ATLAS_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Use the exact variable names expected by your application's configuration files. Replace the example values with your own credentials, and **never commit your `.env` file or expose your secret keys on GitHub**.

Checkout currently uses a clearly labeled demo payment flow. It does not connect to a payment provider or charge money. Completing the demo step records the order from the current server-side cart.

### 5. Start the Application

```bash
npm start
```

For frontend development with Vite, run `npm run dev`. For a production deployment, run `npm run build` before `npm start`; the Express server serves the generated files from `public/app`. The existing Express routes and session authentication provide JSON page data to React and continue to handle cart, order, review, address, product, admin, and delivery actions.

### 6. Open the Application

Visit the following URL in your browser:

```text
http://localhost:8080
```

**Prerequisites:** Node.js, npm, a MongoDB database, and Cloudinary credentials if you want to use image uploads.

## 🎯 Project Goal

The goal of PurelyProducts is to develop a practical full-stack e-commerce application while gaining hands-on experience with backend development, database management, authentication, file uploads, CRUD operations, and role-based application architecture.

## 👨‍💻 Author

**Mahesh Bhatt**

BCA — Artificial Intelligence and Data Science

GitHub: [MAHESH549990](https://github.com/MAHESH549990)

---

⭐ If you find this project interesting, feel free to explore the repository and check out the live demo.
