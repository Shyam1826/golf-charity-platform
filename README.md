# Golf Charity Subscription Platform

This is a complete premium Full-Stack application featuring React (Vite+Tailwind), Node.js (Express), and Supabase (PostgreSQL).
Live Demo: https://golf-charity-platform-olive.vercel.app

## Features Implemented
- **JWT Authentication** (Login/Register, Passwords hashed via bcrypt)
- **Charity Selection** (Minimum 10% pledge via Slider)
- **Subscriptions** (Mock payment status checks, enforcing active statuses)
- **Score System** (Max 5 latest scores dynamically handled backend-side)
- **Draw Algorithm** (Matches 1-45 generated arrays with player thresholds and jackpot rollovers)
- **Premium UI** (Tailwind gradients, responsive widgets, blur FX).

## 🛠️ Setup Instructions

### 1. Database (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Create a new Database/Project.
3. Open the **SQL Editor**, paste the contents of `setup.sql` located in this folder, and run it. (This will also place 3 seed charities into the system).
4. Get your `Project URL` and `Service Role Key` from the **Settings > API** section.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Open `backend/.env` and fill in your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=some_very_secret_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000*

### 3. Frontend Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   *The Vite app will likely mount on http://localhost:5173*

## Test Flow
1. **Register** a new user account. Select a charity and allocate a percentage.
2. Visit the **Dashboard**. You won't be able to submit scores until you click to "Subscribe" (Simulates checkout).
3. **Submit Scores** (between 1 and 45). Submit up to 6 to see the oldest drop off.
4. **Admin Test**: You can change your user role to `'admin'` manually directly in the Supabase Table Editor. Once you log in again, you will be redirected to the **Admin Dashboard**.
5. Logged in as Admin, hit **Run Monthly Draw**. The system will output matching prize winners and update a jackpot rollover.
