<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<h1 align="center">🌸 MindBloom — Teen Guidance Portal</h1>

<p align="center">
  <strong>A safe, friendly, and interactive web platform designed for pre-teens (10–13) to ask questions, learn healthy habits, and receive guidance from trusted counselors in a secure environment.</strong>
</p>

---

## 📖 About the Project

**MindBloom** is developed as part of an academic UI/UX course with a primary focus on usability, emotional safety, and accessibility for young users. It provides a non-judgmental, supportive, and educational environment where children can express their concerns freely while being protected from unsafe online information.

### What Does It Do?

- **👦 Child Users** — Children can register securely, ask questions in various categories (school, bullying, friendship), mark issues as urgent/private, track their question status, view replies, and access the Knowledge Center and mini-quizzes to earn badges.
- **🧑‍⚕️ Counselors** — Trusted counselors have a dashboard to view assigned questions, filter by urgency/status, and use safe response templates to reply using child-friendly language. They can also create educational articles and flag risky cases.
- **🛠️ Admins** — Administrators manage the entire platform. They moderate all users, filter appropriate content, assign incoming questions to specific counselors, and approve or reject Knowledge Center articles.

---

## 🏗️ How We Built It

### Architecture

MindBloom follows a clear separation between the frontend and the backend to ensure a safe, robust, and scalable platform:

1. **Frontend** — A React SPA bootstrapped with Vite, featuring custom routing and global context for authentication.
2. **Backend** — An Express.js Node app providing RESTful APIs for handling authentication, questions, articles, and user management.
3. **Database** — MongoDB with Mongoose object modeling provides robust and schema-validated document storage for all users and content.
4. **Authentication** — Custom JWT-based authentication using `jsonwebtoken` and `bcryptjs` to encrypt passwords. Includes mandatory email verification using `nodemailer` before allowing users to log in.

### Design Philosophy

- **Kid-Friendly Interface** — Designed with a soft color palette, rounded cards, and clean layouts.
- **Accessible & Safe** — Large readable fonts, friendly icons, simple navigation, and emotionally safe, welcoming design choices everywhere.
- **Interactive** — Features UI-based gamification elements like achievements/badges and quizzes to keep pre-teens engaged and learning.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React | UI component library |
| **Build Tool** | Vite | Dev server & optimized bundler |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Icons** | Heroicons | Friendly SVG icons |
| **Backend** | Node.js + Express.js | API server and backend logic |
| **Database** | MongoDB + Mongoose | NoSQL Database & schema definitions |
| **Authentication**| JWT + bcryptjs | Secure login sessions and password hashing |
| **Email Service** | Nodemailer | Sending account verification emails |

---

## 📁 Project Structure

```text
MindBloom-teen-guidance-portal/
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Global state (e.g., AuthContext)
│   │   ├── pages/                # Route views (Login, ChildHome, AdminHome, etc.)
│   │   ├── App.jsx               # Application root and router logic
│   │   └── main.jsx              # DOM entry point
│   ├── index.html                # HTML entry
│   ├── tailwind.config.js        # Tailwind styling configurations
│   └── vite.config.js            # Vite build configuration
│
└── backend/                      # Node + Express API
    ├── config/                   # Database (MongoDB) config
    ├── models/                   # Mongoose schemas (User, Question, Article, Quiz)
    ├── routes/                   # API endpoint controllers (auth, users, questions)
    ├── utils/                    # Helper scripts (emailService)
    ├── seed.js                   # Script to populate initial demo data
    └── server.js                 # Express server bootstrap
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**
- **npm** 
- A **MongoDB** instance (local, or Atlas cloud URI)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mindbloom-teen-guidance-portal.git
cd mindbloom-teen-guidance-portal
```

### Environment Setup

Create `.env` files in both the `frontend` and `backend` directories.

**backend/.env**
```env
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/mindbloom
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

### Running Locally

You will need to run the backend and frontend simultaneously in separate terminals.

**1. Run Backend**
```bash
cd backend
npm install
npm run dev
```
*API will be available at `http://localhost:5000`*

**2. Run Frontend**
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be available at `http://localhost:3000`*

---

## 📸 Sample Data Included

When connecting to the database, a `seed.js` script inside the backend allows you to quickly populate the platform with:
- Example child, counselor, and admin accounts
- Sample student questions and counselor replies
- Educational articles for the Knowledge Center
- Demo quiz questions

---

## 📄 License

This project was built for educational and academic purposes.

---

<p align="center">
  Built with ❤️ using React, Node.js, and MongoDB
</p>
