# Swap-Bite-Find: Food Waste Reduction Platform

Swap-Bite-Find is a web application designed to combat food waste by connecting users with surplus food to those in need. It allows users to share and find food items, track their impact, and engage with a community dedicated to sustainability.

## Features

- **Food Sharing:** Users can list surplus food items, including details like category, quantity, and expiry date.
- **Interactive Map:** A map interface displays available food items, making it easy for users to find food nearby.
- **Real-time Requests:** Users can request food items and manage incoming and outgoing requests in real-time.
- **User Profiles:** Profiles showcase user activity, including items shared, requests made, and carbon footprint reduction.
- **Gamification:** A leaderboard encourages friendly competition by ranking users based on their contributions.
- **Notifications:** Users receive timely notifications about requests, messages, and expiring food items.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** Shadcn-UI, Tailwind CSS
- **Backend:** Supabase (for database, authentication, and real-time features)
- **Mapping:** Leaflet, Mapbox
- **State Management:** React Query
- **Form Handling:** React Hook Form, Zod

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or a compatible package manager)
- A Supabase account and project

### Installation

1. **Clone the repo:**
   ```sh
   git clone https://github.com/Piyush105454/swap-bite-find.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd swap-bite-find
   ```
3. **Install NPM packages:**
   ```sh
   npm install
   ```
4. **Set up your environment variables:**
   - Create a `.env.local` file in the root of the project.
   - Add your Supabase project URL and anon key:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

5. **Start the development server:**
   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:5173`.
