# ApexStore - Modern Full-Stack E-Commerce Marketplace

ApexStore is a high-performance, full-scale e-commerce web application inspired by the dense, information-rich polish of leading Indian online marketplaces (Flipkart, Amazon India, Myntra).

Engineered with **plain HTML, modern CSS, and vanilla JavaScript** on the frontend, and **Node.js, Express, and MongoDB** on the backend. The Express server serves both the RESTful API and the static frontend from the `/public` directory, running on port **5000**.

---

## Live Demo

- **Application URL**: [https://codealpha-ecommercestore-j3gv.onrender.com](https://codealpha-ecommercestore-j3gv.onrender.com)

Hosted on a free tier, the first load may take up to a minute.

---

## Task Requirements Covered

- [x] **Product Listings**: Dynamic marketplace catalog with multi-field search, category filtering, sort options (price, rating, newest), and pagination.
- [x] **Product Details Page**: Multi-angle gallery with hover zoom, specifications table, highlights, pincode delivery estimator, live stock indicator, and related products.
- [x] **Shopping Cart**: Real-time quantity adjustment, item removal, save-for-later section, order summary, and free delivery thresholds.
- [x] **Order Processing**: Server-side total calculation from database prices, atomic stock deduction with automatic rollback, and order storage.
- [x] **User Registration and Login**: Authentication powered by `bcryptjs` for password hashing and signed JSON Web Tokens (JWT) for secure session handling.
- [x] **Database Management**: MongoDB schemas and Mongoose models for Products, Users, and Orders with strict data validation.

---

## Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)
*Marketplace storefront featuring promotional banner carousel, category visual tiles, deals strip, and dense product catalog.*

### Product Details Page
![Product Details Page](docs/screenshots/product.png)
*Detailed product view with multi-image gallery zoom, specifications table, delivery estimator, and live stock indicator.*

### Shopping Cart
![Shopping Cart](docs/screenshots/cart.png)
*Two-column cart management with item steppers, save-for-later section, order summary, and free delivery thresholds.*

### Checkout
![Checkout](docs/screenshots/checkout.png)
*Three-step checkout flow with real-time delivery address validation, Cash on Delivery (COD) payment, and order confirmation.*

### My Orders
![My Orders](docs/screenshots/orders.png)
*Customer order history with visual order tracking timeline (Placed -> Shipped -> Delivered), items breakdown, and delivery details.*

---

## Key Marketplace Features

### Storefront and Navigation
- **Top Utility Bar**: Free delivery on orders above ₹499, Cash on Delivery available, 24x7 support.
- **Sticky Marketplace Header**:
  - ApexStore brand with Explore *Plus* badge (links to Home).
  - Search bar with Category dropdown, search button, and live autocomplete suggestions routing to `products.html?search=...`.
  - User Account menu with dropdown (My Orders, Logout, Sign In).
  - Cart link with real-time item counter badge.
- **Category Strip**: Navigation strip with active state tracking across Home, All Categories, Electronics, Fashion, Home & Kitchen, and Sports & Fitness.
- **Hero Carousel**: 3 promotional banners, automatic 5-second rotation, pause on hover, navigation arrows, and dot indicators linking to active categories.
- **Category Visual Tiles**: 4 quick-jump cards featuring curated photography and discount highlights.
- **Quick Links Navigation Strip**: Pill-based jump links under hero for Today's Deals, Under ₹499, Under ₹999, 4.5★ & Above, Premium Picks, and New Arrivals.
- **Deal of the Day**: Auto-sliding row of top-discounted products with live countdown timer to midnight local time and low-stock warning indicators ("Only N left").
- **Budget Picks (Under ₹999)**: Auto-sliding row of verified quality everyday essentials.
- **Shop by Category Blocks**: 4 multi-product 2x2 grid blocks (Electronics, Fashion, Home & Kitchen, Sports & Fitness) with direct links and category CTAs.
- **Top Rated Products (4.4★+)**: Auto-sliding row of highest customer-rated items.
- **Premium Collection (₹4,999+)**: Auto-sliding row of flagship tech and luxury essentials.
- **New Arrivals & Best Sellers**: Auto-sliding rows sorted by newest additions and customer review volume.
- **Auto-Sliding Sliders**: All product rows smoothly auto-slide one card every 3.5 seconds with seamless looping, pause on hover/focus/touch, tab visibility pause, and respect for `prefers-reduced-motion`.
- **Recently Viewed**: Persistent history tracked in `localStorage` across visited product pages with one-click clear history.
- **Dual Promo Banners**: Budget Store ("Under ₹999") and Flagship Gear ("Top Rated 4.5★") with brand color gradients and product previews.

### Dedicated Catalog Listing (products.html)
- Multi-field search and query synchronization.
- Category filters (multi-checkboxes).
- Numeric price range filter (Min & Max with Apply button).
- Customer rating filters (`4★ & above`, `3★ & above`).
- In-stock only toggle switch.
- Sort dropdown: Relevance, Highest Discount %, Customer Rating, Best Sellers, Price: Low to High, Price: High to Low, Newest Arrivals.
- Mobile slide-in filter drawer with touch overlay.
- Dynamic pagination controls (`Prev`, page numbers, `Next`).

### Product Details (product.html)
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

### Cart and Save For Later (cart.html)
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

### Checkout and Delivery (checkout.html)
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

### Order History (orders.html)
- Order cards with Order ID, placement date, total price.
- **3-Step Visual Tracking Timeline**: `Placed` (Green) -> `Shipped` -> `Delivered`.
- Delivery address summary.
- Breakdown table of ordered items with thumbnails, unit prices, and quantities.

### Authentication (login.html and register.html)
- Flipkart-style split-screen: Brand blue banner with service benefits on the left, clean form on the right.
- Show/hide password SVG eye toggle.
- Input validation and inline error banners.
- Safe post-login redirection using whitelist validation for the `next` URL query parameter.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern Vanilla CSS, Vanilla JavaScript (ES6+) |
| **Icons** | Clean inline SVGs (Lucide/Feather style, zero emojis) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Utilities** | `cors`, `dotenv` |

---

## Project Structure

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
│   ├── products.js         # Products catalog & home aggregator (sorting, filters, pagination, related)
│   └── orders.js           # Order placement (atomic stock deduction & rollback) & order history
└── public/                 # Static frontend served by Express
    ├── index.html          # Marketplace landing home (hero, deals, 2x2 blocks, curated rows)
    ├── products.html       # Full catalog listing with sidebar filters, sort & pagination
    ├── product.html        # Product details, gallery & pincode checker
    ├── cart.html           # Shopping cart & saved for later
    ├── checkout.html       # 3-step checkout & COD placement
    ├── login.html          # Split-screen user login
    ├── register.html       # Split-screen account registration
    ├── orders.html         # User orders with tracking timeline
    ├── css/
    │   └── style.css       # Marketplace CSS design system
    ├── js/
    │   ├── common.js       # Shared card renderer, Wishlist, Cart manager, RecentlyViewed, Nav
    │   ├── index.js        # Home page controller (carousel, countdown, rows, 2x2 blocks)
    │   ├── products.js     # Catalog controller (filters, URL query sync, sort, pagination)
    │   ├── product.js      # Gallery zoom, pincode estimator, tabs, Buy Now, recently viewed recorder
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

## API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register new user. Returns JWT token & user object. |
| `POST` | `/api/auth/login` | No | Login user. Returns JWT token & user object. |
| `GET` | `/api/products/home` | No | Aggregated home payload: `{ deals, budgetPicks, premiumPicks, topRated, newArrivals, bestSellers, categoryBlocks, brands }` (cached 60s). |
| `GET` | `/api/products` | No | Query params: `search`, `brand`, `category`, `sort` (`relevance`, `discount`, `rating`, `reviewCount`, `newest`, `price-low-high`, `price-high-low`), `minPrice`, `maxPrice`, `minRating`, `inStock`, `ids`, `page`, `limit`. Returns `{ products, total, page, pages }`. |
| `GET` | `/api/products/:id` | No | Get single product by ID. Returns product with `relatedProducts`. |
| `POST` | `/api/orders` | **Yes** | Place a new order with atomic stock reduction & automatic rollback. |
| `GET` | `/api/orders/my` | **Yes** | Retrieve all orders placed by authenticated user (newest first). |

---

## Local Setup and Quick Start

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
