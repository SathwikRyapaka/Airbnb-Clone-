# 🏡 Airbnb Clone — Full-Stack Travel Listing & Booking Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=flat&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-black?style=flat&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An advanced full-stack travel listing and booking platform inspired by **Airbnb**. The platform enables travelers to discover, search, filter, and securely book vacation properties worldwide, while hosts can manage listings, inspect guest reservations, and track host earnings.

---

## 📌 Project Architecture & 5-Module Blueprint

This project is built following the structured 5-module capstone curriculum:

```
┌────────────────────────────────────────────────────────┐
│                   React 18 Frontend                    │
│   (Vite · Tailwind CSS · Lucide Icons · Leaflet Maps)  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / JWT)
┌───────────────────────────▼────────────────────────────┐
│                  Express.js Backend                    │
│    (Auth Middleware · Validation · Error Handling)     │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼────────────────────────────┐
│                    MongoDB Database                    │
│   (Users · Listings · Bookings · Reviews Collections)   │
└────────────────────────────────────────────────────────┘
```

### Module 1: Backend Foundation (Data Model & Core APIs)
- **Data Models**: MongoDB schemas for `User`, `Listing`, `Booking`, and `Review` with strict data constraints and virtual populates.
- **Authentication**: JWT token generation and verification with secure `bcryptjs` password hashing (salt rounds: 10).
- **Auth Middleware**: Route guards (`protect`, `optionalAuth`, `requireHost`, `requireAdmin`) enforcing role-based access control.

### Module 2: Frontend: Listings & Search (Connected UI)
- **Responsive Layout**: Airbnb-style responsive grid adapting across mobile, tablet, and 4-column desktop layouts.
- **Category Filter Bar**: Horizontal scrollable categories (Beachfront, Cabins, Mansions, Islands, Trending, Skiing, Camping, etc.).
- **Segmented Search Modal**: Tabbed search by destination, date range, and guest capacity (Adults, Children).
- **Filter Modal**: Price range filters, property type filters, and amenities checklist.

### Module 3: Booking Flow End-to-End (Collision Prevention)
- **Strict Overlap Detection**: Algorithmic validation preventing double bookings (`checkIn < existingCheckOut && checkOut > existingCheckIn`).
- **Dynamic Pricing Engine**: Nightly rate calculation, cleaning fee, and 12% platform service fee breakdown.
- **My Trips Dashboard**: Guest portal to review active bookings, check reservation references, or cancel reservations with automatic refund status.

### Module 4: Maps, Reviews & Host Dashboard
- **Interactive Leaflet Maps**: Integrated OpenStreetMap layer with custom HTML price bubble markers and listing preview popups.
- **Review System & Rating Aggregator**: Multi-category rating bars (Cleanliness, Accuracy, Communication, Location, Check-in, Value) with automatic average recalculation on listing models.
- **Host Management Suite**: Dedicated Host Dashboard with property management table, creation wizard, edit modal, and reservations ledger.

### Module 5: Deployment & Polish
- **Environment Isolation**: Configured for local development and production deployments (Vercel/Render/Netlify).
- **Fallback In-Memory Database**: Automatic fallback ensures development continuity even if standalone MongoDB is not installed locally.
- **Realistic Seed Data**: 12+ pre-populated global luxury stays with high-resolution Unsplash photography, geo-coordinates, and verified sample reviews.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URL.

### 1. Clone the Repository
```bash
git clone https://github.com/SathwikRyapaka/Airbnb-Clone-.git
cd Airbnb-Clone-
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_clone
JWT_SECRET=super_secret_jwt_key_airbnb_clone_2026_dev
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
Install dependencies for both backend and frontend:
```bash
# In backend directory
cd backend
npm install

# In frontend directory
cd ../frontend
npm install
```

### 4. Seed the Database
Populate the database with sample hosts, guests, destination listings, and verified reviews:
```bash
cd backend
npm run seed
```

### 5. Launch the Application
Run both backend and frontend concurrently from root, or in separate terminals:

```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2: React Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials

