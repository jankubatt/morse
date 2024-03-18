const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let mysql = require('mysql');
let config = require('../config/database.config');
let db = mysql.createConnection(config);
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, res) => {
    let token = req.body.token;
    
    if (!token) {
        res.sendStatus(400);
        return;
    }

    let sql = `SELECT users.*, COUNT(sentences.id) AS 'score' FROM users JOIN sentences ON users.id = sentences.id_user WHERE users.authToken = ?`;
    let values = [token];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result.length === 0 || result[0].authToken !== token) {
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

router.post("/sentence/done", (req, res) => {
    let id_user = req.body.id_user;
    let sentence = req.body.sentence;
    let ttc = req.body.ttc;
    let mistakes = req.body.mistakes;

    let sql = 'INSERT INTO sentences (id_user, sentence, ttc, mistakes) VALUES (?, ?, ?, ?)';
    let values = [id_user, sentence, ttc, mistakes];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    });
});

router.post("/leaderboard", (req, res) => {
    let sql = `SELECT users.*, COUNT(sentences.id) AS 'score', (SELECT MIN(ttc) FROM sentences WHERE sentences.id_user = users.id) AS 'ttc' FROM users LEFT JOIN sentences ON users.id = sentences.id_user GROUP BY users.id ORDER BY score DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.send(result).status(200);
    });
});

router.post("/edit", (req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let country = req.body.country;

    if (email === '') email = null;
    if (country === 'null') country = null;

    let sql = 'UPDATE users SET email = ?, country = ? WHERE username = ?';
    let values = [email, country, username];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    });
});

router.post("/password/change", (req, res) => {
    let password = bcrypt.hashSync(req.body.password, 10);

    let sql = 'UPDATE users SET password = ? WHERE id = ?';
    let values = [password, req.body.id_user];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    });
});

module.exports = router;