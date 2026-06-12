# 🎬 CineBooking - Premium Movie Booking Application

Welcome to **CineBooking**, a fully functional, highly secure, and beautifully designed full-stack web application. It allows users to seamlessly browse movies, book theater seats dynamically, and manage their reservations, while providing Administrators with an incredibly powerful Analytics Engine and Management Dashboard.

---

## 🌟 Key Features

### 📊 Advanced Analytics Dashboard
The crown jewel of the Admin experience. A high-performance aggregation engine running on the backend that provides real-time insights:
- **Total Revenue**: Calculates earnings from all confirmed bookings.
- **Lost/Refunded Revenue**: Tracks money lost due to cancellations.
- **Average Revenue Per Booking**: Financial breakdown per transaction.
- **Most Popular Theatre**: An intelligent algorithm that crowns the highest-performing theatre.
- **Visual Charts**: Horizontal bar charts for *Revenue by Movie* and pie-chart style breakdowns for *Booking Statuses* (Pending, Confirmed, Cancelled).

### 🔐 Advanced Security & Authentication
- **Two-Step OTP Verification**: Real-time 6-digit Email OTP challenges required for both Registration and Login.
- **Premium HTML Email Alerts**: Beautifully styled, responsive HTML emails sent via Spring Boot Mail to deliver the OTPs.
- **Dynamic Email Masking**: The UI intelligently masks user emails for privacy (e.g., `OTP has been sent to this mail *******123@gmail.com`) when displaying success alerts.
- **Admin 2FA Bypass**: System Admins can log in effortlessly without requiring OTPs for smooth server management.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication securing all private endpoints.
- **BCrypt Password Hashing**: Passwords are mathematically hashed and never stored in plain text.

### 🎥 End-to-End Booking Flow
- **Dynamic Seat Selection Grid**: Interactive UI to visually select and lock seats.
- **Real-Time Validation**: Backend checks prevent double-booking or booking invalid seats.
- **Smart Cancellations**: Users cannot cancel bookings once the show has already started. Available seats dynamically update immediately upon cancellation.

### 🛡️ Secure Admin Panel
- **Role-Based Access Control (RBAC)**: Only authorized Admins can access the dashboard.
- **Intelligent Routing**: Admins logging into the application are automatically redirected straight to the Admin Control Panel.
- **Dynamic Navigation**: The UI adapts to the user's role, hiding irrelevant features (like "My Bookings") for Admin accounts to keep the interface clean.
- **Entity Management**: Easily create and manage Movies, Theaters, and individual Shows.
- **Poster Uploads**: Admins can natively upload movie poster image files via the dashboard, which are securely saved and served by the Spring Boot backend.
- **Booking Oversight**: Admins can instantly see who booked which seat, how many tickets were bought, and confirm or cancel pending transactions.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
- **Framework**: React 18 with Vite (Lightning-fast builds)
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS with a clean, Minimalist Light Theme aesthetic, variables, and responsive Flexbox/Grid. No bloated CSS frameworks.
- **Icons**: Lucide React for sleek SVG icons.
- **State Management**: React Context API (`AuthContext`).

### **Backend (Server)**
- **Framework**: Java 24 & Spring Boot 3
- **Security**: Spring Security 6 & JJWT
- **Database**: PostgreSQL (Relational DB)
- **ORM**: Hibernate & Spring Data JPA
- **Mail Service**: JavaMailSender (Configured for SMTP/Gmail)

---

## 🚀 Setup & Installation Guide

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is installed and running on port `5432`.
Create a new database named `movie_db`:
```sql
CREATE DATABASE movie_db;
```

### 2. Backend Configuration
Navigate to `src/main/resources/application.properties` and verify your credentials:
```properties
# Postgres Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/movie_db
spring.datasource.username=postgres
spring.datasource.password=1234

# Email SMTP (For OTPs)
spring.mail.username=codezurohq@gmail.com
spring.mail.password=your-app-password
```

Run the Spring Boot Application via your IDE or terminal:
```bash
./mvnw spring-boot:run
```

> **Note:** On first startup, the backend `CommandLineRunner` will automatically create the master Admin account!
> - **Username**: `movieadmin`
> - **Password**: `admin123`

### 3. Frontend Configuration
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 📡 API Documentation

### **Authentication (`/api/auth`)**
- `POST /registernormaluser` - Creates user & triggers OTP email.
- `POST /verify-register-otp` - Completes account activation.
- `POST /login` - Verifies password & triggers OTP email.
- `POST /verify-login-otp` - Verifies OTP and returns JWT.

### **Movies (`/api/movies`)**
- `GET /all` - Fetch all available movies.
- `GET /genre/{genre}` - Filter movies by genre.
- `GET /language/{language}` - Filter movies by language.
- `GET /title/{title}` - Search movies by title.
- `POST /admin/movie/create` - (Admin Only) Add a new movie (Supports `multipart/form-data` for poster image uploads).
- `PUT /admin/movie/update/{id}` - (Admin Only) Update movie details and poster image.

### **Theatres (`/api/theatre`)**
- `POST /admin/theatre/create` - (Admin Only) Register a new theatre.
- `GET /location/{location}` - Find theatres by city/location.

### **Shows (`/api/shows`)**
- `GET /all` - Fetch all scheduled shows.
- `GET /movie/{movieId}` - Fetch all shows for a specific movie.
- `POST /admin/show/create` - (Admin Only) Schedule a new show.

### **Booking (`/api/bookings`)**
- `POST /create` - Securely books seats for a specific show.
- `GET /show/{id}` - Fetch all occupied seats for a specific show.
- `GET /user/{userId}` - Fetch booking history for a specific user.
- `PUT /admin/confirm/{bookingId}` - (Admin) Confirm a pending booking.
- `PUT /cancel/{bookingId}` - Cancel a booking (releases seats).

### **Analytics (`/api/admin/analytics`)**
- `GET /` - (Admin Only) Returns the massive aggregated JSON object powering the Analytics Dashboard.

---

## 🎨 Design Philosophy
This application was meticulously crafted with a **Minimalist Light Theme**, utilizing an airy, soft off-white canvas (`#f8f9fa`) with crisp white elevated movie cards. It abandons heavy, dark movie-theater tropes in favor of a modern, highly-legible web app aesthetic (similar to Stripe or Airbnb). Soft diffuse shadows, sharp typography (Outfit font), and a vibrant Electric Blue accent color (`#0066ff`) create an experience that feels incredibly clean, modern, and responsive.
