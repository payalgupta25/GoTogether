# GoTogether 🚗💨
### Enterprise-Grade Real-Time Ridesharing & Mobility Platform

---

## 🚀 Project Title & High-Impact Overview

**GoTogether** is a state-of-the-art, enterprise-grade peer-to-peer ridesharing and mobility web application engineered to deliver seamless, secure, and optimized transit coordination. Built with modern full-stack paradigms, GoTogether provides real-time GPS tracking, robust user authentication, integrated emergency SOS protocols, automated media processing via Cloudinary, and dynamic geospatial routing.

### Unique Value Proposition & Core Capabilities
* **Real-Time Bidirectional Communication:** Powered by **Socket.IO** and persistent HTTP servers to broadcast live ride statuses, location telemetry, and active updates across clients.
* **Geospatial Intelligence:** Leverages advanced location-based services via **TomTom Maps APIs** for automated typeahead address autocompletion, precise coordinate resolution, and live navigation mapping.
* **Safety & Security First:** Integrated multi-tier emergency dispatch systems (`/api/sos`), automated email notifications, strict tokenized authentication, and dedicated inclusive filters (such as women-only ride designations).
* **Media Optimization:** Seamless avatar and document management utilizing **Multer** combined with **Cloudinary** cloud storage pipelines.

---

## 🛠️ Comprehensive Tech Stack & Architecture Highlights

### Backend Architecture (`Node.js / Express.js`)
* **Core Framework:** Express.js running on an HTTP wrapper combined with a real-time Socket.IO engine (`backend/server.js`).
* **Database Layer:** MongoDB with **Mongoose** for robust schema validation, relational referencing (`populate`), and strict temporal integrity checks.
* **Security & Auth:** Stateless tokenized sessions using HTTP-only cookies, password hashing via `bcryptjs`, CORS protection, and cookie parsing.
* **Middleware Pipeline:** Custom authentication checks, Multer multi-part storage filters, and centralized error-handling blocks.

### Frontend Architecture (`React / Vite`)
* **Build Tooling:** **Vite** for optimized, high-speed development and production bundling.
* **State Management:** React Context API (`UserContext.jsx`) combined with custom hooks for geolocation tracking (`useGeoLocation.js`), scroll reveals, and smooth typography.
* **Networking:** **Axios** client instances integrated with real-time WebSocket communication sockets (`frontend/src/socket.js`).
* **UI/UX & Mapping:** Custom interactive Map components, status bars, dynamic custom cursors, and responsive modal components.

---

## 📁 Detailed Project Structure

```text
GoTogether/
├── .gitignore
├── README.md
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── maps.controller.js
│   │   ├── ride.controller.js
│   │   └── sos.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/
│   │   ├── contact.model.js
│   │   ├── ride.model.js
│   │   └── user.model.js
│   ├── public/
│   │   └── temp/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── maps.routes.js
│   │   ├── rides.routes.js
│   │   └── sos.routes.js
│   └── utils/
│       ├── cloudinary.js
│       ├── email.config.js
│       ├── emailTemplate.js
│       ├── generateToken.js
│       └── getCoordinates.js
└── frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    │   ├── image.png
    │   └── vite.svg
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── socket.js
        ├── assets/
        ├── components/
        │   ├── Buttons.jsx
        │   ├── Cursor.jsx
        │   ├── LiveMap.jsx
        │   ├── LiveRouteStatusBar.jsx
        │   ├── MapComponent.jsx
        │   ├── Navbar.jsx
        │   ├── OngoingRidesSection.jsx
        │   ├── RateDriverModal.jsx
        │   ├── RideDetailsLoading.jsx
        │   └── styles/
        ├── context/
        │   - UserContext.jsx
        ├── hooks/
        │   ├── TextReveal.jsx
        │   ├── useGeoLocation.js
        │   └── UseScrollReveal.jsx
        └── pages/
            └── AllRides.jsx
```

---

## 🔌 External Integrations & APIs

GoTogether orchestrates multiple enterprise-grade third-party APIs and microservices to ensure an optimized operational pipeline:

1. **TomTom Maps & Search API (`maps.controller.js`)**
   * *Purpose:* Powers live route generation, forward/reverse geocoding, and real-time predictive address typeaheads (`/search/2/geocode/`).
   * *Features:* Country filtering (`countrySet=IN`), dynamic viewport biasing (`lat`/`lon`), and structured location suggestions.
2. **Cloudinary Cloud Media Infrastructure (`cloudinary.js`)**
   * *Purpose:* Handles asynchronous media uploads for user profile pictures and verification assets.
   * *Features:* Temporary local file processing via `multer` followed by secure cloud streaming and automatic clean-up routines.
3. **SMTP Email Notification Engine (`email.config.js`)**
   * *Purpose:* Delivers transactional lifecycle communications (account verification tokens, welcome onboarding notices, and ride confirmation updates) via dynamic HTML templates (`emailTemplate.js`).
4. **Socket.IO Real-Time Telemetry Layer (`server.js`)**
   * *Purpose:* Enables low-latency state synchronization across drivers and passengers for live map tracking and emergency broadcast systems.

---

## 🏃 Quick Start / Deployment Overview

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** instance (Local cluster or MongoDB Atlas URI)
* API Keys for **TomTom Maps**, **Cloudinary**, and an active **SMTP Mailer** service.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/GoTogether.git
cd GoTogether
```

### 2. Configure Backend Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_super_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Third-Party Services
TOMTOM_API_KEY=your_tomtom_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
```

### 3. Install Dependencies & Run Backend
```bash
cd backend
npm install
npm run dev
```
*(The backend server will spin up on `http://localhost:5000`)*

### 4. Configure & Run Frontend
Open a separate terminal window for the frontend:
```bash
cd frontend
npm install
npm run dev
```
*(The Vite development server will spin up on `http://localhost:5173`)*
