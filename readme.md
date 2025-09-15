# Chat Application

This is a real-time chat application with audio/video calls, screen sharing, and group chat features.

## Features

- Real-time one-to-one and group chat
- Audio and video calls
- Screen sharing
- User presence (online, offline, etc.)
- Message receipts (sent, delivered, read)
- Contact management (add, accept, block)
- User profiles

## Architecture

The application follows a client-server architecture:

- **Frontend:** Built with Next.js and React. It uses Socket.IO for real-time communication with the backend and WebRTC for peer-to-peer audio/video calls and screen sharing.
- **Backend:** A NestJS application that handles user authentication, messaging, and signaling for WebRTC.
- **Database:** PostgreSQL is used for storing user data, messages, and other application data. Redis is used for caching and managing WebSocket connections in a distributed environment.
- **Deployment:** The application is containerized using Docker and can be deployed using Docker Compose.

## Getting Started

To get the application running locally for development, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd chat-application
    ```

2.  **Set up environment variables:**

    - Copy the `.env.example.local` file in the `client` directory to `.env.local` and update the values.
    - Copy the `.env.example` file in the `server` directory to `.env` and update the values.

3.  **Run the development environment:**
    ```bash
    docker-compose -f docker-compose.dev.yml up -d --build
    ```

This will start the following services:

- `client`: The Next.js frontend running on `http://localhost:3000`
- `server`: The NestJS backend running on `http://localhost:4000`
- `db`: The PostgreSQL database
- `redis`: The Redis server

## Deployment

To deploy the application in a production environment, you can use the `docker-compose.prod.yml` file. This file is optimized for production use and includes services for the client, server, database, and an Nginx reverse proxy.

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## API Documentation

The backend API is documented using Swagger/OpenAPI. When the application is running in development mode, you can access the API documentation at `http://localhost:4000/api`.

## Frontend Documentation

The frontend is built with Next.js and React. The code is organized into the following directories:

- `app`: Contains the main application pages.
- `components`: Contains reusable React components.
- `utils`: Contains utility functions and the Socket.IO client setup.

## Database Schema

The database schema is defined in `doc/database/database.md`. This file contains the SQL statements for creating the tables and the TypeORM entities used in the backend.

## Backup and Restore

The `scripts/` directory contains scripts for backing up and restoring the PostgreSQL database.

- **Backup:**

  ```bash
  docker-compose -f docker-compose.db-backup.yml run backup
  ```

  This will create a backup of the database in the `backups/` directory.

- **Restore:**
  ```bash
  docker-compose -f docker-compose.db-restore.yml run restore
  ```
  This will restore the database from the specified backup file.
