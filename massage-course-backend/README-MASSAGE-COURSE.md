# Laravel Massage Course Backend API

A comprehensive Laravel-based backend API for a massage therapy online course platform with user management, course enrollment, progress tracking, certificates, and payment processing.

## 🚀 Features

### 📚 Course Management
- **Multi-level Course Structure**: Courses → Modules → Lessons
- **Rich Content Support**: Video lessons, downloadable resources, quiz integration
- **Preview System**: Free preview lessons for non-enrolled users
- **Progress Tracking**: Detailed lesson and course completion tracking
- **Flexible Pricing**: Free and paid courses with Stripe integration

### 👤 User Management
- **Authentication**: JWT-based API authentication with Laravel Sanctum
- **User Profiles**: Extended user profiles with avatars, profession, bio
- **Role-based Access**: Admin and student roles with proper authorization
- **Progress Analytics**: Learning streaks, session time, completion rates

### 🎓 Certificate System
- **Automatic Generation**: PDF certificates generated on course completion
- **Verification System**: Unique verification codes for certificate authenticity
- **Template Engine**: Customizable certificate templates
- **Download & Share**: Secure certificate downloads with verification URLs

### 💳 Payment Processing
- **Stripe Integration**: Secure payment processing with Stripe Payment Intents
- **Payment Tracking**: Complete payment history and status tracking
- **Refund Support**: Automated refund processing
- **Webhook Handling**: Real-time payment status updates

### 📊 Analytics & Reporting
- **Progress Tracking**: Real-time lesson and course progress
- **Learning Analytics**: Session time, completion rates, learning streaks
- **Course Statistics**: Enrollment trends, popular lessons, dropout analysis
- **Admin Dashboard**: Comprehensive analytics for course creators

## 🛠️ Technology Stack

- **Framework**: Laravel 12.x
- **Database**: MySQL/PostgreSQL with comprehensive migrations
- **Authentication**: Laravel Sanctum for API tokens
- **File Storage**: Laravel Storage with organized media management
- **PDF Generation**: DomPDF for certificate generation
- **Payment Processing**: Stripe PHP SDK
- **Image Processing**: Intervention Image for avatar/thumbnail handling
- **Queue System**: Laravel Horizon for background jobs

## 📋 Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Courses
- `GET /api/courses` - List published courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses/{id}/enroll` - Enroll in course
- `GET /api/courses/enrolled` - Get user's enrolled courses

### Lessons
- `GET /api/lessons/{id}` - Get lesson details
- `PUT /api/lessons/{id}/progress` - Update lesson progress
- `POST /api/lessons/{id}/complete` - Mark lesson complete
- `POST /api/lessons/{id}/quiz` - Submit quiz answers

### Progress
- `GET /api/progress` - Get user's overall progress
- `GET /api/progress/analytics` - Get learning analytics
- `GET /api/progress/course/{id}` - Get course-specific progress

### Certificates
- `GET /api/certificates` - Get user's certificates
- `GET /api/certificates/{id}/download` - Download certificate PDF
- `POST /api/certificates/generate/{course}` - Generate certificate

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - Get payment history

## 🚀 Installation & Setup

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Storage Setup**
   ```bash
   php artisan storage:link
   ```

## 📊 Database Schema

The system uses a comprehensive database schema with the following key tables:

- **users** - User accounts with extended profile fields
- **courses** - Course catalog with pricing and metadata
- **modules** - Course sections/chapters
- **lessons** - Individual lesson content with video/resources
- **course_enrollments** - User enrollment tracking
- **user_progress** - Overall course progress per user
- **lesson_progress** - Detailed lesson completion and watch time
- **certificates** - Certificate templates
- **user_certificates** - Generated certificates for users
- **payments** - Payment transaction records

## 🔐 API Authentication

All protected endpoints require Bearer token authentication:

```bash
Authorization: Bearer {your-api-token}
```

## 🎯 Core Models

- **User**: Extended user model with course relationships
- **Course**: Main course entity with modules and pricing
- **Module**: Course sections containing lessons
- **Lesson**: Individual content with video, resources, quizzes
- **Progress Tracking**: Comprehensive progress monitoring
- **Certificate**: Automated certificate generation system
- **Payment**: Stripe-integrated payment processing

## 🛡️ Security Features

- **API Authentication**: Sanctum-based token authentication
- **Authorization Policies**: Fine-grained access control
- **Payment Security**: PCI-compliant Stripe integration
- **Content Protection**: Enrolled-user-only video access
- **Certificate Verification**: Tamper-proof certificate system
- **Input Validation**: Comprehensive request validation

Built with ❤️ for massage therapy education
