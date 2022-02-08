const express = require('express'); // Import express module 
const router = express.Router(); // importing the method router for easy manipulations pf file path 
const auth = require('../middleware/auth')
const userController = require("../controllers/usersController")
const user = require('../models/user')

// to get the landing page
router.get('/', (req, res) => res.send('This is the landing page'));

router.post('/user/register', userController.register);
router.put('/user/profile/update/:id',auth, userController.updateUserProfile);
router.patch('/user/profile/updatePassword/:id',auth, userController.changePassword);
router.post('/user/login', userController.login);

router.put('user/verify/:token',userController.verifyUser)


module.exports = router;
