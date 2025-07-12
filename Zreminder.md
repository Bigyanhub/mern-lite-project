=============================
BACKEND DEV QUICK REFERENCE
=============================

1. COMMON HTTP STATUS CODES
---------------------------
200 OK - Request succeeded
201 Created - New resource created
204 No Content - Success, no content to send
400 Bad Request - Invalid client request
401 Unauthorized - Authentication required / failed
403 Forbidden - Authenticated but no permission
404 Not Found - Resource does not exist
409 Conflict - Duplicate or conflicting resource
422 Unprocessable Entity - Validation failed
500 Internal Server Error - Server error
503 Service Unavailable - Server temporarily unavailable

2. EXPRESS RESPONSE EXAMPLES
-----------------------------
Send JSON success:
res.status(200).json({ success: true, data: result });

Send JSON error:
res.status(400).json({ success: false, message: "Bad input" });

3. COMMON SQL COMMANDS
----------------------
SELECT * FROM users;
INSERT INTO users (name, email) VALUES (?, ?);
UPDATE users SET name = ? WHERE id = ?;
DELETE FROM users WHERE id = ?;

Use parameterized queries to avoid SQL injection!

4. REST API BASICS
------------------
GET - Read data
POST - Create data
PUT - Replace data
PATCH - Update partial data
DELETE - Remove data

Use plural nouns for resources:
GET /users
GET /users/:id
POST /users

5. AUTHENTICATION BASICS
-------------------------
JWT - JSON Web Token, used for stateless auth
Typical flow: login → receive token → send token in headers → access protected routes
Common status codes: 401 Unauthorized, 403 Forbidden

6. EXPRESS MIDDLEWARE YOU MAY USE
----------------------------------
express.json() - parse JSON bodies
cors() - enable Cross-Origin Resource Sharing
morgan() - HTTP request logger
Custom error handler middleware

7. ERROR HANDLING TIPS
----------------------
Use try/catch with async/await for async code
Send meaningful HTTP status codes on errors
Log errors internally, send generic message to users

8. USEFUL NPM PACKAGES
----------------------
bcrypt - password hashing
jsonwebtoken - JWT creation & verification
dotenv - environment variables management
cors - handle cross-origin requests

9. JAVASCRIPT REMINDERS
------------------------
Promises and callbacks for async code
async/await syntax for cleaner async code
Handle errors inside async functions with try/catch

10. SECURITY BEST PRACTICES
----------------------------
Always sanitize and validate user input
Use parameterized queries to avoid SQL injection
Hash passwords before storing them
Avoid leaking detailed errors to users

-----------------------------
Keep adding more as you learn!
