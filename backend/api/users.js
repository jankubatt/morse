const express = require('express');
const router = express.Router();
let mysql = require('mysql');
let config = require('../config/database.config');
let db = mysql.createConnection(config);

router.get("/", (req, res) => {
    let sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

module.exports = router;