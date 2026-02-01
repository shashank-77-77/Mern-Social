MERN Social Media Platform with .NET AI Service

A production-oriented, full-stack social media platform built with React (Vite),
Node.js / Express, and a dedicated .NET 8 AI microservice, designed using service
separation, containerization, and cloud-ready deployment patterns.

======================================================================
ARCHITECTURE OVERVIEW
======================================================================

Client (Browser)
      |
      v
NGINX Reverse Proxy (Port 80)
      |
      |-- /        -> React Frontend (Vite)
      |-- /api     -> Node.js Backend (Express + Socket.io) :5000
      |-- /ai      -> SocialAI Service (.NET 8 Web API)     :5187
                          |
                          v
                   MongoDB Atlas (Cloud)

======================================================================
SERVICES
======================================================================

FRONTEND (React + Vite)
- Stateless Single Page Application
- Tailwind CSS UI
- Axios for HTTP requests
- Socket.io client for real-time chat
- Dev Port: 5173
- Prod Port: 80 (via NGINX)

BACKEND (Node.js / Express)
- Authentication & Authorization (JWT)
- Posts, likes, comments, follows
- Real-time chat with Socket.io
- Media metadata handling
- Port: 5000

SOCIALAI SERVICE (.NET 8)
- ASP.NET Core Web API
- Independent AI microservice
- Designed for recommendations & content analysis
- Swagger enabled
- Port: 5187

DATABASE (MongoDB Atlas)
- Fully managed cloud database
- No local MongoDB container
- Accessed via MongoDB connection string

MEDIA STORAGE (Cloudinary)
- Image & video hosting
- CDN optimized delivery
- Used for profile pictures, posts, reels

======================================================================
AUTHENTICATION & API TOOLS
======================================================================

JWT (JSON Web Tokens)
- Stateless authentication
- Tokens issued by backend
- Verified on each request
- Debug tokens at: https://jwt.io

POSTMAN
- API testing
- Auth flow validation
- Header & payload debugging

SWAGGER
- Available for SocialAI Service
- URL: http://localhost:5187/swagger

======================================================================
ENVIRONMENT CONFIGURATION
======================================================================

backend/.env

PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mern-social
JWT_SECRET=super_secure_secret

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

AI_SERVICE_URL=http://socialai:5187


frontend/.env

VITE_API_BASE_URL=/api
VITE_SOCKET_URL=/


SocialAI/appsettings.json

{
  "AllowedHosts": "*",
  "Service": {
    "Name": "SocialAI"
  }
}

======================================================================
RUNNING WITH DOCKER (RECOMMENDED)
======================================================================

From project root:

docker-compose up --build

Stop services:

docker-compose down

Access:
Frontend  -> http://localhost
Backend   -> http://localhost/api
SocialAI  -> http://localhost/ai/swagger

======================================================================
RUNNING WITHOUT DOCKER
======================================================================

Frontend:
cd frontend
npm install
npm run dev
http://localhost:5173

Backend:
cd backend
npm install
npm run dev
http://localhost:5000

SocialAI:
cd SocialAI
dotnet restore
dotnet run
http://localhost:5187

======================================================================
AWS EC2 DEPLOYMENT (HIGH LEVEL)
======================================================================

ssh -i key.pem ec2-user@<EC2_PUBLIC_IP>
sudo yum install docker -y
sudo systemctl start docker
git clone https://github.com/your-username/mern-social.git
cd mern-social
docker-compose up -d --build

Ensure ports 80, 5000, and 5187 are open.

======================================================================
COMMON ISSUES
======================================================================

Blank frontend       -> Check NGINX routing
401 Unauthorized     -> Verify JWT token
Upload fails         -> Check Cloudinary credentials
AI timeout           -> Ensure SocialAI service is running
Socket disconnect    -> Verify WebSocket proxying

======================================================================
SUMMARY
======================================================================

- Clean microservice separation
- JWT-based authentication
- Cloudinary media offloading
- Real-time chat with Socket.io
- AI extensibility via .NET 8
- Dockerized, cloud-ready deployment

======================================================================
