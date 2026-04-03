# DOCNEX - Distributed Healthcare Intelligence Platform

## Project Overview
DOCNEX is a production-grade healthcare platform designed for secure medical document handling, explainable doctor recommendations, and transaction-safe real-time appointment scheduling.

## Tech Stack (MERN)
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (Relational-like logic with Mongoose)
- **Object Storage**: MinIO (Medical Records)
- **Caching**: Redis
- **Auth**: JWT (jsonwebtoken)
- **Real-time**: Potential for Socket.io / RabbitMQ integration

## Project Structure
- `backend/`: Node.js/Express server, Mongoose models, and services.
- `frontend/`: React frontend with TypeScript.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB
- MinIO
- Redis

### 2. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure your environment variables in `.env`.
4. Start the server: `npm start` (or `node server.js`)

### 3. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Architecture & Design Decisions

### 1. Concurrency & Data Integrity
- **Booking Strategy**: We use **MongoDB Transactions** and atomic updates to ensure that appointment slots are never double-booked.

### 2. Security
- **Medical Records**: Files are stored in MinIO. The database only stores metadata and secure keys. Access is provided via time-limited pre-signed URLs.

### 3. Explainability
- **Doctor Recommendations**: A deterministic **Weighted Rule-Based Scoring System** is used to rank doctors based on experience, ratings, and availability.

## Future Improvements
- **Search**: Integrate Elasticsearch for fuzzy text search on symptoms.
- **Notifications**: Implement RabbitMQ consumers for email/SMS dispatch.
- **Geo**: Use geospatial queries for distance-based doctor search.
