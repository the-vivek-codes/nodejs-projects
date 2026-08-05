# QuickNotes

A simple REST API built with **Node.js** and **Express.js** that allows users to register, log in, and manage personal notes. Data is stored in local JSON files, making it ideal for learning backend fundamentals.

## Features

- User registration with hashed passwords (bcrypt)
- User login
- Create, Read, Update, and Delete (CRUD) notes
- Simple header-based authentication using `x-user-id`

## Tech Stack

- Node.js
- Express.js
- bcrypt
- UUID
- JSON File Storage

## Installation

```bash
git clone https://github.com/the-vivek-codes/nodejs-projects
cd 02-quicknotes
npm install
node index.js
```

Server runs at:

```text
http://localhost:3000
```

## API Endpoints

### Authentication :

- `POST /api/auth/register`
- `POST /api/auth/login`

### Manage Notes :

> Include the request header `x-user-id: <your-user-id>` with all requests to `/api/notes`.

- `POST /api/notes`
- `GET /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
