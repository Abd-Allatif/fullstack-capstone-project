# GiftLink

[![CI/CD](https://github.com/Abd-Allatif/full-stack-GiftLink/actions/workflows/main.yml/badge.svg)](https://github.com/Abd-Allatif/full-stack-GiftLink/actions/workflows/main.yml) [![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-6.8-47A248?logo=mongodb&logoColor=white)

GiftLink is a full-stack gift and household-item discovery application. Users can register and log in, browse available gifts, search using text and filters, and view item details. The project includes a React frontend, an Express/MongoDB backend, a JSON-to-MongoDB seed utility, and a separate sentiment-analysis service built with Natural.

## Tech stack

### Frontend

- React 18.2 with Create React App (`react-scripts` 5.0.1)
- React Router DOM for client-side routing
- React Bootstrap and Bootstrap 5 for UI components and styling
- React Datepicker
- Fetch API for backend requests

### Backend

- Node.js and Express 4.18
- MongoDB Node.js driver 6.8
- JSON Web Tokens (`jsonwebtoken`) for authentication tokens
- `bcryptjs` for password hashing
- `express-validator` for request validation support
- CORS for cross-origin requests
- Pino, `pino-http`, and `pino-pretty` for logging
- Nodemon for development

### Data and supporting services

- MongoDB database named `giftdb`
- `giftlink-backend/util/import-mongo` for loading `gifts.json` into MongoDB
- Optional sentiment service using `natural` and the AFINN sentiment lexicon
- GitHub Actions for JavaScript linting and frontend builds

## Features

- User registration with hashed passwords
- User login with JWT generation
- User profile-name update endpoint
- Gift catalogue retrieval
- Gift lookup by ID
- Gift search by name, category, condition, and maximum age
- React pages for the home, login, registration, search, profile, and item-detail experiences
- Responsive UI using Bootstrap and React Bootstrap
- MongoDB seed data import that avoids inserting duplicate catalogue data
- Structured server-side logging with Pino
- Standalone sentiment-analysis endpoint for classifying text as positive, neutral, or negative
- CI checks for backend JavaScript linting and frontend production builds

## Project structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   └── workflows/main.yml    # Lint and frontend build workflow
├── giftlink-backend/
│   ├── app.js                # Express application and route registration
│   ├── logger.js              # Shared Pino logger configuration
│   ├── models/db.js           # MongoDB connection and giftdb selection
│   ├── routes/
│   │   ├── authRoutes.js      # Registration, login, and profile update routes
│   │   ├── giftRoutes.js      # Gift listing, details, and insertion routes
│   │   └── searchRoutes.js    # Filtered gift search route
│   └── util/import-mongo/
│       ├── gifts.json         # Seed gift documents
│       └── index.js           # MongoDB seed/import utility
├── giftlink-frontend/
│   ├── public/                # Static HTML, images, icons, and backgrounds
│   └── src/
│       ├── App.js             # React routes and application shell
│       ├── config.js          # Backend URL configuration
│       ├── context/            # Authentication context
│       └── components/         # Page and navigation components
├── sentiment/
│   ├── index.js               # Optional sentiment-analysis HTTP service
│   └── package.json            # Sentiment service dependencies
├── LICENSE                    # Apache License 2.0
└── README.md
```

### Architectural notes

- The frontend and backend are intentionally separate Node.js applications with independent `package.json` files.
- The backend keeps a cached MongoDB database handle in `models/db.js` and uses the fixed application port `3060`.
- Gift seed data belongs to the backend utility because it is imported into the `giftdb.gifts` collection. The importer inserts data only when the collection is empty.
- The sentiment service is independent of the main backend and defaults to port `3000`; run it separately if it is needed.
- Authentication tokens are stored and consumed by the frontend through browser session storage. The API currently generates JWTs; route-level authorization middleware is not defined in the checked-in route files.

## Prerequisites

- Node.js and npm. Node.js 14 is used by the repository CI workflow; a current LTS release may also work, but Node.js 14 is the CI-compatible baseline.
- A running MongoDB instance reachable using a MongoDB connection URI.
- Git.
- Optional: a MongoDB shell or GUI if you want to inspect the `giftdb` database manually.

## Installation and setup

### 1. Clone the repository

```bash
git clone https://github.com/Abd-Allatif/full-stack-GiftLink.git
cd full-stack-GiftLink
```

### 2. Configure and install the backend

```bash
cd giftlink-backend
cp .env.sample .env
npm install
```

Edit `giftlink-backend/.env` and provide a MongoDB URI and a strong JWT secret. The backend uses the `giftdb` database automatically.

### 3. Load the sample gift data

The importer has its own dependencies and environment file:

```bash
cd util/import-mongo
cp .env.sample .env
npm install
npm start
cd ../..
```

The importer reads `gifts.json`, connects to `giftdb`, and inserts the documents into the `gifts` collection only when that collection is empty. Set `MONGO_URL` in this utility's `.env` to the same MongoDB instance used by the backend.

### 4. Configure and install the frontend

In a separate terminal:

```bash
cd giftlink-frontend
cp .env.sample .env
npm install
```

Set `REACT_APP_BACKEND_URL` to the backend origin, for example `http://localhost:3060`.

### 5. Optional sentiment service

If you want to run the sentiment endpoint:

```bash
cd sentiment
npm install
npm start
```

The service listens on `PORT` when supplied, or on port `3000` by default.

## Environment variables

Do not commit real credentials or secrets. Use the sample files as templates.

| Location | Variable | Required | Description |
| --- | --- | --- | --- |
| `giftlink-backend/.env` | `MONGO_URL` | Yes | MongoDB connection URI used by the API; the application selects the `giftdb` database. |
| `giftlink-backend/.env` | `JWT_SECRET` | Yes | Secret used to sign authentication JWTs. |
| `giftlink-backend/util/import-mongo/.env` | `MONGO_URL` | Yes | MongoDB connection URI used by the seed importer. |
| `giftlink-backend/util/import-mongo/.env` | `DATASRC` | Present in sample; importer currently reads `gifts.json` directly | Seed data source setting documented by the importer sample configuration. |
| `giftlink-frontend/.env` | `REACT_APP_BACKEND_URL` | Yes | Base URL used by the React application when calling the backend API. |
| `sentiment/.env` | `PORT` | No | Port for the sentiment service; defaults to `3000`. |

## Running the project

Start the backend from `giftlink-backend`:

```bash
npm start       # production-style Node process
npm run dev     # Nodemon development process
```

The backend listens on `http://localhost:3060`.

Start the frontend from `giftlink-frontend`:

```bash
npm start
```

Create a production frontend build with:

```bash
npm run build
```

Run the optional sentiment service from `sentiment`:

```bash
npm start
```

## API documentation

The backend exposes JSON APIs under `http://localhost:3060`.

### Health/root endpoint

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Returns a simple server-status response. |

### Gifts

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/gifts` | Returns all documents in the `gifts` collection. |
| `GET` | `/api/gifts/:id` | Returns one gift whose `id` matches the route parameter. |
| `POST` | `/api/gifts` | Inserts the JSON request body as a new gift document. |

### Search

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/search` | Searches gifts using optional `name`, `category`, `condition`, and `age_years` query parameters. `name` is a case-insensitive partial match; `age_years` applies a less-than-or-equal-to filter. |

Example:

```bash
curl "http://localhost:3060/api/search?name=table&category=Living&condition=Like%20New&age_years=6"
```

### Authentication and profile

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Creates a user with `email`, `firstName`, `lastName`, and `password`, then returns a JWT and email. |
| `POST` | `/api/auth/login` | Authenticates a user with email and password, then returns a JWT and basic user information. |
| `PUT` | `/api/auth/update` | Updates the user's first name. The user's email is read from the `email` request header and the new name from the request body. |

### Sentiment service

The optional standalone service exposes:

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/sentiment?sentence=<text>` | Returns a sentiment score and `positive`, `neutral`, or `negative` classification. |

## Available scripts

### `giftlink-backend`

| Command | Description |
| --- | --- |
| `npm start` | Starts `app.js`. |
| `npm run dev` | Starts `app.js` with Nodemon. |
| `npm test` | Runs Mocha; no test files are included in the repository tree. |

### `giftlink-frontend`

| Command | Description |
| --- | --- |
| `npm start` | Starts the Create React App development server. |
| `npm run build` | Creates an optimized production build. |
| `npm test` | Runs the Create React App test runner. |
| `npm run eject` | Ejects Create React App configuration; this is irreversible. |

### `giftlink-backend/util/import-mongo`

| Command | Description |
| --- | --- |
| `npm start` | Runs the MongoDB seed importer. |
| `npm test` | Placeholder script that exits with an error because no importer tests are configured. |

### `sentiment`

| Command | Description |
| --- | --- |
| `npm test` | Placeholder script that exits with an error because no sentiment tests are configured. |

## Testing and quality checks

The backend declares Mocha, Chai, Sinon, Supertest, and Testing Library-related development dependencies, while the frontend uses the Create React App test runner and Testing Library packages. No test files are present in the repository tree, so the commands below are available test entry points rather than a documented passing test suite:

```bash
cd giftlink-backend && npm test
cd giftlink-frontend && npm test
```

The GitHub Actions workflow currently runs:

- JSHint against selected backend JavaScript files using Node.js 14.
- `npm install` and `npm run build` for the frontend.

## Deployment

No Dockerfile, hosting configuration, or release/deployment manifest is included. The checked-in GitHub Actions workflow provides CI checks on pushes and pull requests targeting `main` or `master`; it does not deploy the application.

For a production deployment, host the React build output from `giftlink-frontend/build`, run the Express API as a Node.js service, provision MongoDB, and configure the environment variables in the deployment platform. Keep the frontend's `REACT_APP_BACKEND_URL` pointed at the deployed API origin.

## Contributing

1. Fork the repository and create a focused feature or fix branch.
2. Keep frontend, backend, and utility changes scoped to the relevant package.
3. Do not commit `.env` files, credentials, or generated build output.
4. Run the relevant build, test, and lint commands locally.
5. Open a pull request with a clear description, testing notes, and any required configuration changes.

## License

This project is licensed under the [Apache License 2.0](LICENSE). Copyright notice and redistribution requirements are defined in the repository's `LICENSE` file.
