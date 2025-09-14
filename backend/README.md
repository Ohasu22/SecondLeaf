# SecondLeaf Backend API

A comprehensive backend API for SecondLeaf - a sustainable second-hand marketplace platform.

## Features

- **User Authentication**: Registration, login, OTP verification, password reset
- **Product Management**: CRUD operations for products with image uploads
- **Order Management**: Request, accept, reject, and complete orders
- **User Profiles**: Profile management, statistics, and purchase history
- **Rating System**: Rate buyers and sellers after completed transactions
- **Search & Filtering**: Advanced product search with multiple filters
- **Image Upload**: Cloudinary integration for product images
- **Security**: JWT authentication, rate limiting, input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /verify-otp` - Verify OTP for login/registration
- `POST /resend-otp` - Resend OTP
- `GET /me` - Get current user
- `POST /logout` - Logout user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP

### Products (`/api/products`)
- `GET /` - Get all products with filtering
- `GET /categories` - Get product categories
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `POST /` - Create new product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product
- `POST /:id/request` - Request a product
- `GET /user/:userId` - Get products by user

### Orders (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `POST /` - Create order from request
- `PUT /:id/status` - Update order status
- `POST /:id/rate` - Rate an order
- `POST /:id/cancel` - Cancel an order

### Users (`/api/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `GET /:id` - Get user by ID
- `GET /:id/products` - Get user products
- `GET /:id/reviews` - Get user reviews
- `GET /:id/stats` - Get user statistics
- `GET /:id/purchase-history` - Get purchase history
- `DELETE /account` - Deactivate account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SecondLeaf/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/secondleaf

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Database Models

### User
- Personal information (name, email, username, etc.)
- Authentication data (password, OTP, verification status)
- Statistics (seller rating, total sales, CO2 saved)

### Product
- Product details (name, description, price, condition)
- Images and location
- Seller information and status
- CO2 impact calculation

### Order
- Buyer and seller information
- Product details and pricing
- Order status and meeting details
- Ratings and reviews

### OTP
- Email verification and login OTPs
- Expiration and usage tracking

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - Prevent abuse and DDoS attacks
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configured for specific origins
- **Helmet** - Security headers
- **File Upload Security** - Type and size restrictions

## Error Handling

- Global error handler with proper HTTP status codes
- Validation error handling
- Database error handling
- File upload error handling
- JWT error handling

## API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data
  },
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Code Structure
```
backend/
├── config/          # Database and external service configurations
├── middleware/      # Custom middleware (auth, validation, upload)
├── models/          # Mongoose models
├── routes/          # API route handlers
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

