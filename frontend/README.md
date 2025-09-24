# SwapEat Frontend

A modern, responsive React application for the SwapEat food sharing platform.

## 🚀 Features

- **Modern UI**: Built with React 18 and TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Radix UI components with custom styling
- **State Management**: React Query for server state management
- **Real-time Chat**: Socket.IO integration for live messaging
- **Interactive Maps**: Leaflet.js for location-based features
- **Form Handling**: React Hook Form with Zod validation
- **Theme Support**: Light/dark mode with next-themes
- **Performance**: Code splitting and lazy loading

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet.js
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_CHAT_SERVICE_URL=http://localhost:3003

# Supabase (if needed for direct client access)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Map Configuration
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Radix UI)
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and utilities
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── contexts/           # React contexts
│   └── styles/             # Global styles
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🎨 UI Components

The application uses a custom design system built on top of Radix UI:

- **Buttons**: Various styles and sizes
- **Forms**: Input fields, selects, textareas
- **Modals**: Dialogs and overlays
- **Navigation**: Responsive navigation components
- **Cards**: Content containers
- **Tables**: Data display
- **Notifications**: Toast messages

## 🔌 API Integration

The frontend communicates with the backend through:

- **REST API**: Standard HTTP requests for CRUD operations
- **WebSocket**: Real-time chat functionality
- **React Query**: Caching and synchronization

### API Service Example

```typescript
import { apiService } from '../services/api';

// Get food items
const { data, isLoading, error } = useFoodItems({
  page: 1,
  limit: 20,
  category: 'vegetables'
});

// Create food item
const createMutation = useCreateFoodItem();
createMutation.mutate(foodData);
```

## 🗺️ Maps Integration

Interactive maps using Leaflet.js:

- **Location Selection**: Pick locations for food items
- **Nearby Items**: View food items on map
- **Directions**: Get directions to food locations
- **Clustering**: Group nearby markers

## 💬 Real-time Chat

Socket.IO integration for live messaging:

```typescript
import { socketService } from '../services/socket';

// Connect to chat
socketService.connect(authToken);

// Join conversation
socketService.joinConversation(conversationId);

// Send message
socketService.sendMessage(conversationId, message);

// Listen for messages
socketService.onNewMessage((message) => {
  // Handle new message
});
```

## 📱 Responsive Design

Mobile-first responsive design with Tailwind CSS:

- **Breakpoints**: sm, md, lg, xl, 2xl
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch-friendly**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## 🎯 Performance Optimization

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Images and components
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Vite's built-in optimizations
- **Tree Shaking**: Remove unused code

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## 🚀 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build for development (with source maps)
npm run build:dev
```

### Deployment Options

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: CloudFront, CloudFlare
3. **Docker**: Containerized deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Security

- **Environment Variables**: Secure configuration management
- **API Authentication**: JWT token handling
- **Input Validation**: Client-side validation with Zod
- **XSS Protection**: Sanitized user inputs
- **HTTPS**: Secure communication in production

## 🎨 Theming

Custom theme system with CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

## 📊 State Management

React Query for server state:

```typescript
// Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## 🔄 Development Workflow

1. **Feature Development**: Create feature branches
2. **Code Review**: Pull request reviews
3. **Testing**: Automated testing pipeline
4. **Deployment**: Automated deployment on merge

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.