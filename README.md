# ApexStore - Modern Full-Stack E-Commerce Marketplace

ApexStore is a high-performance, full-scale e-commerce web application inspired by the dense, information-rich polish of leading Indian online marketplaces (Flipkart, Amazon India, Myntra).

Engineered with **plain HTML, modern CSS, and vanilla JavaScript** on the frontend, and **Node.js, Express, and MongoDB** on the backend. The Express server serves both the RESTful API and the static frontend from the `/public` directory, running on port **5000**.

---

## 🚀 Key Marketplace Features

### 🛍️ Storefront & Navigation
- **Top Utility Bar**: Free delivery on orders above ₹499, Cash on Delivery available, 24x7 support.
- **Sticky Marketplace Header**:
  - ApexStore brand with Explore *Plus* badge.
  - Search bar with Category dropdown, search button, and **live autocomplete suggestions dropdown** as you type.
  - User Account menu with dropdown (My Orders, Logout, Sign In).
  - Cart link with real-time item counter badge.
- **Category Strip**: Quick-access navigation strip for Electronics, Fashion, Home & Kitchen, and Sports & Fitness.
- **Hero Carousel**: 3 promotional banners, automatic 5-second rotation, pause on hover, navigation arrows, and dot indicators.
- **Category Visual Tiles**: 4 quick-jump cards featuring curated photography and discount highlights.
- **Today's Top Deals**: Horizontal scroll row featuring items with deep discounts (`xx% OFF`).
- **Dense Product Cards**:
  - Pure white background, `object-fit: contain` images.
  - Wishlist heart icon (toggles red and persists in `localStorage`).
  - Brand name, 2-line truncated title.
  - Green rating pill (e.g. `4.3 ★`) with review count.
  - Bold selling price, strikethrough original MRP, and green discount percentage.
  - "Free delivery" text, low-stock warning (`Only 3 left` when stock < 5), or out-of-stock badge.
  - Add to Cart button (hover on desktop, always visible on mobile).
- **Sidebar Filters & Controls**:
  - Category multi-checkboxes.
  - Numeric price range filter (Min & Max with Apply button).
  - Customer rating filters (`4★ & above`, `3★ & above`).
  - In-stock only toggle switch.
  - Sort dropdown: Relevance, Price: Low to High, Price: High to Low, Customer Rating, Newest Arrivals.
  - Mobile slide-in filter drawer.
  - Pagination controls (`Prev`, page numbers, `Next`).

### 📱 Product Details (`product.html`)
- Breadcrumbs (`Home > Category > Product`).
- Left gallery: Thumbnails list with active border, main image with hover zoom preview.
- Right buying column:
  - Brand, title, rating pill with review count, wishlist toggle.
  - Price block: Selling price, MRP strikethrough, discount %, "Inclusive of all taxes".
  - Bulleted highlights list with SVG checkmarks.
  - **Pincode Delivery Estimator**: Type any 6-digit pin (e.g. `560001`) to calculate dynamic delivery date (+3 days), free delivery status, and COD availability.
  - Quantity stepper (`-` / `+`), bounded strictly by available inventory.
  - Action buttons: "Add to Cart" (Amber) and "Buy Now" (Orange, navigates directly to checkout).
- Tabbed Information:
  - Full product description.
  - Detailed specifications table.
  - Verified ratings and reviews summary with 5-star breakdown progress bars.
- "Similar Products" horizontal scroll row.
- Mobile sticky bottom action bar.

### 🛒 Cart & Save For Later (`cart.html`)
- 2-Column layout:
  - Left: Product cards with brand, title, selling price, MRP, discount %, quantity stepper, Remove, and **Save For Later** action.
  - Dedicated "Saved For Later" section with "Move to Cart" button.
  - Right: Sticky "Price Details" card:
    - Items count subtotal.
    - Total discount savings.
    - Delivery charges: **FREE** if order >= ₹499, else **₹40**.
    - Total Amount.
    - Green banner: *"You will save ₹X on this order"*.
    - "Place Order" button.
- Clean empty cart state with SVG illustration and "Shop Now" call to action.

### 💳 Checkout & Delivery (`checkout.html`)
- 3-Step visual progress tracker: `1. LOGIN` -> `2. DELIVERY ADDRESS` -> `3. ORDER SUMMARY & COD`.
- Delivery address form with inline real-time validation:
  - Full Name
  - Mobile number (strictly 10 digits)
  - Pincode (strictly 6 digits)
  - Street Address, City, State
