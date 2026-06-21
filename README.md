# 🧑‍💼 CareerConnect - Job Portal Web Application

A full-stack Job Portal built using the **MERN stack** where recruiters can post jobs and job seekers can search, save, bookmark, and apply for jobs. The app includes JWT authentication, role-based access control, resume upload, multi-select filters, sort functionality, and a modern responsive UI.

---

## 🚀 Features

### For Job Seekers (Students)
- ✅ User Registration & Login with JWT Authentication
- 🔍 Search and Filter Jobs with Multi-Select Filters
- 📊 Sort Jobs (Newest, Salary High-Low, Salary Low-High)
- 💾 Save/Bookmark Jobs for later viewing
- 📄 Upload Resume & Apply for Jobs
- 📋 View My Applications with Status Tracking
- 🏢 View Company Details


### For Recruiters
- ✅ Recruiter Registration & Login
- 🏢 Create, View, Edit, and Delete Companies
- 📝 Post, View, Edit, and Delete Jobs
- 👥 View Applicants for Posted Jobs
- 📊 Stats Dashboard (Total Companies, Jobs, Applicants)
- ⚡ Action Dropdown (View, Edit, Visit Website, Delete)


### General
- 🔐 Role-based access control (Student / Recruiter)
- 👤 Profile Photo Upload & Display
- 🎨 Modern responsive UI with Tailwind CSS + ShadCN
- 📱 Mobile-friendly design
- 🍪 Secure HTTP-only JWT Cookies
- 🔄 Auto-refresh applications every 10 seconds

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS, ShadCN UI, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Upload** | Multer, Cloudinary (Resume & Profile Photos) |
| **Other Tools** | Vite, Postman, Lucide React, Sonner (Toasts) |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository
    git clone https://github.com/prathamchougale/carrerconnect.git
    cd careerconnect-

### 2. Backend Setup
    cd backend
    npm install

Create a `.env` file in the `backend` folder:

    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    SECRET_KEY=your_jwt_secret_key
    CLOUD_NAME=your_cloudinary_cloud_name
    API_KEY=your_cloudinary_api_key
    API_SECRET=your_cloudinary_api_secret

> ⚠️ **Important:** Never commit `.env` files to GitHub. Add `.env` to your `.gitignore` file.

Start the backend server:

    npm start

### 3. Frontend Setup
    cd frontend
    npm install

> **Note:** The frontend API base URL is configured in `src/utils/constant.js`. Update these URLs if your backend runs on a different port or domain.

Start the frontend development server:

    npm run dev

### 4. Access the Application
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`