# Mongoose

A simple REST API built with **Node.js**, **Express.js**, and **Mongoose** that allows users to be created and managed using MongoDB. This project is primarily for learning **Mongoose, MongoDB CRUD operations, schemas, models, and validation**.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose

## Installation

```bash
git clone https://github.com/the-vivek-codes/nodejs-projects
cd 03-mongoose
npm install
node index.js
```

Make sure your local MongoDB server is running.

Server runs at:

```text
http://localhost:3000
```

## API Endpoints

### Manage Users

* `POST /api/users` — Create a new user
* `GET /api/users` — Get all users
* `GET /api/users/:id` — Get a user by ID
* `PUT /api/users/:id` — Update a user by ID
* `DELETE /api/users/:id` — Delete a user by ID

## User Fields

```text
firstName  - Required
lastName   - Optional
email      - Required, Unique
dob        - Optional
gender     - Male / Female / Other
jobTitle   - Optional
```
