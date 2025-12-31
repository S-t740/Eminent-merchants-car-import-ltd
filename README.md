# Eminent Merchants Car Importers LTD - Website & Admin Portal

A full-stack vehicle marketplace and admin portal built with React + Vite (frontend) and Node.js + Express (backend).

## Project Structure

```
EMCIL/
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service layer
│   │   ├── context/    # React Context providers
│   │   ├── utils/      # Helper functions
│   │   └── styles/     # Global CSS
│   └── ...
│
└── server/             # Node.js Backend
    ├── config/         # Database & Cloudinary config
    ├── controllers/    # Route controllers
    ├── middleware/     # Auth & upload middleware
    ├── models/         # Sequelize models
    ├── routes/         # API routes
    └── seeders/        # Database seeders
```

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Axios
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Image Storage**: Cloudinary
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Cloudinary account (for image uploads)

### Setup

1. **Clone the repository**

2. **Configure the server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your database and Cloudinary credentials
   ```

3. **Install dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

4. **Setup the database**
   ```bash
   # Create PostgreSQL database named 'emcil_db'
   # The tables will be auto-created on first run
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Server (runs on port 5000)
   cd server
   npm run dev

   # Terminal 2 - Client (runs on port 5173)
   cd client
   npm run dev
   ```

7. **Access the application**
   - Website: http://localhost:5173
   - Admin Portal: http://localhost:5173/admin
   - API: http://localhost:5000/api

### Default Admin Credentials (after seeding)

- Email: admin@emcil.co.ke
- Password: Admin@123

## Features

### Public Website
- Homepage with featured vehicles
- Vehicle inventory with filters and search
- Vehicle detail pages
- Contact form with inquiry submission
- WhatsApp integration
- Responsive design

### Admin Portal
- Dashboard with statistics
- Vehicle CRUD management
- Image upload to Cloudinary
- Offers/Promotions management
- Inquiry management
- Role-based access control

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | - |
| POST | `/api/auth/register` | Register | - |
| GET | `/api/vehicles` | List vehicles | - |
| GET | `/api/vehicles/:id` | Get vehicle | - |
| POST | `/api/vehicles` | Create vehicle | ✓ |
| PUT | `/api/vehicles/:id` | Update vehicle | ✓ |
| DELETE | `/api/vehicles/:id` | Delete vehicle | ✓ Admin |
| POST | `/api/inquiries` | Submit inquiry | - |
| GET | `/api/offers` | List offers | - |

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=emcil_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend (Vercel)
1. Connect your repository
2. Set root directory to `client`
3. Add environment variables

### Backend (Render/Railway)
1. Connect your repository
2. Set root directory to `server`
3. Set start command to `npm start`
4. Add environment variables

## License

ISC
