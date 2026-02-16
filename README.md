🚀 MERN SOCIAL
Enterprise-Grade Social Media Platform with AI Microservice (.NET 8)










A cloud-ready, microservice-driven full-stack social networking platform built using React, Node.js, MongoDB, Socket.io, Docker, and ASP.NET Core AI services.

Designed following real production architecture patterns used in modern SaaS systems.

🌐 LIVE APPLICATION
🔗 Production Deployment
https://mern-social-4-ufh7.onrender.com/login

📌 EXECUTIVE SUMMARY

This platform simulates a real-world scalable social media backend ecosystem featuring:

Stateless frontend SPA

JWT-secured API layer

Real-time messaging engine

CDN-based media handling

Dedicated AI microservice

Reverse-proxy routing

Docker multi-container deployment

The system architecture mirrors modern microservice SaaS deployments.

🏗️ HIGH-LEVEL ARCHITECTURE
User Browser
    |
    v
NGINX Reverse Proxy
    |
    |---- React Frontend
    |---- Node.js REST API + WebSocket
    |---- ASP.NET AI Service + Admin Panel
                     |
                     v
               MongoDB Atlas Cloud

🧩 TECH STACK (PRODUCTION-LEVEL)
🎨 Frontend Layer

React + Vite (high-performance SPA)

Tailwind CSS

Axios API client

Socket.io realtime connection

⚙️ Backend API Layer

Node.js + Express.js

JWT authentication

RESTful service design

WebSocket chat server

Modular controllers/services

🤖 AI MICROSERVICE (ENTERPRISE SEPARATION)

Implemented as independent service:

ASP.NET Core 8 Web API

Swagger documentation

Recommendation-ready architecture

Content analysis ready pipeline

Future ML integration support

🔐 ADMIN DASHBOARD (ASP.NET SERVER RENDERED)

Includes secure operational interface:

User moderation panel

Post removal tools

AI usage monitoring

System health metrics

Secure cookie-based login

Accessible via:

/admin

🗄️ DATA STORAGE

MongoDB Atlas cloud database:

User profiles

Posts

Comments

Chat messages

Follow relationships

☁️ MEDIA DELIVERY

Cloudinary CDN integration:

Image uploads

Video hosting

Automatic compression

Global CDN delivery

✨ CORE PRODUCT FEATURES
👤 Authentication System

Secure JWT login

Password hashing

Protected routes middleware

📝 Social Posting Engine

Upload media posts

Caption support

Like system

Comment system

Delete posts

💬 Real-Time Chat Engine

Powered by Socket.io:

Instant messaging

Persistent connection

Low latency delivery

👥 Social Networking

Follow users

Profile browsing

Personalized feed

🤖 AI-READY EXTENSIBILITY

The platform integrates a dedicated AI service designed for:

Smart recommendations

Caption generation

Toxicity detection

Feed ranking models

📁 PROJECT STRUCTURE
mern-social/
│
├── frontend/           React SPA
├── backend/            Node API + Socket server
├── SocialAI/           ASP.NET AI + Admin panel
├── nginx/              Reverse proxy configs
├── docker-compose.yml

🔧 ENVIRONMENT SETUP
Backend .env
PORT=5000
MONGO_URI=YOUR_MONGO_URL
JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=XXX
CLOUDINARY_API_KEY=XXX
CLOUDINARY_API_SECRET=XXX

AI_SERVICE_URL=http://socialai:5187

Frontend .env
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=/

🐳 DOCKER DEPLOYMENT (RECOMMENDED)

Run entire platform:

docker-compose up --build


Stop:

docker-compose down

Access Points
Frontend → http://localhost
API → http://localhost/api
AI Swagger → http://localhost/ai/swagger
Admin → http://localhost/admin

🖥️ LOCAL DEVELOPMENT (WITHOUT DOCKER)
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm run dev

AI Service
cd SocialAI
dotnet restore
dotnet run

☁️ AWS EC2 DEPLOYMENT (REAL-WORLD FLOW)
ssh -i key.pem ec2-user@IP
sudo yum install docker -y
sudo systemctl start docker
git clone YOUR_REPO
cd mern-social
docker-compose up -d --build


Open ports:

80
5000
5187

🧪 TESTING & DEBUGGING TOOLS
Swagger
http://localhost:5187/swagger

JWT Debugger
https://jwt.io

Postman Collection

Used for:

Endpoint validation

Auth testing

Payload debugging

🐞 TROUBLESHOOTING MATRIX
Issue	Root Cause	Resolution
Frontend blank	Proxy routing issue	Verify nginx.conf
Login fails	JWT mismatch	Check secret key
Upload error	Cloudinary config	Validate credentials
Chat disconnect	WebSocket blocked	Check proxy headers
AI timeout	Service down	Restart SocialAI
🎯 ENGINEERING VALUE OF THIS PROJECT

This repository demonstrates:

✔ Microservice architecture separation
✔ Real-time WebSocket scaling model
✔ Secure stateless authentication
✔ CDN-offloaded media pipeline
✔ Reverse proxy infrastructure
✔ Containerized deployment design
✔ Cloud production readiness

👨‍💻 AUTHOR

Shashank Mankar

Full Stack Developer
MERN | Node | React | MongoDB | ASP.NET | Docker

⭐ SUPPORT

If this project helped you:

⭐ Star the repository
🍴 Fork for experimentation
🛠️ Contribute improvements