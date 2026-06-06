# GitHub Profile Analyzer API

A backend service built with Node.js, Express, and MySQL that fetches user data from the public GitHub API and stores insights in a relational database.

## Tech Stack
- Node.js
- Express.js
- MySQL (mysql2)
- Axios

## Setup Instructions

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and add the following variables:
```env
   PORT=5000
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=github_analyzer

4. Run the SQL schema provided below in your MySQL database.
5. Run the server with `npm start`.
   npm start

## SQL Schema

```sql
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    profile_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);