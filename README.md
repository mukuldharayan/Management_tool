📌 Project Management Tool

A modern and minimal project management tool backend & frontend built using Node.js (Express.js), React.js (TypeScript), and MongoDB.
This project allows users to register/login, create and manage projects, track tasks with due dates, filter tasks by status, and seed the database with test data — all with JWT authentication, bcrypt password hashing, and clean API structure.

--------

A basic Project Management Tool built with:
- Backend: Node.js (Express.js)
- Frontend: React.js (TypeScript)
- Database: MongoDB
- Authentication: JWT + bcrypt
- Seeding: Pre-populates database with test data

---

🚀 Features

Authentication
- User Registration & Login with Email + Password
- Password hashing using bcrypt
- JWT-based authentication

Projects
- Create / Update / Delete projects
- View user-specific projects
- Project fields: `title`, `description`, `status` (`active`, `completed`)

Tasks
- Associated with projects
- Fields: `title`, `description`, `status` (`todo`, `in-progress`, `done`), `due date`
- CRUD operations for tasks
- Filter tasks by status

Seed Data
- One default user:  
  **Email:** `test@example.com`  
  **Password:** `Test@123`
- 2 Projects linked to this user
- Each project has 3 tasks

---

📂 Project Structure

management-tool/
│
├── backend/ # Express.js API
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── config/
│ │ └── seed/ # Seeder script
│ ├── package.json
│
├── frontend/ # React.js (TypeScript) app
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │  ├── Auth/
│ │  ├── Dashboatd/
│ │ ├── context/
│ │ ├── routes/
│ ├── package.json
│
└── README.md

---

🛠️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/project-management-tool.git
cd project-management-tool

2️⃣ Backend Setup

cd backend
npm install

Create a .env file in backend:

PORT=9000
MONGO_URI=mongodb+srv://:@cluster-url/ DB_NAME=pnb
JWT_SECRET=your_jwt_secret

Run the backend:

npm run dev

3️⃣ Frontend Setup

cd ../frontend
npm install

Run the frontend:

npm run dev

------------

🌱 Seeding the Database

We provide a seed script to populate MongoDB with:

A default user (test@example.com / Test@123)

2 projects for this user

3 tasks per project

Run Seeder

cd backend
npm run seed // Connected to MongoDb with data

--------------

📌 API Endpoints

Auth

POST	/api/auth/register -----	Register a new user
POST	/api/auth/login	--------  Login a user

Projects

GET	     /api/projects	--------   Get all user's projects
POST	  /api/projects	------------ Create a new project
PUT	    /api/projects/:id --------	Update a project
DELETE	/api/projects/:id	-------- Delete a project

Tasks

GET   	 /api/projects/:id/tasks-----	Get tasks by project
POST	   /api/projects/:id/tasks----	Add new task
PUT	    /api/tasks/:taskId----------	Update a task
DELETE	/api/tasks/:taskId-----------	Delete a task

--------

🧪 Test Credentials

Use the seeded account to test/login:

Email: test@example.com
Password: Test@123

------

📜 License
This project is licensed under the MIT License.

--------------

📬 Contact For any issues or queries, open an issue or email at mukulchaudhary1123@gmail.com.
