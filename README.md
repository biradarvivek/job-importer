# Job Importer (MERN + Redis + BullMQ + Worker + Socket.IO)

A scalable job-importing system that fetches jobs from RSS/XML feeds, queues each import task using BullMQ (Redis), processes them in a background worker, stores jobs + import logs in MongoDB, and updates the frontend in real-time using Socket.IO.

---

## 📁 Project Structure

repo-root/
│
├── client/ # React + Vite + Tailwind frontend
│ ├── src/App.jsx
│ └── ...
│
├── server/ # Backend + Worker + Cron + Socket.IO
│ ├── index.js
│ ├── socket.js
│ ├── worker/jobWorker.js
│ ├── cron/fetchCron.js
│ ├── queue/jobQueue.js
│ ├── controllers/jobController.js
│ ├── services/fetchJobs.js
│ ├── models/Job.js
│ ├── models/ImportLog.js
│ └── config/
│ ├── db.js
│ └── redis.js
│
├── docs/
│ └── architecture.md
│
└── README.md


---

## 🚀 Features

- Fetch jobs from **multiple RSS/XML feeds**
- Convert XML → JSON using xml2js
- Queue every feed import task into **BullMQ (Redis)**
- Background worker processes jobs:
  - Insert new jobs
  - Update existing jobs
  - Create an import log document
  - Publish the log to Redis
- Server listens to Redis (pub/sub) and emits via **Socket.IO**
- Frontend updates **live** without refresh
- Auto-import every minute using **node-cron**
- Clean UI built with **React + TailwindCSS**

---

## 🧪 Prerequisites

- Node.js v16+  
- MongoDB (local or Atlas)  
- Redis (Redis Cloud recommended)  
- npm  

---

## ⚙️ Installation

### 1️⃣ Clone the repo


git clone https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>

🛠 Backend Setup
cd server
npm install

Create a .env file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobImporter
REDIS_URL=redis://default:<password>@<redis-host>:<port>
API_BASE=http://localhost:5000

Start the backend:
npm start

🛠 Worker Setup
In another terminal:
cd server
node .\worker\jobWorker.js

🎨 Frontend Setup
cd client
npm install
npm run dev
Open browser:
👉 http://localhost:5173

▶️ Run Cron Job Automatically
Cron runs every minute (configured in server/cron/fetchCron.js):

📡 Real-Time Updates (Socket.IO)
Worker publishes logs → Redis

Server receives via Redis subscriber → emits via Socket.IO

Frontend listens to "new-import-log" and updates instantly

No reload needed.

🧪 Running Tests
There are no automated tests included (project focuses on background processing).
To manually test:

Start server

Start worker

Start frontend

Click “Run Import Now”

Verify:
Worker logs processing

Server emits websocket event

UI table updates instantly

MongoDB contains import log documents

Worker logs processing

Server emits websocket event

UI table updates instantly

MongoDB contains import log documents

<img width="1903" height="1027" alt="image" src="https://github.com/user-attachments/assets/edd8de64-008b-40d2-9425-723de8c621b0" />


