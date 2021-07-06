require('dotenv').config()

const UserController = require('../controllers/user')

const express = require('express');

const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin)

module.exports = router;