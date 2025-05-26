# 💥 BOOM - Short & Long Video Platform (Full Stack)

A full-stack web app where creators can upload short-form videos or long-form YouTube links. Viewers can watch, buy, comment, and gift creators.

---

## 🚀 Tech Stack

- **Frontend:** React.js + Tailwind CSS + Axios + React Router
- **Backend:** Node.js + Express.js + MongoDB + Multer
- **Auth:** JWT
- **Video Types:**
  - Short-form: Upload `.mp4` videos
  - Long-form: Paste YouTube links

---

## ✨ Features

- 🔐 User Authentication (Login/Register)
- 🎥 Upload short & long videos
- 📰 Boom Feed with unified scroll
- 🛒 Buy long-form videos using wallet
- 💬 Comment on videos
- 🎁 Gift creators
- 🎬 Video player with embedded YouTube or uploaded MP4

---

## 🛠 Full Stack Setup Instructions

### 1️⃣ Clone & Install Dependencies

```bash
git clone https://github.com/your-username/boom-assignment.git
cd boom-assignment

# Install backend dependencies
cd server
npm install

# Go back and install frontend dependencies
cd ../client
npm install
```

---

### 2️⃣ Environment Variables

#### 📁 Create backend `.env` in `/server`

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

#### 📁 (Optional) Create frontend `.env` in `/client`

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3️⃣ Run the App (Backend + Frontend)

#### 🚀 Start Backend

```bash
cd server
npm run dev
```

#### 🌐 Start Frontend

```bash
cd ../client
npm run dev
```

Open your browser at:  
👉 `http://localhost:5173`

---

