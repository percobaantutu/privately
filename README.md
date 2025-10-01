# Privately - Fullstack Online Tutoring Platform

<img width="289" height="584" alt="iPhone-12-PRO-www privately my id (3)" src="https://github.com/user-attachments/assets/21ac6488-4ef9-4ce8-af76-f9b24a00d38d" />
<img width="411" height="631" alt="Galaxy-Tab-S7-www privately my id" src="https://github.com/user-attachments/assets/0ca28af7-209e-41a1-952c-4239e2a0fbf3" />
<img width="269" height="572" alt="Xiaomi-Mi-11i-www privately my id (1)" src="https://github.com/user-attachments/assets/e7fae8db-668d-4693-bf88-cad1fbab4161" />
<img width="411" height="631" alt="Galaxy-Tab-S7-www privately my id (1)" src="https://github.com/user-attachments/assets/13ae02e0-a507-4925-8618-b1de34fcb4a0" />
<img width="289" height="584" alt="iPhone-12-PRO-www privately my id (4)" src="https://github.com/user-attachments/assets/c18ad526-d7b5-4323-bf0f-8790aabc8460" />
<img width="289" height="584" alt="iPhone-12-PRO-www privately my id (5)" src="https://github.com/user-attachments/assets/d13111a4-32ea-4a38-a412-ff0ab06a29be" />
<img width="289" height="584" alt="iPhone-12-PRO-www privately my id (6)" src="https://github.com/user-attachments/assets/10d4b691-33da-4570-ab3a-2e53df9a746d" />
<img width="289" height="584" alt="iPhone-12-PRO-www privately my id (7)" src="https://github.com/user-attachments/assets/cfa2496c-b67c-465a-9d95-7fa0117ae245" />


Privately is a feature-rich, fullstack web application designed to connect students with professional teachers for one-on-one online tutoring sessions. The platform provides a seamless experience for three distinct user roles: students seeking knowledge, teachers sharing their expertise, and administrators managing the platform's integrity and operations.

This project is built with a modern technology stack and demonstrates a complete end-to-end development cycle, from user authentication and real-time communication to payment processing and administrative oversight.

---

## 🚀 Live Demo

*   **Frontend (Student & Teacher Portal):https://www.privately.my.id
*   **Admin Panel:** `[Link to your Admin Panel Deployment on Vercel]`

> **Admin Panel Credentials:**
> *   **Email:** `(Your admin email from .env)`
> *   **Password:** `(Your admin password from .env)`

---

## ✨ Key Features

### General Features
*   **Role-Based Authentication:** Secure JWT-based authentication for Students, Teachers, and a separate Admin.
*   **Google OAuth 2.0:** Allow users to sign up and log in seamlessly with their Google accounts.
*   **Real-time Chat:** A fully functional, real-time messaging system built with Socket.IO, allowing students and teachers to communicate directly.
*   **Notifications:** Real-time, in-app notifications for key events (e.g., new bookings, session confirmations, new messages).
*   **Secure Payment Integration:** Integrated with Midtrans for secure and reliable payment processing for booking sessions.
*   **Multi-Language Support (i18n):** The entire user interface can be switched between English and Bahasa Indonesia.
*   **Transactional Emails:** Automated emails (powered by the Brevo API) for welcoming new users, booking confirmations, password resets, and payout notifications.

### Student Features
*   **Teacher Discovery:** Search, filter (by speciality, price, rating), and sort to find the perfect teacher.
*   **Dynamic Booking System:** View a teacher's real-time availability on a weekly calendar and book an available slot.
*   **Session Management:** View upcoming and past sessions in a personal dashboard.
*   **Review System:** Leave ratings and comments for completed sessions to help the community.
*   **Dispute Resolution:** File a dispute for a session if an issue arises, which is then reviewed by an admin.

### Teacher Features
*   **Dedicated Teacher Dashboard:** A separate, secure dashboard to manage all professional activities.
*   **Profile Management:** Teachers can update their personal and professional details, including their bio, experience, and bank information for payouts.
*   **Availability Management:** An intuitive weekly calendar interface to set and update available tutoring hours.
*   **Session Management:** View and manage all booking requests, confirm pending sessions, and mark sessions as complete.
*   **Earnings Dashboard:** Track lifetime earnings, current pending balance, and see a history of completed sessions and their corresponding earnings.

### Admin Features
*   **Secure Admin Panel:** A separate frontend application for platform administration.
*   **Dashboard Summary:** An overview of key platform metrics, including active teachers, pending verifications, open disputes, and pending payouts.
*   **Teacher Management:** View all teachers, manually add new pre-verified teachers, and toggle a teacher's active status on the platform.
*   **Verification System:** Review and approve new teacher registrations to maintain platform quality.
*   **Dispute Management:** A dedicated interface to review and resolve disputes filed by users.
*   **Payout Processing:** View all teachers eligible for a payout and process their earnings in a batch.

---

## 🛠️ Tech Stack

### Frontend & Admin Panel
*   **Framework:** React 19 (with Vite)
*   **Styling:** Tailwind CSS with Shadcn UI components
*   **Animations:** Framer Motion
*   **State Management:** React Context API
*   **Routing:** React Router
*   **API Communication:** Axios
*   **Real-time:** Socket.IO Client
*   **Internationalization:** i18next

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JWT (JSON Web Tokens), Passport.js (for Google OAuth), bcrypt (for hashing)
*   **Real-time:** Socket.IO
*   **File Storage:** Cloudinary for image uploads
*   **Payments:** Midtrans API
*   **Emails:** Brevo API (formerly Sendinblue)

### Deployment
*   **Frontend & Admin:** Vercel
*   **Backend:** Railway

---

## 📂 Project Structure

This project is a monorepo containing three distinct parts:

```
/
├── admin/      # React app for the Admin Panel
├── backend/    # Node.js/Express.js server and API
└── frontend/   # React app for the main website (Students & Teachers)
```

---

## 🏁 Getting Started

To run this project locally, you will need to set up each part of the application.

### Prerequisites
*   Node.js (v18 or later recommended)
*   npm or yarn
*   MongoDB (a local instance or a free cloud account from MongoDB Atlas)
*   API keys for Google OAuth, Cloudinary, Midtrans, and Brevo.

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the /backend directory and add the environment variables
#    (see .env.example section below)

# 4. Start the server
npm run server
```

### 2. Frontend Setup

```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create a .env file in the /frontend directory and add the environment variables
#    (see .env.example section below)

# 4. Start the development server
npm run dev
```

### 3. Admin Panel Setup

```bash
# 1. Open a new terminal and navigate to the admin directory
cd admin

# 2. Install dependencies
npm install

# 3. Create a .env file in the /admin directory and add the environment variables
#    (see .env.example section below)

# 4. Start the development server
npm run dev
```

---

## 🔑 Environment Variables Example

You will need to create three `.env` files for the project to run.

#### `backend/.env`
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Brevo (Email)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=contact@yourdomain.com

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

#### `frontend/.env`
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_from_backend_env
```

#### `admin/.env`
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
