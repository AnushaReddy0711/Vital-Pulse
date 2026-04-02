🩸 Vital - Pulse


Vital Pulse – Smart Blood Network System is a full-stack web application designed to digitize the process of blood donation, request management, and hospital inventory tracking. It connects donors, patients, hospitals, and administrators on a unified platform to ensure efficient and real-time coordination during critical situations. Built using React.js for frontend and Spring Boot for backend, the application uses an in-memory H2 database for fast and efficient data handling during development. 


🚀 Features:


👤 User Management


~ Registration & role-based access (Donor, Patient, Hospital, Admin)


🩸 Donor Module


~ Register as donor


~ Track eligibility status


🧑‍⚕️ Patient Module


~ Request blood units


~ Track request status


🏥 Hospital Module


~ Manage blood inventory


~ Approve/reject requests


~ Automatically update stock after fulfilling requests


📊 Admin Dashboard


~ Monitor users, donors, and requests


~ View analytics and trends


🔄 Dynamic Inventory Update


~ Blood units are automatically reduced when a request is approved


~ Prevents over-allocation and ensures real-time accuracy

🧩 Tech Stack


~Frontend:


>React.js


>Axios


>Tailwind CSS / Material UI

~Backend:


>Spring Boot (Java)


>Spring Data JPA


>REST APIs

~Database:


>H2 Database (In-Memory)

⚙️ System Architecture


RESTful API-based communication


MVC architecture in backend


Modular frontend with reusable components

📁 Project Structure


Backend (Spring Boot)


src/main/java/com/example/demo


│


├── controller


├── service


├── repository


├── entity


└── config


Frontend (React)


src/


├── components/


├── pages/


├── services/


└── App.js

🔑 Key Functional Flow


Patient creates a blood request


Hospital reviews and approves request


System checks available stock


If sufficient:


~ Deducts units from inventory


~ Updates request status to COMPLETED


If insufficient:


~ Displays error message

📊 Database Entities


User – Stores user details and roles


Donor – Blood group and eligibility info


BloodRequest – Request details and status


BloodInventory – Hospital stock management

🛠️ Setup Instructions


🔹 Backend Setup


Clone the repository


git clone https://github.com/AnushaReddy0711/Vital-Pulse.git


Open project in IntelliJ / STS


Run Spring Boot application


Access H2 Console:
http://localhost:8080/h2-console

Use:


JDBC URL: jdbc:h2:mem:bloodbank

🔹 Frontend Setup


Navigate to frontend folder


>cd frontend

Install dependencies


>npm install

Run application


>npm start


👩‍💻 Author


Singasani Anusha Reddy

⭐ Support


If you found this project useful, consider giving it a ⭐ on GitHub!
