## Project Description 
This is a Node.js project written in TypeScript, using PostgreSQL as the database. The project includes functionality to connect to a PostgreSQL database, fetch data from an external API, filter and cache the data, and save it to the database.

## Clone the repo
Download or clone this repository to your local machine.<br>
https://github.com/Shanmukhi12/mgt.git

## Install dependencies
Run 'npm install'

## Set up the database
Go to src/index.ts <br>
once you set up the database update the following according to your database connection: <br>

1. type
2. host
3. port
4. username
5. password 
6. database

## Run the project
Go to directory using cd mgt<br>
Run the command 'npm start'

## Usage
Once the project is running, it will start an Express server listening on the specified port (default is 8004). The project exposes two API endpoints: <br>

/api/quotes: POST endpoint to fetch quotes from an external API, filter them based on user details, cache the filtered quotes, and save them to the PostgreSQL database. <br>
/api/quotes/best-three: GET endpoint to fetch the best three quotes from the database. <br>
To use the API endpoints, send requests to http://localhost:8004/api/quotes and http://localhost:8004/api/quotes/best-three. <br>
Json-server runs on port 3001 <br>
<br>
Test on postman
