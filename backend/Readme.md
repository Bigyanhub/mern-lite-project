# 🚀 Express API Starter

A clean, minimal, and scalable Express.js REST API boilerplate — perfect for rapid backend development and easy integration with any frontend or mobile stack.

---

## 📦 Features

* ✅ **Modular Routing** – Organized routes with controllers
* 🔐 **Future-Ready Structure** – Middleware-ready, validation-ready
* 🧱 **RESTful by Design** – Easily extendable for real-world APIs
* 💡 **Environment Config** – Uses `.env` for clean configuration
* 🗄️ **MySQL Integration** – Basic DB connection ready for queries
* 🧪 **Great for Learning** – Simple, readable code for beginners and beyond

---

## 🔧 Tech Stack

* **Node.js**
* **Express.js**
* **MySQL** (via `mysql2`)
* **ES Modules** (`import/export`)
* **dotenv** for environment management
* *(More tools like Helmet, Morgan, CORS can be added)*

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Bigyanhub/express-api-starter.git
cd express-api-starter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and configure it with your own database credentials and port. Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```

> **Security Note**: Never commit your `.env` file to version control. Ensure `.env` is listed in your `.gitignore` file to prevent accidentally sharing sensitive information like passwords or API keys.

### 4. Start the server

```bash
npm run dev
```

> Server will run at: `http://localhost:5000` 

---

## 📁 Folder Structure

```
├── router/
│   └── userRoute.js       # Handles user routes
├── controllers/
│   └── user.js            # Controller logic
├── database/
│   └── db.js              # MySQL DB connection config
├── index.js               # Entry point
├── .env                   # Environment config (not committed)
├── .gitignore             # Ignore sensitive files like .env
├── package.json
```

---

## 📬 Example Routes

* `GET /users` → Returns dummy data from controller
* `POST /users` → Accepts JSON body with email & password

---

## 📈 Future Additions (Ideas)

* [ ] Middleware: Helmet, CORS, Logger
* [ ] Input Validation with Zod or Joi
* [ ] MongoDB / PostgreSQL support toggle
* [ ] Authentication (JWT / Sessions)
* [ ] Global Error Handler

---