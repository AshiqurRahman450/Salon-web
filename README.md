# Aura Salon - Web & Mobile Frontend

This repository contains both the web frontend (React + Vite) and the mobile application (React Native + Expo) for the Aura Salon management application. It provides dashboards for Super Admins and Salon Owners on the web, and a customer booking interface on the mobile app.

## Setup Instructions

1. **Install Dependencies**
   Navigate to the `web` folder and run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Currently, the application relies on hardcoded API URLs or falls back to a hosted backend. If you need to point this to your local backend, you can update the API URLs in the respective components (or add a `.env` file and configure Vite proxy/env variables).

3. **Run the Web Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port specified by Vite).

## Mobile App Setup Instructions

1. **Install Dependencies**
   Navigate to the `mobile2` folder and run:
   ```bash
   npm install
   ```

2. **Run the Expo Development Server**
   ```bash
   npm start
   ```
   - This will start the Metro bundler.
   - You can scan the QR code using the **Expo Go** app on your physical iOS or Android device.
   - Alternatively, press `a` to run on an Android emulator, or `i` to run on an iOS simulator.

3. **Backend Connection**
   The mobile app communicates with the same backend. By default, it connects to a hosted backend on Render. If running the backend locally, you may need to update the `API_URL` to your machine's local IP address (e.g., `192.168.1.5:5000`) within the screens.

## Demo Credentials

You can use the following demo credentials to log in and explore the application.

- **Super Admin**
  - Email: `admin@aura.com`
  - Password: `admin123`

- **Salon Owner** (Sample)
  - Email: `owner0@aura.com` (or `owner1@aura.com` ... up to `owner9@aura.com`)
  - Password: `password123`

- **Customer** (for mobile app testing)
  - You can register a new customer via the mobile app, or seed the database and use any randomly generated customer email with the password `password123`.

## Key Technical Decisions

- **React & Vite**: Chosen for fast development, hot module replacement, and modern build tooling.
- **Tailwind CSS**: Used for rapid UI styling, ensuring a consistent and responsive design system without maintaining complex custom CSS files.
- **Oxlint**: Integrated for fast and strict linting to maintain code quality.
- **RESTful API Integration**: Uses standard `fetch` or `axios` to communicate with the Node.js/Express backend.
- **Role-Based Dashboards**: The web app is structured to provide different views based on the authenticated user's role (`admin` vs `salon_owner`).

## API Documentation Overview

The application communicates with a Node.js backend. Here are the key API routes used:

### Auth (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT
- `GET /api/auth/me` - Get current authenticated user details

### Salons (`/api/salons`)
- `GET /api/salons` - Get a list of all salons
- `GET /api/salons/:id` - Get details for a specific salon
- `POST /api/salons` - Create a new salon (Owner)
- `GET /api/salons/:salonId/services` - Get services for a specific salon
- `GET /api/salons/:salonId/staff` - Get staff for a specific salon

### Services (`/api/services`)
- `GET /api/services` - Get all services
- `POST /api/services` - Create a service (Owner)
- `GET /api/services/:id` - Get a specific service by ID

### Staff (`/api/staff`)
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get a specific staff member

### Appointments (`/api/appointments`)
- `GET /api/appointments` - Get appointments for the authenticated user
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id/status` - Update appointment status (Owner)
- `PUT /api/appointments/:id/cancel` - Cancel an appointment

### Admin (`/api/admin`)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/services` - Get all services across platform
- `GET /api/admin/staff` - Get all staff across platform
- `GET /api/admin/reviews` - Get all reviews
