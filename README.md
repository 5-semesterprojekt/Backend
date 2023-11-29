![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

# 📌 Contents

1. [**Setup**](#️-setup)
2. [**Start**](#rocket-start)
3. [**Scripts**](#-scripts)
4. [**Contribution**](#building_construction-contribution)
5. [**API Documentation**](#clipboard-api-documentation)
   - [**Event**](#create-event)
   - [**Users**](#create-user)
6. [**Error Handling**](#-error-handling)
8. [**Authentication**](#-authentication-/-authorization)

<br>

# 🛠️ Setup

Using [nvm](https://github.com/coreybutler/nvm-windows) is advised.

Using [yarn](https://yarnpkg.com/) is **required**. Install it with npm like this:

```console
npm install -g yarn
```

Clone the project:

```console
git clone https://github.com/5-semesterprojekt/Backend.git
```

Install packages:
```console
cd backend
yarn install
```

it is advised to use our frontend which can get cloned from and follow the guide that is written.
```console
git clone https://github.com/5-semesterprojekt/Frontend.git
```

After that it is also advised to change the example file and rename them without example at the end, at the moment there 3 files that has to change.

[firebaseConfig-example.ts](https://github.com/5-semesterprojekt/Backend/blob/main/src/secrets/firebaseConfig-example.ts)

This one is simple, go to the [firebase console](https://console.firebase.google.com) and create a new project.
Then copy your own firestore config and paste it in the firebaseConfig-example.ts file and rename the file to firebaseConfig.ts

[gmailSecrets-example.ts](https://github.com/5-semesterprojekt/Backend/blob/main/src/secrets/gmailSecrets-example.ts)

If you already have a gmail then you should just follow the intructions in the file and afterwards rename it to gmailSecrets.ts.
If you dont own an gmail then create one and follow the instructions in the gmailSecrets-example.ts. 

[jwtSecretKey-example.ts](https://github.com/5-semesterprojekt/Backend/blob/main/src/secrets/jwtSecretKey-example.ts)

Just rename the one that is called "SECRET_KEY" to something secure, since this line is used store the user's token and could be hacked if compromised.

<br>

# :rocket: Start

The backend can be started by running the start script:

```console
yarn start
```
You can make your own website or use our frontend that we have developed along with this backend. You can get our frontend from here https://github.com/5-semesterprojekt/Frontend.git

<br>

# 📜 Scripts

### `yarn start`
Starts the api, you would now be able to make calls, look at the api doc

### `yarn test`
Runs all tests (see [jest](https://jestjs.io) for more).

### `yarn prettier`
Formats the code according to the [.prettierrc](https://github.com/5-semesterprojekt/Backend/blob/main/.prettierrc).

<br>

# :building_construction: Contribution

1. Make a branch from `main` using the suggested branch name from [Shortcut](https://app.shortcut.com/5-semester/stories/space/19/everything?team_scope_id=v2%3At%3A6536343c-3b19-48f3-96bd-e44481a7aefc%3A6536343c-ab85-4346-9338-ad967260f782). (i.e. feature/sc-{story number}/{feature-name})
2. Commit until the feature is "complete"
3. Run `yarn prettier` so code is formatted correctly
4. Make pull request to `main` and request a review
5. <ins>**Squash and merge**</ins> when all requirements are met

It is **HIGHLY** advisable, that you don't branch off secondary branches. Only branch off `main`.<br>
Feel free to customize and expand upon this documentation based on your specific contributions.

<br>

# :clipboard: API Documentation

## Create Event

Create a new event by making a POST request to the following endpoint:
**Needs to be logged in/auth token**

```http
POST /events/:orgId/
```
**Request Body:**
**title** (string, required): The title of the event.<br>
**start** (date, required): The start date and time of the event in ISO format (e.g., "2019-12-17T03:24:00").<br>
**end** (date, required): The end date and time of the event in ISO format.<br>
**description** (string, optional): A description of the event.

**Example:**
```json
{
  "title": "some title",
  "description": "some description",
  "start": "2019-12-17T03:24:00",
  "end": "2019-12-18T03:24:00"
}
```

**Response:**<br>
**Status Code:** `201 Created`<br>
**Response Body:** The created event object with an additional **id** field.

## Get All Events
Retrieve all events for a specific organization by making a **GET** request to the following endpoint:

```http
GET /events/:orgId/
```
**Response:**<br>
**Status Code:** `200 OK` if the event is found.<br>
**Example**
```json
[
   {
        "title": "Event title",
        "description": "something...",
        "start": "2023-11-23T23:00:00.000Z",
        "end": "2023-11-23T23:00:00.000Z",
        "orgId": 123
   }, ...
]
```

## Get Event by ID
Retrieve a specific event by its ID for a given organization by making a **GET** request to the following endpoint:
```http
GET /events/:orgId/:id
```

**Response:**<br>
**Status Code:** `200 OK` if the event is found, `404 Not Found` otherwise.

## Update Event
Update an existing event by making a **PUT** request to the following endpoint:
```http
PUT /events/:orgId/:id
```

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "start": "2023-12-01T15:00:00",
  "end": "2023-12-01T20:00:00",
  "description": "Updated Event Description"
}
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** The updated event object.

## Delete Event
Delete a specific event by its ID for a given organization by making a **DELETE** request to the following endpoint:
```http
DELETE /events/:orgId/:id
```

**Response:**<br>
**Status Code:** `204 No Content` if the event is deleted successfully, `404 Not Found` otherwise.

## Create User
Create a new user by making a **POST** request to the following endpoint:

```http
POST /users/:orgId/
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "repeatPassword": "SecurePassword123!"
}
```

**Response:**<br>
**Status Code:** `201 Created`<br>
**Response Body:** The created user object.

## User Login
Authenticate a user by making a **POST** request to the following endpoint:

```http
POST /users/:orgId/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** The authenticated user object.

## Get All Users by Organization
**Needs to be logged in/auth token**

Retrieve all users for a specific organization by making a **GET** request to the following endpoint:

```http
GET /users/:orgId/
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** An array of user objects for the specified organization.

## Get User by Token/ID
**Needs to be logged in/auth token**
A jwt token must be present in the [Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). This token is received by logging in.
Retrieve the user associated with the provided token by making a **GET** request to the following endpoint:

```http
GET /users/:orgId/me
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** The user object.

## Get User by ID
**Needs to be logged in/auth token**

Retrieve a specific user by their ID for a given organization by making a **GET** request to the following endpoint:

```http
GET /users/:orgId/:id
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** The user object.

## Update User
**Needs to be logged in/auth token**

Update an existing user by making a **PUT** request to the following endpoint:
```http
PUT /users/:orgId/:id
```

**Request Body:**
```json
{
  "firstName": "Updated John"
}
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** The updated user object.

## Delete User
**Needs to be logged in/auth token**<br>
Delete a specific user by their ID for a given organization by making a **DELETE** request to the following endpoint:
```http
DELETE /users/:orgId/:id
```

**Response:**<br>
**Status Code:** `204 No Content`

## Forgot Password
Initiate the forgot password process by making a **POST** request to the following endpoint:
```http
POST /users/:orgId/forgot-password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**<br>
**Status Code:** `200 OK`<br>
**Response Body:** An object with a message indicating that the email has been sent.

<br>

# ⚠️ Error Handling

## Overview
The error handling module in this application is designed to manage and respond to errors that may occur during the execution of API endpoints. It includes middleware functions for logging errors, responding with appropriate error messages, and handling invalid paths.

### Custom Errors
Custom errors, such as ```BaseError```, are supported. They can be thrown with a specific status code and optional error details.
```javascript
import { BaseError } from 'path-to-error-handler';

throw new BaseError('Custom error message', 404, { additionalInfo: 'details' });
```
A BaseError should generally be thrown when an error is expected. i.e. when an entry doesn't exist in a database, then `throw new BaseError('Error', 404);` immediately.

<br>

# 🔑 Authentication / Authorization
## Overview
The authentication middleware is designed to secure specific routes by ensuring that requests contain a valid JWT token in the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. If the token is valid, the middleware decodes it, extracts the user ID, and attaches it to the request object for further use in downstream middleware or route handlers.

## Usage
The `auth` middleware function should be applied to routes or groups of routes that require authentication.<br>
If the token is missing or invalid, the middleware responds with a `401 Unauthorized` status code and the message "Please authenticate."

### Example

```javascript
import { auth, CustomRequest } from 'path-to-authentication-middleware';

// ... Other middleware and route handling

// Apply authentication middleware to a route
app.get('/authenticated-route', auth, (req: CustomRequest, res) => {
  // Access user ID from the decoded token
  const userId = req.token;

  // ... Other route handling logic
});
```
