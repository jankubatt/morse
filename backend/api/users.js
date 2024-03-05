const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let mysql = require('mysql');
let config = require('../config/database.config');
let db = mysql.createConnection(config);
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, res) => {
    let token = req.body.token;

    let sql = 'SELECT * FROM users WHERE authToken = ?';
    let values = [token];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result.length === 0) {
            res.sendStatus(401);
            return;
        }

        res.send(result[0]).status(200);
    });
});

router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password, 10);
    let email = req.body.email;
    let country = req.body.country;

    if (email === '') email = null;
    if (country === 'null') country = null;

    let sql = 'SELECT * FROM users WHERE username = ?';
    let values = [username];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result.length > 0) {
            res.sendStatus(400);
            return;
        }

        sql = 'INSERT INTO users (username, password, email, country) VALUES (?, ?, ?, ?)';
        values = [username, password, email, country];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            console.log(result);
            res.sendStatus(200);
        });
    });
});

router.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = 'SELECT * FROM users WHERE username = ?';
    let values = [username];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result.length === 0) {
            res.sendStatus(401);
            return;
        }

        if (!bcrypt.compareSync(password, result[0].password)) {
            res.sendStatus(401);
            return;
        }

        let token = uuidv4();

        let sql = `UPDATE users SET authToken = ? WHERE username = ?`;
        let values = [token, username];

        db.query(sql, values, (err, result) => {
            res.send(token).status(200);
        });
    });
});

module.exports = router;