For quick evaluation without manual signup, use the **Instant Evaluator Demo Access** buttons in the login modal, or log in with:

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Superhost** | `host@airbnb.com` | `password123` | Can create, edit, delete listings & view bookings |
| **Host** | `david@airbnb.com` | `password123` | Tuscany/Amalfi properties host |
| **Guest** | `guest@airbnb.com` | `password123` | Can book stays, leave reviews, view trips |
| **Guest** | `emma@airbnb.com` | `password123` | Active bookings in Paris & Santorini |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (Guest or Host) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile details |
| `PUT` | `/api/auth/password` | Private | Change user password |

### Listings (`/api/listings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/listings` | Public | Query listings with search, category, price & amenity filters |
| `GET` | `/api/listings/featured` | Public | Fetch top-rated and featured vacation stays |
| `GET` | `/api/listings/:id` | Public | Get single listing with host details & reviews |
| `POST` | `/api/listings` | Private (Host) | Publish a new property listing |
| `PUT` | `/api/listings/:id` | Private (Owner) | Update an existing listing |
| `DELETE` | `/api/listings/:id` | Private (Owner) | Remove a listing and dependent bookings/reviews |
| `GET` | `/api/listings/host/my-listings` | Private (Host) | Get all listings belonging to current host |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Book a stay with overlap & date collision validation |
| `GET` | `/api/bookings/my-trips` | Private | Retrieve all bookings for authenticated traveler |
| `GET` | `/api/bookings/listing/:id/availability` | Public | Fetch booked date ranges for calendar disabling |
| `GET` | `/api/bookings/host/reservations` | Private (Host) | Retrieve reservations for host's properties |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel a booking with refund processing |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Private | Submit star rating and written review |
| `GET` | `/api/reviews/listing/:id` | Public | Get reviews & category aggregate averages for a listing |
| `DELETE` | `/api/reviews/:id` | Private (Owner) | Delete a review and trigger rating recalculation |

---

## 🛠 Project Folder Structure

```
Airbnb-Clone-/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & in-memory fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & JWT
│   │   ├── listingController.js  # CRUD & complex query filtering
│   │   ├── bookingController.js  # Collision-free reservations & pricing
│   │   └── reviewController.js   # Rating metrics & aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt methods
│   │   ├── Listing.js            # Property schema with GeoJSON index
│   │   ├── Booking.js            # Reservation dates, pricing & status
│   │   └── Review.js             # Multi-category reviews & static methods
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── seed.js               # Standalone database seed runner
│   ├── utils/
│   │   ├── jwt.js                # Token signing utilities
│   │   └── seedData.js           # Sample users, listings & reviews
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthModal.jsx         # Sign up & login with demo quick-fill
│   │   │   ├── booking/
│   │   │   │   └── BookingWidget.jsx     # Datepicker, pricing & reservation
│   │   │   ├── host/
│   │   │   │   └── ListingFormModal.jsx  # Multi-step property creation wizard
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx            # Search trigger & user menu
│   │   │   │   └── Footer.jsx            # Airbnb styled footer
│   │   │   ├── listings/
│   │   │   │   ├── CategoryBar.jsx       # Category carousel & filter trigger
│   │   │   │   ├── ListingCard.jsx       # Image carousel card with price
│   │   │   │   ├── ListingGrid.jsx       # Responsive grid with skeletons
│   │   │   │   └── ImageGallery.jsx      # High-res photo showcase grid
│   │   │   ├── map/
│   │   │   │   └── LeafletMapView.jsx    # Interactive Leaflet map with price pins
│   │   │   ├── modals/
│   │   │   │   ├── SearchModal.jsx       # Where, When, Who filter modal
│   │   │   │   └── FilterModal.jsx       # Price & amenity checkboxes
│   │   │   └── reviews/
│   │   │       ├── ReviewList.jsx        # Review cards & category progress bars
│   │   │       └── AddReviewModal.jsx    # Star rating & feedback form
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user state & toast dispatch
│   │   ├── pages/
│   │   │   ├── Home.jsx                  # Main explorer & map toggle
│   │   │   ├── ListingDetail.jsx         # Single property detailed view
│   │   │   ├── MyTrips.jsx               # Guest reservations & cancel options
│   │   │   └── HostDashboard.jsx         # Host stats & listings manager
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with interceptors
│   │   ├── App.jsx                       # Routing & modal orchestration
│   │   ├── index.css                     # Tailwind CSS & custom pin styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── package.json                          # Monorepo root scripts
└── README.md
```

---

## 🛡️ License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
