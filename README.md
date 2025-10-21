<<<<<<< HEAD
# LuxeVoyage - Travel Management System

LuxeVoyage is a full-stack web application for a travel agency. It allows users to browse and book tours and hotels, manage their bookings, and provides an admin dashboard for managing the platform.

## Features

-   **User Authentication:** Secure user registration and login with JWT-based authentication.
-   **Tour and Hotel Browsing:** A comprehensive list of tours and hotels with detailed information.
-   **Booking System:** Users can book tours and hotels for specific dates and a number of guests.
-   **User Dashboard:** A personalized dashboard for users to view and manage their bookings.
-   **Admin Dashboard:** A dedicated dashboard for administrators to manage tours, hotels, and bookings.

## Technologies Used

### Frontend

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [React Router](https://reactrouter.com/) for client-side routing
-   [Axios](https://axios-http.com/) for making API requests

### Backend

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [SQLite](https://www.sqlite.org/index.html) as the database
-   [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
-   [JSON Web Tokens (JWT)](https://jwt.io/) for authentication
-   [CORS](https://www.npmjs.com/package/cors) for handling cross-origin requests
-   [Dotenv](https://www.npmjs.com/package/dotenv) for managing environment variables
-   [express-validator](https://express-validator.github.io/docs/) for input validation
-   [Morgan](https://www.npmjs.com/package/morgan) for HTTP request logging

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v14 or later)
-   [npm](https://www.npmjs.com/get-npm)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/tms-react.git
    cd tms-react
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory by copying the `.env.example` file.

    ```bash
    cd backend
    cp .env.example .env
    ```

    Open the `.env` file and add a secure `JWT_SECRET`.

2.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

    The backend server will be running on `http://localhost:4000`.

3.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will be running on `http://localhost:5173`.

4.  **Start both servers concurrently (for Windows PowerShell):**

    ```powershell
    .\scripts\start-all.ps1
    ```

## Available Scripts

### Root

-   `node scripts/verify_endpoints.js`: Verifies that the backend and frontend endpoints are running correctly.

### Frontend

-   `npm run dev`: Starts the frontend development server.
-   `npm run build`: Builds the frontend for production.
-   `npm run preview`: Previews the production build.

### Backend

-   `npm start`: Starts the backend server.

## Folder Structure

```
tms-react/
├── backend/
│   ├── node_modules/
│   ├── server.js
│   ├── package.json
│   └── luxevoyage.db
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── start-all.ps1
│   └── verify_endpoints.js
├── .gitignore
├── package.json
└── README.md
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
=======
# TMS-react-project
>>>>>>> af39b000cc42bd64433deb6788e50753ff167f02
