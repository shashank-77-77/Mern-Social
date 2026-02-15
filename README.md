MERN Social Media Platform with .NET AI Microservice
Live Deployment: https://mern-social-4-ufh7.onrender.com/login
Project Overview
This is a production-oriented, full-stack social media platform built using the MERN stack (MongoDB, Express, React, Node.js) with an independent .NET 8 AI microservice. The system follows microservice separation principles, Docker-based containerization, and reverse proxy routing via NGINX.
Architecture Overview
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
Technology Stack
Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Socket.io Client
Backend
- Node.js
- Express.js
- JWT Authentication
- Socket.io
- Cloudinary SDK
AI Service
- .NET 8
- ASP.NET Core Web API
- Swagger (OpenAPI)
- Microservice Architecture
Infrastructure
- NGINX Reverse Proxy
- Docker & Docker Compose
- MongoDB Atlas
- Cloudinary CDN
- Render / AWS EC2 Deployment
Core Features
Authentication & Authorization
- Secure JWT-based login system
- Token verification middleware
- Role-based request validation
- Stateless API architecture
Social Functionality
- Create / edit / delete posts
- Like & comment system
- Follow/unfollow users
- Profile management
- Media upload (Cloudinary integration)
Real-Time Chat
- Socket.io implementation
- Bidirectional event communication
- WebSocket proxying via NGINX
