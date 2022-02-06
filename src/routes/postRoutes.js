const express = require('express'); // Import express module 
const router = express.Router(); // importing the method router for easy manipulations pf file path 

const postController = require('../controllers/postController')

router.post('/post', postController.create); // creates a new blog post
router.get('/post/:id', postController.viewPost); // reads saved blogpost from database
router.put('/post/update/:id', postController.updatePost); // updates blog post in database
router.get('/posts', postController.ViewAllPost);// reads all blog posts from the database
router.delete('/post/delete/:id', postController.deletePost); // deletes post with id in parameter.
module.exports = router;