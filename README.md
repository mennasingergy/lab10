# Lab 10 — Performance Testing with k6

Practice load and spike testing against a local Express users API using k6.

## Requirements

- Node.js and npm
- The k6 CLI installed separately and available in your terminal (`k6 version`)
- Port 3000 available for the API

`npm install` installs the API dependencies; it does not install the k6 CLI. k6 runs the performance scripts, rather than Node.js or Jest.

## Setup and start the API

From the project directory:

```bash
npm install
npm start
```

The API runs at **http://localhost:3000**. Keep this terminal running while testing. Nodemon restarts the server when its source changes. Press `Ctrl+C` to stop it.

In a second terminal, confirm that the endpoint responds:

```bash
curl http://localhost:3000/users
```

Users are stored in memory. Restarting the API restores the initial three users; no database or environment file is required.

## Project files

| File | Purpose |
| --- | --- |
| `server.js` | Express API with user CRUD routes. |
| `tests/users.load.js` | Sustained load test with 10 virtual users for 30 seconds. |
| `tests/users.spike.js` | Traffic spike scenario ramping to 500 virtual users. |
| `tests/test.spec.js` | POST exercise that needs correction before use. |
| `package.json` | API dependencies and npm scripts. |

## API routes

| Method | Route | Successful status | Purpose |
| --- | --- | --- | --- |
| GET | `/users` | 200 | List users. |
| GET | `/users/:id` | 200 | Get a user. |
| POST | `/users` | 201 | Create a user using JSON fields `name` and `email`. |
| PUT | `/users/:id` | 200 | Update a user's name or email. |
| DELETE | `/users/:id` | 204 | Delete a user. |

Requests for a missing user return 404. There is no `/products` route.

## Run the load test

With the API running, open another terminal in the project directory:

```bash
npm run load
```

Equivalent command:

```bash
k6 run tests/users.load.js
```

The test runs **10 virtual users (VUs) for 30 seconds**. Each VU repeatedly requests `GET /users`, checks for status 200, and sleeps for one second. VUs represent concurrent test workers; 10 VUs does not mean exactly 10 requests per second because each iteration also includes request execution time.

For a quick endpoint check using the same assertions and thresholds:

```bash
k6 run --vus 1 --iterations 1 tests/users.load.js
```

This short check verifies connectivity and basic behavior; it does not measure sustained performance.

## Run the spike test

```bash
k6 run tests/users.spike.js
```

The configured stages are:

| Stage | Duration | Target VUs |
| --- | --- | --- |
| Initial ramp | 2 seconds | 10 |
| Spike | 2 seconds | 500 |
| Recovery ramp | 2 seconds | 10 |

Each stage ramps toward its target rather than holding that count for the entire stage. The configured stages total six seconds; graceful completion of iterations can add time. Each iteration requests `GET /users`, checks for status 200, and sleeps for one second.

## Checks, thresholds, and results

Both GET scenarios define these pass criteria:

| Metric | Threshold | Meaning |
| --- | --- | --- |
| `http_req_duration` | `avg<300` | Average request duration must be below 300 ms. |
| `http_req_duration` | `p(95)<500` | The 95th percentile request duration must be below 500 ms. |
| `http_req_failed` | `rate<0.01` | Fewer than 1% of requests may fail. |
| `checks` | `rate==1` | Every check must pass; these tests check status 200. |

A fast error response can pass the timing thresholds while failing the status check and failure-rate threshold. Always inspect all results. k6 exits with a nonzero status when a threshold fails. A failed check alone does not make a run fail unless a threshold enforces it, as `checks: ['rate==1']` does here.

These tests measure response behavior and performance; they do not produce JavaScript code coverage.

## POST exercise

`tests/test.spec.js` currently posts to `/users` without a JSON body and expects status 200. The API reads `req.body.name` and `req.body.email`, and successful creation returns **201**. Before running that exercise, provide a JSON payload and content-type header, and change the status assertion to 201.

The exercise has 100 VUs for 30 seconds and no pass/fail thresholds. Repeated successful POST requests add users to the in-memory list. Restart the API to reset the data afterward.

## Troubleshooting

- **Connection refused:** Start the API before running k6 and confirm it listens on port 3000.
- **404 responses:** Check the requested route. These GET tests use `/users`.
- **Unexpected responses:** Confirm another application is not occupying port 3000.
- **`k6: command not found`:** Install the k6 CLI and ensure it is on your terminal's PATH.
- **Failed performance thresholds:** Inspect the failed metric and API logs. The spike test also depends on your machine's available resources.

## Git

`node_modules/` and `.history/` are ignored. Keep generated dependencies and editor history out of commits.
