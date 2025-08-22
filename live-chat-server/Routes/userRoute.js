const express = require('express');
const { loginController, registerController, fetchAllUsersCTRL } = require('../Controllers/userCtcl');
const { protect } = require('../middlewares/userAuth-middleware');
const Router = express.Router()

Router.post('/login', loginController); // http:localhost:9000/user/login
Router.post('/Register', registerController);

Router.get('/allUser', protect, fetchAllUsersCTRL)

module.exports = Router;