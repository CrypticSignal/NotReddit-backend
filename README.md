<div align="center">
  <img src="https://img.shields.io/badge/Express.js-0F9A41?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Postgres-32668E?style=for-the-badge&logo=postgresql&logoColor=FFF" alt="Postgres" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest" alt="Jest" />

# NotReddit API

A RESTful API created using Express.js and PostgreSQL, during the backend sprint of the Northcoders bootcamp.

This API is used by the frontend of NotReddit, which can be found [here](https://github.com/CrypticSignal/NotReddit-frontend).

</div>

## How do I use this API?

To use this API, you must make a request to `https://notreddit-backend.herokuapp.com/api/<endpoint>`.

A list of available endpoints, as well as example responses, can be found [here](https://notreddit-backend.herokuapp.com/api).

I recommend using the [JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh) extension for Chrome as this enables you to see the JSON responses sent by the API in a more aesthetically pleasing manner.

## Development:

If you would like to run this API locally, for development purposes or otherwise, please find instructions on how to do so below.

**Prerequisites:**

- [Node.js](https://nodejs.org/en/download/current/installed) v16.14 or newer.
- [PostgreSQL](https://www.postgresql.org/) 14 or newer.

**Getting Started:**

```
git clone https://github.com/CrypticSignal/NotReddit-backend
cd NotReddit-backend
npm install
```

In the root of the project's directory, you must create the following files:

- `.env.test`
- `.env.development`

These files must contain `PGDATABASE=<database_name>`, replacing `<database_name>` with your desired name for the test and development database, respectively.

**Setting up and seeding the database:**

```
npm run setup-dbs
npm run seed
```

This will seed the development database with the data in `/db/data/development-data`.

**Running the development server:**

```
npm run dev
```

Requests must be made to `http://localhost:9090/api/<endpoint>`. [Postman](https://www.postman.com/downloads/) and [Insomnia](https://insomnia.rest/download) are great applications for making requests.

**Testing:**

To run all tests, enter `npm test a` in the terminal.
