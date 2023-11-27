![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

Table of context

1. [**Setup**](#️-setup)

2. [**Start**](#rocket-start)

3. [**Scripts**](#-scripts)

4. [**Contribution**](#building_construction-contribution)

5. [**API Documentation**](#api-documentation)

   - [**Event**](#create-event)
   - [**Users**](#create-user)

6. [**Error Handling Documentation**](#error-handling-documentation)

8. [**Authentication Middleware Documentation**](#authentication-middleware-documentation)




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
firebaseConfig-example.ts

After that it is also advised to change the example file and rename them without example at the end, at the moment there 3 files that has to change.
first one is firebaseConfig-example.ts

This one is simple, go to https://console.firebase.google.com and create a new project and copy paste youre own firestore config and copypaste it in the firebaseConfig-example.ts file and rename the file to firebaseConfig.ts

gmailSecrets-example.ts.

if you allready have a gmail then you should just follow the intructions in the file and afterwards rename it to gmailSecrets.ts
if you dont own an gmail then create one and follow the instructions in the     
gmailSecrets-example.ts. 

jwtSecretKey-example.ts

Just rename the one that is called "SECRET_KEY" to something secure since this line is used store the users token and could be hacked if compremized.


<br>

# :rocket: Start

The backend can be started by running the start script:

```console
yarn start
```
You can make youre own website or use our frontend that we have developed along with this backend. you can use our frontend from here https://github.com/5-semesterprojekt/Frontend.git

<br>

# 📜 Scripts

### `yarn start`
Starts the api, you would now be able to make calls, look at the api doc

### `yarn test`
Runs all tests (see [jest](https://jestjs.io) for more).

### `yarn martin`
**ToDo cahnge name**
Formats the code according to the [.prettierrc](https://github.com/5-semesterprojekt/Backend/blob/main/.prettierrc).

<br>

# :building_construction: Contribution

1. Make a branch from `main` using the suggested branch name from [Shortcut](https://app.shortcut.com/5-semester/stories/space/19/everything?team_scope_id=v2%3At%3A6536343c-3b19-48f3-96bd-e44481a7aefc%3A6536343c-ab85-4346-9338-ad967260f782). (i.e. feature/sc-{story number}/{feature-name})
2. Commit until the feature is "complete"
3. Run `yarn prettier` so code is formatted correctly
4. Make pull request to `main` and request a review
5. <ins>**Squash and merge**</ins> when all requirements are met

It is **HIGHLY** advisable, that you don't branch off secondary branches. Only branch off `main`.

# API Documentation

### Create Event

Create a new event by making a POST request to the following endpoint:
**Needs to be logged in/auth token**

```http
POST /events/:orgId/
```
**Request Body:**
**title** (string, required): The title of the event.

**start** (date, required): The start date and time of the event in ISO format (e.g., "2019-12-17T03:24:00").

**end** (date, required): The end date and time of the event in ISO format.

**description** (string, optional): A description of the event.

**Example:**

```typescript
// Call to localhost:3000/123
const event: Event = {
  title: "some title",
  description: "some description",
  start: "2019-12-17T03:24:00",
  end: "2019-12-18T03:24:00",
  orgId: parseInt(req.params.orgId), // Gets the id from the URL
};
```
#### Response

- **Status Code:** `201 Created`

Response Body: The created event object with an additional **id** field.

### Get All Events
Retrieve all events for a specific organization by making a **GET** request to the following endpoint:

```http
GET /:orgId/
```
#### Response
**Status Code:** `200 OK` if the event is found.
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
GET /:orgId/:id
```
**Response:**
- **Status Code:** `200 OK` if the event is found, `404 Not Found` otherwise.

## Update Event

Update an existing event by making a **PUT** request to the following endpoint:

```http
PUT /:orgId/:id
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

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** The updated event object.

### Delete Event
Delete a specific event by its ID for a given organization by making a **DELETE** request to the following endpoint:

```http
DELETE /:orgId/:id
```
#### Response
- **Status Code:** `204 No Content` if the event is deleted successfully, `404 Not Found` otherwise.


## Create User

Create a new user by making a **POST** request to the following endpoint:

```http
POST /:orgId/
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

**Response:**

- **Status Code:** `201 Created`
- **Response Body:** The created user object.

## User Login

Authenticate a user by making a **POST** request to the following endpoint:

```http
POST /:orgId/login
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** The authenticated user object.

## Get All Users by Organization
**Needs to be logged in/auth token**

Retrieve all users for a specific organization by making a **GET** request to the following endpoint:

```http
GET /:orgId/
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** An array of user objects for the specified organization.

## Get User by Token/ID
**Needs to be logged in/auth token**
A jwt token must be present in the [Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). This token is received by logging in.
Retrieve the user associated with the provided token by making a **GET** request to the following endpoint:

```http
GET /:orgId/me
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** The user object.

## Get User by ID
**Needs to be logged in/auth token**

Retrieve a specific user by their ID for a given organization by making a **GET** request to the following endpoint:

```http
GET /:orgId/:id
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** The user object.

## Update User
**Needs to be logged in/auth token**

Update an existing user by making a **PUT** request to the following endpoint:

```http
PUT /:orgId/:id
```

**Request Body:**

```json
{
  "firstName": "Updated John"
}
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** The updated user object.

## Delete User
**Needs to be logged in/auth token**

Delete a specific user by their ID for a given organization by making a **DELETE** request to the following endpoint:

```http
DELETE /:orgId/:id
```

**Response:**

- **Status Code:** `204 No Content`

## Forgot Password
Initiate the forgot password process by making a **POST** request to the following endpoint:

```http
POST /:orgId/forgot-password
```

**Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**

- **Status Code:** `200 OK`
- **Response Body:** An object with a message indicating that the email has been sent.

# Error Handling Documentation

## Overview

The error handling module in this application is designed to manage and respond to errors that may occur during the execution of API endpoints. It includes middleware functions for logging errors, responding with appropriate error messages, and handling invalid paths.

## Error Logger Middleware

The `errorLogger` middleware function logs error messages to the console.

### Usage

```javascript
import { errorLogger } from 'path-to-error-handler';

// ... Other middleware and route handling

app.use(errorLogger);
```

## Error Responder Middleware

The ```errorResponder``` middleware function sends JSON-formatted error responses.

### Usage

```javascript
import { errorResponder } from 'path-to-error-handler';

// ... Other middleware and route handling

app.use(errorResponder);
```

### Custom Errors

Custom errors, such as ```BaseError```, are supported. They can be thrown with a specific status code and optional error details.

```javascript
import { BaseError } from 'path-to-error-handler';

throw new BaseError('Custom error message', 404, { additionalInfo: 'details' });
```

## Invalid Path Handler

The ```invalidPathHandler``` middleware function handles undefined paths, returning a 404 error.

### Usage

```javascript
import { invalidPathHandler } from 'path-to-error-handler';

// ... Other middleware and route handling

app.use(invalidPathHandler);
```

## Password Validation

A list of common passwords is available for use in password validation.

### Usage

```javascript
import { commonPasswords100 } from 'path-to-error-handler';

// Example of password validation
const userPassword = 'password123';
if (commonPasswords100.includes(userPassword)) {
  // Password is common, handle accordingly
}
```

### Common Passwords List

The ```commonPasswords100``` array contains commonly used passwords and can be used for password strength validation.

## Notes

- Ensure that the error handling middleware functions are appropriately placed in the middleware stack to catch errors.
- Custom errors can be used for more specific error handling with detailed status codes and error messages.

Feel free to customize and expand upon this documentation based on your specific application requirements.

# Authentication Middleware Documentation

The authentication middleware in this application utilizes JSON Web Tokens (JWT) to verify and extract user information from incoming requests.

## Overview

The authentication middleware is designed to secure specific routes by ensuring that requests contain a valid JWT token in the 'Authorization' header. If the token is valid, the middleware decodes it, extracts the user ID, and attaches it to the request object for further use in downstream middleware or route handlers.

## Usage

The `auth` middleware function should be applied to routes or groups of routes that require authentication.

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

## Middleware Function


The `auth` middleware function performs the following steps:

1. Extracts the JWT token from the 'Authorization' header.
2. Verifies the token's validity using the provided secret key.
3. Decodes the token to retrieve the user ID.
4. Attaches the user ID to the request object as `req.token`.
5. Calls the next middleware or route handler if authentication is successful.

### Custom Request Interface

The `CustomRequest` interface extends the Express `Request` interface to include the `token` property.

### Error Handling

If the token is missing or invalid, the middleware responds with a 401 status code and the message "Please authenticate."

## Notes

- Ensure that the `auth` middleware is appropriately placed in the middleware stack before routes that require authentication.
- The `SECRET_KEY` should be securely stored, and the implementation should be modified based on the chosen method for secret key management.

Feel free to customize and expand upon this documentation based on your specific application requirements.

