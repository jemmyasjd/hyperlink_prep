const express = require('express');
const path = require('path');
// const globals = require('../../../config/constant');
const user_model = require('../v1/models/User-model');
const constants = require('../../config/constant')
const globals = require('../../config/constant')
const connection = require('../../config/database');

const router = express.Router(); // Create an instance of the Express Router

// Set EJS as the template engine (this should be in server.js, not here)
// app.set('view engine', 'ejs'); 

// Routes
router.get('/api_doc', (req, res) => {
    res.render(path.join(__dirname, 'view', 'api_doc.ejs'), { globals });
});

router.get('/code', (req, res) => {
    res.render(path.join(__dirname, 'view', 'reference_code.ejs'), { globals });
});

router.get('/user_list', (req, res) => {
    user_model.api_user_list((error, response) => {
        if (error) {
            console.error("Database Error:", error);
            return res.status(500).send("Error fetching user list.");
        }
        res.render(path.join(__dirname, 'view', 'user_list.ejs'), { 
            data: Array.isArray(response) ? response : [],  // Ensure data is an array
            globals,
            base_url: constants.base_url // Pass base_url to EJS
        });
    });
});

const getAppDetails = (req, res, page) => {
    let query = `SELECT * FROM tbl_app_details WHERE is_active=1 AND is_deleted=0 LIMIT 1;`;

    connection.query(query, (err, rows) => {
        if (err || rows.length === 0) {
            return res.render('error', { message: "No data found!" });
        }
        // res.render(page, { data: rows[0] });
        res.render(path.join(__dirname, 'view', page), { data: rows[0] });

    });
};


router.get('/about', (req, res) => getAppDetails(req, res, 'about'));
router.get('/terms', (req, res) => getAppDetails(req, res, 'terms'));
router.get('/policy', (req, res) => getAppDetails(req, res, 'policy'));
router.get('/privacy', (req, res) => getAppDetails(req, res, 'privacy'));


module.exports = router;