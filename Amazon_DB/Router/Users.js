const express = require('express');
const router = express.Router();
const usersController = require('../Controller/users');


router.post('/Register', usersController.UserRegistartion);
router.post('/Login', usersController.userLogin);
//router.get('/', usersController.validateToken, usersController.getAllUsers);

module.exports = router;