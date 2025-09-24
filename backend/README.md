# SwapEat Backend - Microservices Architecture

A modern, scalable backend for the SwapEat food sharing platform built with Node.js microservices architecture.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React)       │◄──►│   (Port 3000)   │◄──►│   (Production)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Auth Service │ │ Food Service│ │Chat Service│
        │ (Port 3001)  │ │ (Port 3002) │ │(Port 3003) │
        └──────────────┘ └─────────────┘ └────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ User Service │ │Notification │ │   Redis    │
        │ (Port 3004)  │ │   Service   │ │  (Cache)   │
        └──────────────┘ │ (Port 3005) │ └────────────┘
                         └─────────────┘
                                │
                    ┌───────────▼───────────┐
                    │     Supabase DB      │
                    │   (PostgreSQL)       │
                    └─────────────────────┘
```

## 🚀 Services

### 1. API Gateway (Port 3000)
- **Purpose**: Single entry point for all client requests
- **Features**: 
  - Request routing to appropriate microservices
  - Rate limiting and security
  - Load balancing
  - API documentation
- **Technology**: Express.js with http-proxy-middleware

### 2. Auth Service (Port 3001)
- **Purpose**: User authentication and authorization
- **Features**:
  - User registration and login
  - JWT token management
  - Password hashing
  - Token refresh
- **Endpoints**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh`

### 3. Food Service (Port 3002)
- **Purpose**: Food item management
- **Features**:
  - CRUD operations for food items
  - Location-based filtering
  - Carbon footprint calculation
  - Image upload handling
- **Endpoints**:
  - `GET /api/food` - List food items
  - `GET /api/food/:id` - Get specific food item
  - `POST /api/food` - Create food item
  - `PUT /api/food/:id` - Update food item
  - `DELETE /api/food/:id` - Delete food item

### 4. Chat Service (Port 3003)
- **Purpose**: Real-time messaging
- **Features**:
  - WebSocket connections (Socket.IO)
  - Conversation management
  - Message persistence
  - Typing indicators
- **Endpoints**:
  - `GET /api/chat/conversations`
  - `GET /api/chat/conversations/:id/messages`
  - `POST /api/chat/conversations`
  - `POST /api/chat/conversations/:id/messages`

### 5. User Service (Port 3004)
- **Purpose**: User profile management
- **Features**:
  - Profile CRUD operations
  - User statistics
  - Avatar management
  - Location tracking

### 6. Notification Service (Port 3005)
- **Purpose**: Notification management
- **Features**:
  - Email notifications
  - Push notifications
  - Notification preferences
  - Event-driven notifications

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **File Upload**: Multer + Sharp
- **Validation**: Joi + express-validator
- **Logging**: Winston
- **Rate Limiting**: rate-limiter-flexible
- **Security**: Helmet, CORS
- **Process Management**: PM2 (production)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Redis (optional, for caching)
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
- Create a Supabase project
- Run the database migrations (see database schema)
- Update environment variables

### 4. Development Mode
```bash
# Start all services in development
npm run dev

# Or start individual services
npm run dev:auth
npm run dev:food
npm run dev:chat
npm run dev:user
npm run dev:notification
```

### 5. Production Mode
```bash
# Using Docker Compose
docker-compose up -d

# Or using PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

## 🔧 Configuration

### Environment Variables
```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Services
GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
FOOD_SERVICE_PORT=3002
CHAT_SERVICE_PORT=3003
USER_SERVICE_PORT=3004
NOTIFICATION_SERVICE_PORT=3005

# External Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers
- **Password Hashing**: bcrypt for secure password storage

## 📊 Monitoring & Logging

- **Winston Logging**: Structured logging with multiple transports
- **Health Checks**: Service health monitoring endpoints
- **Error Handling**: Centralized error handling and reporting
- **Request Logging**: Morgan for HTTP request logging

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
npm run test:auth
npm run test:food
npm run test:chat
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale food-service=3
```

### Manual Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Start services with PM2
pm2 start ecosystem.config.js

# Monitor services
pm2 monit
```

## 📈 Scaling Considerations

1. **Horizontal Scaling**: Each service can be scaled independently
2. **Load Balancing**: Use nginx or cloud load balancers
3. **Database Optimization**: Connection pooling and read replicas
4. **Caching**: Redis for session management and data caching
5. **CDN**: For static assets and image delivery

## 🔄 API Documentation

Access the API documentation at:
- Development: `http://localhost:3000/api/docs`
- Production: `https://your-domain.com/api/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.