# SwapEat Platform - Microservices Architecture

A modern, scalable food sharing platform built with microservices architecture, featuring a React frontend and Node.js backend services.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SwapEat Platform                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)           │  Backend (Microservices)      │
│  ├── React 18 + TypeScript  │  ├── API Gateway (Port 3000)  │
│  ├── Tailwind CSS          │  ├── Auth Service (Port 3001) │
│  ├── Radix UI Components   │  ├── Food Service (Port 3002) │
│  ├── React Query           │  ├── Chat Service (Port 3003) │
│  ├── Socket.IO Client      │  ├── User Service (Port 3004) │
│  └── Leaflet Maps          │  └── Notification (Port 3005) │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Supabase DB     │
                    │  (PostgreSQL)     │
                    └───────────────────┘
```

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Responsive design with Tailwind CSS and Radix UI
- **Real-time Chat**: Socket.IO integration for live messaging
- **Interactive Maps**: Location-based food sharing with Leaflet.js
- **Food Management**: Create, edit, and manage food listings
- **User Profiles**: Comprehensive user profile management
- **Carbon Tracking**: Environmental impact tracking
- **Mobile Responsive**: Optimized for all device sizes

### Backend Features
- **Microservices Architecture**: Scalable, maintainable service separation
- **API Gateway**: Centralized routing and security
- **JWT Authentication**: Secure user authentication and authorization
- **Real-time Messaging**: WebSocket support for instant communication
- **File Upload**: Image handling for food items
- **Rate Limiting**: Protection against abuse
- **Comprehensive Logging**: Winston-based logging system
- **Health Monitoring**: Service health checks and monitoring

## 📁 Project Structure

```
swapeat-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Node.js microservices
│   ├── gateway/            # API Gateway service
│   ├── services/           # Individual microservices
│   │   ├── auth/          # Authentication service
│   │   ├── food/          # Food management service
│   │   ├── chat/          # Real-time chat service
│   │   ├── user/          # User management service
│   │   └── notification/  # Notification service
│   ├── shared/            # Shared utilities and middleware
│   │   ├── middleware/    # Common middleware
│   │   ├── utils/         # Utility functions
│   │   └── types/         # Shared type definitions
│   ├── config/            # Configuration files
│   └── package.json       # Backend dependencies
│
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for component primitives
- **React Query** for state management
- **Socket.IO Client** for real-time features
- **Leaflet.js** for interactive maps
- **React Hook Form** + **Zod** for form handling

### Backend
- **Node.js 18+** runtime
- **Express.js** web framework
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Supabase** (PostgreSQL) for database
- **Redis** for caching (optional)
- **Winston** for logging
- **Joi** + **express-validator** for validation
- **Multer** + **Sharp** for file handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Redis (optional, for caching)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd swapeat-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

## 🐳 Docker Deployment

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Backend Environment Variables
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
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_SERVICE_URL=http://localhost:3003
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### Food Management Endpoints
- `GET /api/food` - List food items
- `GET /api/food/:id` - Get food item details
- `POST /api/food` - Create food item
- `PUT /api/food/:id` - Update food item
- `DELETE /api/food/:id` - Delete food item

### Chat Endpoints
- `GET /api/chat/conversations` - List conversations
- `GET /api/chat/conversations/:id/messages` - Get messages
- `POST /api/chat/conversations` - Create conversation
- `POST /api/chat/conversations/:id/messages` - Send message

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DDoS
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers
- **Password Hashing**: bcrypt for secure password storage

## 📈 Monitoring & Logging

- **Health Checks**: Service health monitoring endpoints
- **Structured Logging**: Winston-based logging with multiple transports
- **Error Tracking**: Centralized error handling and reporting
- **Performance Monitoring**: Request/response time tracking

## 🚀 Deployment Options

### Cloud Platforms
- **AWS**: ECS, Lambda, or EC2
- **Google Cloud**: Cloud Run, GKE, or Compute Engine
- **Azure**: Container Instances, AKS, or App Service
- **DigitalOcean**: App Platform or Droplets

### Container Orchestration
- **Docker Compose**: Simple multi-container deployment
- **Kubernetes**: Production-grade orchestration
- **Docker Swarm**: Docker-native clustering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation at `/api/docs`

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered food recommendations
- [ ] Integration with grocery stores
- [ ] Blockchain-based reward system
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Social media integration

---

Built with ❤️ for sustainable food sharing and community building.