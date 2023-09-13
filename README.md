# ImageSage API

The ImageSage API is a service designed to allow users to search for images, mark images as favorites, and keep track of downloaded images. <br> It is built using Node.js with Express for handling HTTP requests, MongoDB for data storage, and integrates with Pixabay API for image search functionality.

API is deployed at : https://imagesage.onrender.com (root route)

## Routes
### 1. `POST /favorites`

Allows users to add images to their list of favorites.

- **Request Body**:
  - `email` (string): User's email address.
  - `imageId` (string): ID of the image being favorited.

- **Response**:
  - `message` (string): Confirmation message.

### 2. `POST /downloads`

Allows users to mark images as downloaded.

- **Request Body**:
  - `email` (string): User's email address.
  - `imageId` (string): ID of the downloaded image.

- **Response**:
  - `message` (string): Confirmation message.

### 3. `POST /checkfav`

Checks if an image is in a user's list of favorites.

- **Request Body**:
  - `email` (string): User's email address.
  - `imageId` (string): ID of the image being checked.

- **Response**:
  - Status Codes:
    - `200 OK`: Image is in favorites.
    - `404 Not Found`: User not found.

### 4. `GET /`

Endpoint to retrieve images from Pixabay based on a search query.

- **Query Parameters**:
  - `query` (string): Search query.
  - `page` (number): Page number for pagination.

- **Response**:
  - JSON object containing Pixabay API response.
  - Refer to Pixabay's API details for the format.
  - Can be directly accessed at : https://imagesage.onrender.com/ 

### 5. `GET /favorites`

Retrieves a user's list of favorite images.

- **Request Headers**:
  - `email` (string): User's email address.

- **Response**:
  - JSON object with an array of favorite image IDs.

### 6. `GET /downloads`

Retrieves a user's list of downloaded images.

- **Request Headers**:
  - `email` (string): User's email address.

- **Response**:
  - JSON object with an array of downloaded image IDs.

### 7. `GET /images/:id`

Retrieve details of a specific image by its ID.

- **URL Parameter**:
  - `id` (string): ID of the image.

- **Response**:
  - JSON object with image details.

## Setting Up

1. Install dependencies using `npm install`.
2. Create a `.env` file and define the following variables:
   - `JWKS_URI`: URL to JWKS (JSON Web Key Set) for JWT validation.
   - `AUDIENCE`: Audience for JWT validation.
   - `DB_CONNECTION`: MongoDB connection URI.
   - `PIXABAY_KEY`: API key for Pixabay API.
   - `PORT`: Port for the server to listen on.

3. Start the server using `npm start`.

## Dependencies

- `express`: Web application framework for Node.js.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing.
- `express-jwt`: Middleware for validating JWT tokens.
- `jwks-rsa`: Library for retrieving RSA JSON Web Keys.
- `axios`: Promise-based HTTP client for making requests.
- `dotenv`: Loads environment variables from a `.env` file.
- `body-parser`: Middleware for parsing JSON request bodies.
- `mongoose`: ODM library for MongoDB.

## Database

This API uses MongoDB to store user data, including favorites and downloads.

## Usage
Since it was for a personal project only the root route is free to use.
<br> You can deploy the full project using the ImageSage frontend : https://github.com/techlism/imagesage-frontend
