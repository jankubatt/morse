require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require("axios");

const app = express();

const server = require('http').createServer(app);

app.use(
	cors({
	  origin: "*",
	  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	  preflightContinue: false,
	  credentials: true
	})
  );

app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());

const users = require('./api/users')

app.use('/api/users', users)

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

// app.use(express.static(path.join(__dirname, 'build')));


// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
