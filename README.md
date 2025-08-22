# 🚀 DevTinder - Full Stack Dating App

A comprehensive full-stack dating application built with modern web technologies, featuring real-time chat, payment integration, and cloud deployment.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Development Roadmap](#-development-roadmap)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Custom Domain Setup](#-custom-domain-setup)
- [Email Integration](#-email-integration)
- [Cron Jobs](#-cron-jobs)
- [Payment Gateway](#-payment-gateway)
- [Real-time Chat](#-real-time-chat)
- [Project Ideas](#-project-ideas)

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS + Daisy UI
- React Router DOM
- Redux Toolkit + React Redux
- Axios
- Socket.io Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.io
- AWS SES
- Razorpay
- PM2

**Deployment:**
- AWS EC2
- Nginx
- Cloudflare (DNS + SSL)

## 🗺 Development Roadmap

### Phase 1: Frontend Setup
- [x] Create Vite + React application
- [x] Remove unnecessary code and create Hello World app
- [x] Install Tailwind CSS
- [x] Install Daisy UI
- [x] Add NavBar component to App.jsx
- [x] Create separate NavBar.jsx component
- [x] Install React Router DOM

### Phase 2: Routing & Layout
- [x] Create BrowserRouter → Routes → Route structure
- [x] Create Outlet in Body Component
- [x] Create footer component
- [x] Create Login Page

### Phase 3: API Integration
- [x] Install Axios
- [x] Setup CORS in backend with configurations
- [x] Configure API calls with `withCredentials: true`

### Phase 4: State Management
- [x] Install react-redux + @reduxjs/toolkit
- [x] Setup configureStore → Provider → createSlice
- [x] Add Redux DevTools
- [x] Login integration with store
- [x] NavBar updates on user login

### Phase 5: Authentication & Security
- [x] Add constants file + components folder structure
- [x] Protect routes - redirect to login if no token
- [x] Logout feature implementation

### Phase 6: Core Features
- [x] Get feed data and add to store
- [x] Build user card component for feed
- [x] Edit Profile feature
- [x] Toast messages on profile save
- [x] Connections page
- [x] Connection requests page
- [x] Accept/Reject connection requests
- [x] Send/Ignore user cards from feed
- [x] User signup functionality

### Phase 7: Testing
- [x] End-to-end testing implementation

## 🏗 Architecture

```
Body 
├── NavBar
├── Route=/ => Feed
├── Route=/login => Login  
├── Route=/connections => Connections
└── Route=/profile => Profile
```

## 🚀 Deployment

### AWS EC2 Setup

1. **Launch EC2 Instance**
   ```bash
   chmod 400 <secret>.pem
   ssh -i "devTinder-secret.pem" ubuntu@ec2-43-204-96-49.ap-south-1.compute.amazonaws.com
   ```

2. **Install Node.js v16.17.0**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### Frontend Deployment

```bash
# Install dependencies and build
npm install
npm run build

# Install and configure Nginx
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Copy build files
sudo cp -r dist/* /var/www/html/

# Enable port 80
# Configure security groups in AWS Console
```

### Backend Deployment

```bash
# Update database configuration
# Allow EC2 public IP in MongoDB Atlas

# Install PM2 globally
npm install pm2 -g

# Start application with PM2
pm2 start npm --name "devTinder-backend" -- start

# PM2 commands
pm2 logs
pm2 list
pm2 flush <name>
pm2 stop <name>
pm2 delete <name>
```

### Nginx Configuration

**File:** `/etc/nginx/sites-available/default`

```nginx
server {
    listen 80;
    server_name 43.204.96.49;
    
    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## 🌐 Custom Domain Setup

### Domain Configuration Steps

1. **Purchase domain** from GoDaddy
2. **Setup Cloudflare**
   - Add domain to Cloudflare
   - Update nameservers on GoDaddy
   - Wait ~15 minutes for propagation
3. **DNS Configuration**
   ```
   Type: A
   Name: devtinder.in  
   Content: 43.204.96.49
   ```
4. **Enable SSL** through Cloudflare

### URL Structure
- **Frontend:** `devtinder.com`
- **Backend:** `devtinder.com/api` (proxied from `localhost:7777`)

## 📧 Email Integration (AWS SES)

### Setup Steps

1. **IAM User Creation**
   - Create IAM user with `AmazonSESFullAccess`
   - Generate access credentials

2. **SES Configuration**
   - Create identity in Amazon SES
   - Verify domain name
   - Verify email address identity

3. **Implementation**
   ```bash
   npm install @aws-sdk/client-ses
   ```

4. **Environment Variables**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

### Code Reference
[AWS SES Documentation](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples)

## ⏰ Cron Jobs

### Implementation

```bash
npm install node-cron date-fns
```

### Features
- **Syntax:** Learn cron expressions at [crontab.guru](https://crontab.guru)
- **Daily emails** for users with connection requests
- **Bulk email scheduling** using queue mechanisms
- **Packages:** bee-queue & bull for advanced queuing

### Tasks
- Find unique email IDs with connection requests from previous day
- Send automated notification emails
- Queue management for bulk operations

## 💳 Payment Gateway (Razorpay)

### Setup Process

1. **Razorpay Account**
   - Sign up and complete KYC
   - Get API keys from dashboard

2. **Implementation**
   ```bash
   npm install razorpay
   ```

3. **Features**
   - Premium page UI
   - Order creation API
   - Payment schema and models
   - Webhook integration
   - Order tracking in database

### References
- [Razorpay Node.js Documentation](https://github.com/razorpay/razorpay-node/tree/master/documents)
- [Integration Steps](https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/)
- [Webhook Validation](https://razorpay.com/docs/webhooks/validate-test/)

## 💬 Real-time Chat (Socket.io)

### Implementation

**Backend:**
```bash
npm install socket.io
```

**Frontend:**
```bash
npm install socket.io-client
```

### Features
- Chat window UI: `/chat/:targetUserId`
- Real-time message exchange
- Socket connection management
- Event listeners for live communication

### Homework & Improvements
- [ ] Enhanced UI design
- [ ] Authentication in WebSockets
- [ ] Friend verification before messaging
- [ ] Online status indicators
- [ ] Last seen timestamps
- [ ] Message pagination and limits

## 🎮 Project Ideas

### Extension Projects
1. **Tic Tac Toe Game**
   - Real-time multiplayer
   - Socket.io integration
   - Game state management

2. **Chess Application**
   - Advanced game logic
   - Move validation
   - Real-time gameplay

---

**Built with ❤️ using modern web technologies**