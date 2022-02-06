const postModel = require("../models/post");
const { v4: uuidv4 } = require('uuid');
let data = {}

//Create a new post and save user data to datbase
exports.create = async (req, res) => {
    const { title, body, comment } = req.body;
    const _id = uuidv4();
    const post = await new postModel({
        _id,
        title,
        body,
        comment
    }).save();
    data.post = post
    data.message = ("Success!!! blog post uploaded...")
    data.status = 200
    return res.json(data)
};

//Retrieve blog post from the database.
exports.viewPost = async (req, res) => {
     try {        
        const {id} = req.params
        let post = await postModel.findById(id).exec();
        return res.status(200).json(post)   
    } catch (error) {
        return Promise.reject(error);
    }
};

//Update blog post
exports.updatePost = async (req, res) => {
    try {
        const { title, body, comment} = req.body;
        const {id} = req.params
        let post = await postModel.findById(id).exec();
        post.set({
            title,
            body,
            comment
        });
        await post.save();

        data.post = post
        data.message = ("Success!!! post updated...")
        data.status = 200
        return res.json(data)   
    } catch (error) {
        return Promise.reject(error);
    }
};

//View all blog posts
exports.ViewAllPost = async (req, res) => {
    try {
        const posts = await postModel.find();
        return res.status(200).json(posts)
       
    } catch (error) {
        return Promise.reject(error);
    }
};

// To delete blog post
exports.deletePost = async (req, res) => {
    try {
        const { title, body, comment} = req.body;
        const {id} = req.params
        let post = await postModel.findByIdAndDelete(id).exec();
        // await post.save();
        return res
            .status(200)
            .json({ message: "blog post deleted successfully" })
    } catch (error) {
        return Promise.reject(error);
    }
};