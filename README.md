
# MERN Social Media App with .NET AI Integration
  🌐 Render Live Deployment:  https://mern-social-4-ufh7.onrender.com/chat
    
A full-stack social media platform featuring a React frontend, Node.js backend, and a specialized .NET AI service, all containerized with Docker and deployed on AWS EC2.

## 🚀 Architecture Overview
This project uses a microservices-style architecture managed by an Nginx reverse proxy:
* **Frontend:** React (Vite) served via Nginx on Port 80.
* **Backend:** Node.js/Express API handling business logic and Socket.io on Port 5000.
* **AI Service:** .NET 8 Web API for intelligent data processing on Port 5100.
* **Database:** MongoDB Atlas (Cloud).
* **Proxy:** Nginx routing traffic to the correct service and handling large file uploads.



## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Axios, Socket.io-client.
* **Backend:** Node.js, Express, Mongoose, Socket.io.
* **
* **AI Service:** C# / .NET 8.
* **Infrastructure:** Docker, Docker Compose, AWS EC2 , Renderm

## 📋 Prerequisites
* Docker and Docker Compose installed.
* A MongoDB Atlas connection string.
* AWS EC2 instance (Amazon Linux 2023 or Ubuntu).

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/mern-social.git](https://github.com/your-username/mern-social.git)
cd mern-social
