# User Management REST API

A simple REST API built with Node.js and Express that demonstrates the implementation of CRUD (Create, Read, Update, Delete) operations using a JSON file as the data source instead of a database.

This project was created to learn:

* Express.js routing
* Route parameters
* Middleware
* Handling request bodies
* CRUD operations
* Working with JSON data
* Reading and writing files using the Node.js File System module

## Project Overview

The application uses a mock dataset stored in `MOCK_DATA.json`.  
The dataset was generated using Mockaroo:  
https://www.mockaroo.com/

## Tech Stack

* Node.js
* Express.js
* File System (fs) Module
* JSON File Storage

## Installation

```bash
git clone https://github.com/the-vivek-codes/nodejs-projects
cd nodejs-projects
npm install
node index.js
```

Server runs on:

```text
http://localhost:8000
```

## API Endpoints

| Method | Route            | Description                   |
| ------ | ---------------- | ----------------------------- |
| GET    | `/users`         | Returns an HTML list of users |
| GET    | `/api/users`     | Returns all users             |
| GET    | `/api/users/:id` | Returns a specific user       |
| POST   | `/api/users`     | Creates a new user            |
| PATCH  | `/api/users/:id` | Updates an existing user      |
| DELETE | `/api/users/:id` | Deletes a user                |

## Notes

Detailed explanations of middleware, routing, request handling, and API workflow can be found in `notes.md`.