- Cash on Delivery (COD) payment mode with courier instructions.
- **Server-Side Security**:
  - Client prices are ignored; prices are recalculated from the MongoDB database.
  - Atomic stock reduction with automatic rollback if any product fails.
- Order success screen: Green checkmark SVG, Order ID, estimated delivery date, summary, and links to "My Orders" and "Continue Shopping".

### 📦 Order History (`orders.html`)
- Order cards with Order ID, placement date, total price.
- **3-Step Visual Tracking Timeline**: `Placed` (Green) -> `Shipped` -> `Delivered`.
- Delivery address summary.
- Breakdown table of ordered items with thumbnails, unit prices, and quantities.

### 🔐 Authentication (`login.html` & `register.html`)
- Flipkart-style split-screen: Brand blue banner with service benefits on the left, clean form on the right.
- Show/hide password SVG eye toggle.
- Input validation and inline error banners.
- Safe post-login redirection using whitelist validation for the `next` URL query parameter.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern Vanilla CSS, Vanilla JavaScript (ES6+) |
| **Icons** | Clean inline SVGs (Lucide/Feather style, zero emojis) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Utilities** | `cors`, `dotenv` |

---

## 📁 Project Structure

```text
EcommerceStore/
├── server.js               # Express application entry point & static /public server
├── seed.js                 # Database seeder (24 items across 4 categories)
├── package.json            # Scripts and npm dependencies
├── .env                    # Local environment variables
├── .env.example            # Environment variable template
├── .gitignore              # Ignored files (node_modules, .env, logs)
├── README.md               # Project documentation
├── config/
│   └── db.js               # Mongoose database connection
├── models/
│   ├── User.js             # User Mongoose model
│   ├── Product.js          # Product model (brand, mrp, price, rating, reviews, specs, highlights)
│   └── Order.js            # Order model (user ref, items with images, total, shippingAddress, status)
├── middleware/
│   └── auth.js             # JWT verification middleware
├── routes/
│   ├── auth.js             # Register & login routes
│   ├── products.js         # Products catalog (sorting, filters, pagination, related products)
│   └── orders.js           # Order placement (atomic stock deduction & rollback) & order history
└── public/                 # Static frontend served by Express
    ├── index.html          # Marketplace catalog home
    ├── product.html        # Product details, gallery & pincode checker
    ├── cart.html           # Shopping cart & saved for later
    ├── checkout.html       # 3-step checkout & COD placement
    ├── login.html          # Split-screen user login
    ├── register.html       # Split-screen account registration
    ├── orders.html         # User orders with tracking timeline
    ├── css/
    │   └── style.css       # Marketplace CSS design system
    ├── js/
    │   ├── common.js       # SVG icon library, Wishlist, Cart manager, Toasts, Autocomplete, Header/Footer
    │   ├── index.js        # Carousel, top deals, catalog filtering, sort & pagination
    │   ├── product.js      # Gallery zoom, pincode estimator, tabs, Buy Now
    │   ├── cart.js         # Cart items stepper, save for later, delivery fees
    │   ├── checkout.js     # Step progress, form validation, order submission
    │   ├── auth.js         # Shared login/register, password toggle, safe redirection
    │   └── orders.js       # Orders loader, visual timeline & item table
    └── images/             # Real, local product & marketplace images
        ├── products/       # 24 products with multi-angle gallery photos
        ├── banners/        # 3 hero carousel banners
        └── categories/     # 4 category visual exploration tiles
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register new user. Returns JWT token & user object. |
| `POST` | `/api/auth/login` | No | Login user. Returns JWT token & user object. |
| `GET` | `/api/products` | No | Query params: `search`, `category`, `sort`, `minPrice`, `maxPrice`, `minRating`, `inStock`, `page`, `limit`. Returns `{ products, total, page, pages }`. |
| `GET` | `/api/products/:id` | No | Get single product by ID. Returns product with `relatedProducts`. |
| `POST` | `/api/orders` | **Yes** | Place a new order with atomic stock reduction & automatic rollback. |
| `GET` | `/api/orders/my` | **Yes** | Retrieve all orders placed by authenticated user (newest first). |

---

## 💻 Local Setup & Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables (`.env`):**
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_store
   JWT_SECRET=super_secret_jwt_key_ecommerce_2025_change_in_production
   ```

3. **Seed Database:**
   Clears old products and seeds 24 marketplace products with authentic images, specifications, and realistic Indian pricing:
   ```bash
   npm run seed
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```
   *(Or for live development reloading: `npm run dev`)*

5. **Open in Browser:**
   Visit: **http://localhost:5000**
