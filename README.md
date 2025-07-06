# 🚖 Go-Cab: Cab Booking System

> Go-Cab is a modern, scalable **cab booking platform** built with the **MERN stack** and powered by a **microservices architecture**. Designed for real-time communication and dynamic pricing, it brings together powerful technologies for an efficient transportation solution.

The backend is split into independent services (User, Ride, Captain, Payment, Pricing, Maps) and deployed on Render. All services are coordinated using RabbitMQ and exposed through a unified API Gateway.

<br><br>

## ✨ Features

- ⚙️ **Microservices Architecture** – Independent services for modular scalability  
- ⚛️ **React Frontend** – Intuitive, responsive UI  
- 🧠 **Node.js + Express Backend** – RESTful API services  
- 🌐 **API Gateway** – Centralized request handling and routing  
- 📍 **Google Maps API** – Geolocation & directions  
- 🔄 **Real-time Updates** – With Socket.IO (user ↔ driver)  
- 📊 **XGBoost ML Model** – Smart Dynamic Pricing  
- 💳 **Razorpay Integration** – Secure online payments  
- 🐇 **RabbitMQ** – Asynchronous service communication  
- ☁️ **MongoDB Atlas** – Cloud NoSQL DB  
- 🐳 **Docker & Docker Compose** – Seamless container orchestration  
- 🚀 **Live Deployed** – Hosted with Render  

<br><br>

## 🚀 Live Demo

🖥 **Try the App Live**  
👉 [Go-Cab Booking Website](https://microservice-frontend-mvtz.onrender.com)


👉 [ Images ](https://drive.google.com/drive/folders/14VhwJ8mn8mh-XTLUUb6p995jpR9c8v4R?usp=drive_link)

> Hosted on Render | Fully functional booking system


<br><br>

## 🧪 Live Microservices - Test URLs

| Service | URL |
|---------|-----|
| 🌐 **Gateway** | [https://microservice-gateway-jubk.onrender.com](https://microservice-gateway-jubk.onrender.com) |
| 👤 **User** | [https://microservice-user-gaxg.onrender.com](https://microservice-user-gaxg.onrender.com) |
| 🧍 **Captain** | [https://microservice-captain.onrender.com](https://microservice-captain.onrender.com) |
| 🚕 **Ride** | [https://microservice-ride.onrender.com](https://microservice-ride.onrender.com) |
| 🗺️ **Maps** | [https://microservice-maps.onrender.com](https://microservice-maps.onrender.com) |
| 💰 **Payment** | [https://microservice-payment-tohz.onrender.com](https://microservice-payment-tohz.onrender.com) |
| 📈 **Dynamic Pricing** | [https://microservice-dynamic-price.onrender.com](https://microservice-dynamic-price.onrender.com) |

<br><br>

## 🏗️ Project Architecture

```
go-cab/
├── Backend/                
│   ├── captain/            
│   ├── Dynamic_Price/      
│   ├── gateway/            
│   ├── maps/               
│   ├── Payment/            
│   ├── ride/               
│   └── user/               
│
├── frontend/               
│
├── .env                    
├── docker-compose.yml      
└── README.md               
```

<br><br>

## 🧩 Architecture Diagram

![Go-Cab Architecture](https://www.mermaidchart.com/raw/2fcb95c6-f6de-47f7-8ae1-0ec976700b7f?theme=light&version=v0.1&format=svg)

<br><br>

## ⚙️ Installation & Setup

Follow these steps to install and run the **Go-Cab: Cab Booking System** locally using Docker Compose.

<br>

### 🧰 Prerequisites

- [Node.js](https://nodejs.org/) 
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Free accounts on:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - [CloudAMQP (RabbitMQ)](https://www.cloudamqp.com/)
  - [Google Cloud Console (Maps API)](https://console.cloud.google.com/)
  - [Twilio](https://www.twilio.com/)
  - [Razorpay](https://razorpay.com/)

<br>

### 📦 Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Jimesh-patel/MicroService.git
cd go-cab
```

#### 2. Create Environment Variables

Create `env` folder in the root directory 
and add all service .env file in it


#### 4. Run with Docker Compose

```bash
# Build and run all services
docker-compose up --build -d
```

#### 5. Access the Application

Once all services are running, access the frontend application at:
```
http://frontend:3000
```

And the API Gateway at:
```
http://gateway:5000
```
