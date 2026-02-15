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
AI Microservice (SocialAI)
- Independent service container
- Content moderation capabilities
- Feed recommendation engine
- Sentiment analysis
- Swagger-enabled API documentation
Environment Configuration
Backend (.env)
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mern-social
JWT_SECRET=super_secure_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
AI_SERVICE_URL=http://socialai:5187
Frontend (.env)
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=/
SocialAI (appsettings.json)
{
  "AllowedHosts": "*",
  "Service": {
    "Name": "SocialAI"
  }
}
Running with Docker
Build & Start Services:
docker-compose up --build
Stop Services:
docker-compose down
Running Without Docker
Frontend
cd frontend
npm install
npm run dev
http://localhost:5173
Backend
cd backend
npm install
npm run dev
http://localhost:5000
SocialAI
cd SocialAI
dotnet restore
dotnet run
http://localhost:5187
AWS EC2 Deployment (High-Level)
ssh -i key.pem ec2-user@<EC2_PUBLIC_IP>
sudo yum install docker -y
sudo systemctl start docker
git clone https://github.com/your-username/mern-social.git
cd mern-social
docker-compose up -d --build

Ensure ports 80, 5000, and 5187 are open in the security group.
Common Issues & Resolutions
Blank frontend -> Verify NGINX routing
401 Unauthorized -> Validate JWT token
Upload fails -> Check Cloudinary credentials
AI timeout -> Ensure SocialAI service is running
Socket disconnect -> Verify WebSocket proxy configuration
Security Considerations
- Keep JWT secret private
- Use HTTPS in production
- Protect environment files
- Rotate API keys periodically
- Enable proper CORS policies
