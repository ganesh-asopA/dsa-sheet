# DSA Sheet — Full Stack MERN Application

A web app for students to track their Data Structures & Algorithms progress.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, CSS Modules |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | AWS EC2 (backend) + AWS S3 (frontend) |

## Project Structure

```
dsa-sheet/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html        # HTML entry point
│   └── src/
│       ├── pages/            # Login, Register, Dashboard, Sheet, NotFound
│       ├── components/       # Navbar, PrivateRoute, Loader
│       ├── services/         # api.js, authService.js, dsaService.js
│       ├── context/          # AuthContext.js (optional pattern)
│       ├── App.js            # Route definitions
│       └── index.js          # React entry point
└── server/                   # Node.js + Express backend
    ├── controllers/          # authController.js, progressController.js
    ├── middleware/           # auth.js (JWT verification)
    ├── models/               # User.js, Progress.js (MongoDB schemas)
    ├── routes/               # auth.js, progress.js, dsa.js
    ├── data/                 # dsaData.js (all DSA problems)
    └── index.js              # Server entry point
```

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/dsa-sheet.git
cd dsa-sheet
```

### 2. Setup the backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and fill in your MongoDB URI and JWT secret
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup the frontend
```bash
cd client
npm install
npm start
# App opens on http://localhost:3000
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user info |
| GET | /api/dsa/topics | Yes | Get all DSA topics + problems |
| GET | /api/progress | Yes | Get user's completed problem IDs |
| POST | /api/progress/toggle | Yes | Mark/unmark a problem as done |

## AWS Deployment

### Backend (EC2)
1. Launch Ubuntu 22.04 EC2 instance (t2.micro — free tier)
2. SSH in and install Node.js v18
3. Clone repo, `cd server`, `npm install`
4. Create `.env` with production values
5. Install PM2: `npm install -g pm2`
6. Run: `pm2 start index.js --name dsa-api && pm2 save`
7. Open port 5000 in EC2 Security Group

### Frontend (S3)
1. In `client/`: `npm run build`
2. Create S3 bucket with static website hosting enabled
3. Upload contents of `/build` folder
4. Set bucket policy for public read
5. (Optional) Add CloudFront for HTTPS + CDN

### Database
Use MongoDB Atlas (free tier) — no need to install MongoDB on EC2.
