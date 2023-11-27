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


After that is is also advised to change the example file and rename them without example at the end, at the moment there 3 files that has to change.
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

# API Documentation

### Create Event

Create a new event by making a POST request to the following endpoint:
**Needs to be logged in/auth token**

```http
POST /:orgId/
```
#### Request Body
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

Status Code: **201 Created**

Response Body: The created event object with an additional **id** field.

### Get All Events
Retrieve all events for a specific organization by making a **GET** request to the following endpoint:

```http
GET /:orgId/
```
#### Response
**Status Code: 200 OK** if the event is found.
### Get Event by ID
Retrieve a specific event by its ID for a given organization by making a **GET** request to the following endpoint:

```http
GET /:orgId/:id
```
#### Response
**Status Code: 200 OK** if the event is found, **404 Not Found** otherwise.

### Update Event
Update an existing event by making a **PUT** request to the following endpoint:

```http
PUT /:orgId/:id
```
#### Request Body
**title** (string, optional): The updated title of the event.

**start** (date, optional): The updated start date and time of the event in ISO format.

**end** (date, optional): The updated end date and time of the event in ISO format.

**description** (string, optional): The updated description of the event.

**Example:**

```typescript
// Update the event's title
const updatedEvent: Event = {
  title: "Updated Title",
};
```
#### Response
**Status Code: 200 OK** if the event is updated successfully, **404 Not Found** otherwise.
**Response Body:** The updated event object.
### Delete Event
Delete a specific event by its ID for a given organization by making a **DELETE** request to the following endpoint:

```http
DELETE /:orgId/:id
```
#### Response
**Status Code: 204 No Content** if the event is deleted successfully, **404 Not Found** otherwise.


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
