# Online Tutoring Platform Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Technical Implementation](#3-technical-implementation)
4. [Implementation Phases](#4-implementation-phases)
5. [Security Measures](#5-security-measures)
6. [Monitoring and Maintenance](#6-monitoring-and-maintenance)

## 1. Project Overview

### Project Name
[To be decided] - Online Tutoring Platform for Indonesia

### Core Concept
- Online tutoring marketplace
- Video-based learning sessions
- One-on-one tutoring
- All subjects welcome
- Focus on Indonesian market

### Target Market
- Geographic: Indonesia
- Users: Indonesian students and teachers
- Languages: Indonesian (primary), English (secondary)

### Business Model
- Commission: 0.5% per session
- No trial lesson system
- Direct booking system

## 2. Core Features

### A. User Management

#### 1. Student Features
- Registration with:
  - Basic info (name, email, phone)
- Profile management
- Session booking
- Payment handling
- Review submission

#### 2. Teacher Features
- Registration with:
  - Professional info
  - Teaching qualifications
  - ID verification
  - Bank account details
- Profile management
- Availability setting
- Session management
- Earnings tracking

#### 3. Admin Features
- User management
- Content moderation
- Financial oversight
- Support management

### B. Video Session System

#### 1. Technical Requirements
- Minimum bandwidth: 1 Mbps
- Supported browsers: Chrome, Firefox, Safari, Edge
- Mobile support: iOS 12+, Android 8+
- Maximum session duration: 2 hours

#### 2. Features
- High-quality video (720p)
- Audio controls
- Screen sharing
- Virtual whiteboard
- Chat system
- Recording option
- Technical support

### C. Booking System

#### 1. Booking Management
- Teacher availability
- Time slot creation

#### 2. Booking Process
- Date selection
- Time slot picking
- Payment processing
- Confirmation system

#### 3. Session Management
- Reminders
- Cancellation handling
- Rescheduling
- Session notes

### D. Payment System

#### 1. Payment Methods
- Bank Transfer (Virtual Account)
- E-wallets (GoPay, OVO, DANA)
- QRIS
- Credit cards

#### 2. Commission Structure
- No commission

## 3. Technical Implementation

### A. Frontend Stack

#### Core Technologies
- React.js
- Tailwind CSS
- Context API
- React Router
- Axios

#### Key Dependencies
- react-toastify
- date-fns
- react-webcam
- react-calendar

### B. Backend Stack

#### Core Technologies
- Node.js
- Express.js
- MongoDB
- WebRTC
- Socket.io

#### Key Dependencies
- jsonwebtoken
- bcrypt
- multer
- cloudinary

### C. Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  role: String,
  email: String,
  password: String,
  fullName: String,
  phoneNumber: String,
  dateOfBirth: Date,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  isActive: Boolean
}
```

#### Teacher Profiles
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  qualifications: Array,
  subjects: Array,
  hourlyRate: Number,
  availability: Object,
  rating: Number,
  earnings: Number
}
```

#### Sessions
```javascript
{
  _id: ObjectId,
  teacherId: ObjectId,
  studentId: ObjectId,
  date: Date,
  startTime: Date,
  endTime: Date,
  status: String,
  subject: String,
  price: Number,
  commission: Number,
  paymentStatus: String,
  recording: String
}
```

## 4. Implementation Phases

### Phase 1: Foundation (Months 1–2)
- User authentication
- Basic profiles
- Database setup
- API structure

### Phase 2: Core Features (Months 3–4)
- Video integration
- Booking system
- Payment processing
- Basic UI/UX

### Phase 3: Enhancement (Months 5–6)
- Rating system
- Search functionality
- Notifications
- Admin dashboard

### Phase 4: Polish (Months 7–8)
- Performance optimization
- Security hardening
- Testing
- Documentation

### Phase 5: Launch (Months 9–10)
- Beta testing
- Bug fixes
- Marketing
- Official launch

## 5. Security Measures

### Authentication
- JWT tokens
- Password hashing
- Session management
- Rate limiting

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Data encryption

### Payment Security
- Secure payment gateway
- Transaction verification
- Fraud detection
- Data privacy

## 6. Monitoring and Maintenance

### Performance Monitoring
- Server health
- API response times
- Video quality
- User sessions

### Error Tracking
- Error logging
- User feedback
- System alerts
- Performance metrics

### Regular Maintenance
- Security updates
- Database optimization
- Backup procedures
- System updates

## API Design (RESTful Structure)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify
POST   /api/auth/reset-password
```

### User
```
GET    /api/user/me
PUT    /api/user/me
```

### Teacher
```
POST   /api/teacher/profile
GET    /api/teacher/{id}
GET    /api/teachers?subject=math&level=highschool
```

### Booking
```
GET    /api/availability/{teacherId}
POST   /api/booking
PUT    /api/booking/{id}/cancel
PUT    /api/booking/{id}/reschedule
```

### Payments
```
POST   /api/payment/checkout
GET    /api/payment/status/{transactionId}
```

## User Flows

### Student Journey
1. Register & login
2. Browse teachers → View profile
3. Select time slot → Proceed to payment
4. Join live session via browser
5. Leave a review post-session

### Teacher Journey
1. Register & submit qualifications → ID verification
2. Add profile + availability time and date
3. Receive booking → Conduct session
4. Track earnings → Receive weekly payouts

## Additional Database Collections

### Reviews
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  studentId: ObjectId,
  teacherId: ObjectId,
  rating: Number,       // 1 to 5
  comment: String,
  createdAt: Date
}
```

### Notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,         // "booking", "reminder", "payment"
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

## CI/CD Strategy

### Tools
- Source Control: GitHub
- CI/CD: GitHub Actions
- Hosting: Vercel (frontend), Render/DigitalOcean (backend)
- Containerization: Docker

### Sample GitHub Action for Backend Deploy
```yaml
name: Deploy Node Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## Monitoring & Error Tracking

| Purpose             | Tools                                |
|---------------------|--------------------------------------|
| API Monitoring      | Postman Monitors, UptimeRobot        |
| Error Tracking      | Sentry, LogRocket                    |
| Performance         | Grafana + Prometheus                 |
| Logging             | Winston (Node.js) + Papertrail       |
| Backups             | MongoDB Atlas (daily backups)        |

## Payment Gateway Providers (Indonesia)

| Gateway | Features                                    |
|---------|---------------------------------------------|
| Duitku  | Easy setup, e-wallet friendly, affordable for MVP |

Most support automatic disbursement, webhooks, and sandbox testing. 