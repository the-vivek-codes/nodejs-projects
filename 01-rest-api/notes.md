# Middleware Used

## URL Encoded Middleware

```js
app.use(express.urlencoded({ extended: false }))
```

Used for parsing form data submitted through forms or tools like Postman.

### Example:

```text
first_name=John
last_name=Doe
```

---

## JSON Middleware

```js
app.use(express.json())
```

Used for parsing JSON request bodies.

### Example:

```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

Without this middleware, `req.body` would be empty for JSON requests.

---

# API Routes

## 1. GET /users

### Purpose

Returns an HTML page containing the first names of all users.

### Request

```http
GET /users
```

### What Happens Internally

1. The route reads all users from the `users` array.
2. The `map()` method creates an HTML `<li>` element for each user.
3. All list items are wrapped inside a `<ul>`.
4. The generated HTML is sent back to the browser.

### Example Response

```html
<ul>
  <li>John</li>
  <li>Emma</li>
  <li>Michael</li>
</ul>
```

---

## 2. GET /api/users

### Purpose

Returns all users as JSON.

### Request

```http
GET /api/users
```

### What Happens Internally

1. Express receives the GET request.
2. The entire `users` array is returned using:

```js
res.json(users)
```

### Example Response

```json
[
  {
    "id": 1,
    "first_name": "John"
  },
  {
    "id": 2,
    "first_name": "Emma"
  }
]
```

---

## 3. GET /api/users/:id

### Purpose

Returns a single user by ID.

### Request

```http
GET /api/users/5
```

### What Happens Internally

1. Express extracts the route parameter.

```js
req.params.id
```

2. The value is converted to a number.

```js
Number(req.params.id)
```

3. `find()` searches for the user.

```js
users.find(user => user.id === id)
```

4. If the user exists:

```js
res.json(user)
```

5. If not:

```js
res.status(404).json(...)
```

### Example Response

```json
{
  "id": 5,
  "first_name": "David"
}
```

---

## 4. POST /api/users

### Purpose

Creates a new user.

### Request

```http
POST /api/users
```

### Example Body

```json
{
  "first_name": "Vivek",
  "last_name": "Kumar"
}
```

### What Happens Internally

1. Data is received through `req.body`.
2. The highest existing ID is found.

```js
const maxId = Math.max(...)
```

3. A new ID is generated.

```js
maxId + 1
```

4. The new user is added using:

```js
users.push(...)
```

5. Updated data is written to `MOCK_DATA.json`.

```js
fs.writeFile(...)
```

6. A success response is returned.

### Example Response

```json
{
  "status": "success",
  "id": 1001
}
```

---

## 5. PATCH /api/users/:id

### Purpose

Updates specific fields of an existing user.

### Request

```http
PATCH /api/users/5
```

### Example Body

```json
{
  "first_name": "Updated Name"
}
```

### What Happens Internally

1. User ID is extracted.
2. `findIndex()` locates the user.
3. Existing user data is merged with incoming data.

```js
{
  ...users[userIndex],
  ...req.body
}
```

4. Updated array is written back to the JSON file.
5. Updated user is returned.

### Example Response

```json
{
  "status": "success",
  "user": {
    "id": 5,
    "first_name": "Updated Name"
  }
}
```

### Why PATCH?

PATCH updates only the fields provided in the request.

If only `first_name` is sent, all other fields remain unchanged.

---

## 6. DELETE /api/users/:id

### Purpose

Deletes a user.

### Request

```http
DELETE /api/users/5
```

### What Happens Internally

1. User ID is extracted.
2. User index is found using:

```js
findIndex()
```

3. User is removed using:

```js
users.splice(userIndex, 1)
```

4. Updated data is saved to the JSON file.
5. Success response is returned.

### Example Response

```json
{
  "status": "success"
}
```

---

# Why There Is No PUT Route

This project currently implements PATCH but not PUT.

## PATCH

Updates only selected fields.

Example:

```json
{
  "first_name": "Vivek"
}
```

Only the first name changes.

---

## PUT

Replaces the entire resource.

Example:

```json
{
  "id": 5,
  "first_name": "Vivek",
  "last_name": "Kumar"
}
```

The complete user object is replaced.

Since this project only needs partial updates, PATCH was used.

---

# CRUD Operations Summary

| Operation | HTTP Method | Route          |
| --------- | ----------- | -------------- |
| Create    | POST        | /api/users     |
| Read All  | GET         | /api/users     |
| Read One  | GET         | /api/users/:id |
| Update    | PATCH       | /api/users/:id |
| Delete    | DELETE      | /api/users/:id |

```
```
