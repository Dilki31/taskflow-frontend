# 🚀 TaskFlow — Full-Stack Task Manager (Frontend)

A modern, dark-themed React frontend for a Task Management application. Built with Vite, React Router, and Axios.

## ✨ Features
- Secure JWT Authentication.
- Create, view, filter, update the status of, and delete tasks.
- Per-user data: each user only sees their own tasks.
- Clean, modern UI (Glassmorphism & Dark Mode).
- Fully responsive.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Axios, React Router DOM
- **Backend:** Spring Boot (JWT, PostgreSQL)
- **Backend Repository:** [TaskFlow API](https://github.com/Dilki31/taskflow-api)

## 🚀 How to Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/Dilki31/taskflow-frontend.git

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Ensure the Spring Boot backend is running on http://localhost:8083
```

To point the app at a different backend, create a `.env.local` file (never commit it):

```
VITE_API_URL=http://localhost:8083/api
```


👨‍💻 Author
Dilki Nanayakkara - @Dilki31
