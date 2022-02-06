// import all the necessary modules and methods.
require('dotenv').config();
const express = require("express");
const app = express();
const routes = require('./src/routes')
const port = process.env.PORT
// const mongoose = require("./src/config/db.config");


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// app.use('/', require('./src/routes/user'));
routes(app)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

module.exports = app;