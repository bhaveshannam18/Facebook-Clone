const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user");

//Create Post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);  
    } catch (err) {
        res.status(400).json(err);
    } 
})

//Update Post
router.put("/:id",async (req,res)=>{
    const postId = req.params.id;
    const currentUserId = req.body.userId;
    try {
        const currentPost = await Post.findById(postId);
        if(currentUserId!==currentPost.userId){
            res.status(403).json("You can update only your post");
        }
        else{
            try {
                const newPost = await Post.findByIdAndUpdate(postId,{
                    $set:req.body
                })
                res.status(200).json(newPost);  
            } catch (err) {
                res.status(500).json(err);
            } 
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//Delete Post
router.delete("/:id",async (req,res)=>{
    const postId = req.params.id;
    const currentUserId = req.body.userId;
    try {
        const currentPost = await Post.findById(postId);
        if(currentUserId!==currentPost.userId){
            res.status(403).json("You can delete only your post");
        }
        else{
            try {
                const newPost = await Post.findByIdAndDelete(postId);
                res.status(200).json("Post deleted successfully");  
            } catch (err) {
                res.status(500).json(err);
            } 
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//Like/Dislike a Post
router.put("/:id/like",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("post liked");
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("post unliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get a Post
router.get("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get a Timeline Posts
router.get("/timeline/:userId",async (req,res)=>{
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPost = await Promise.all(
            currentUser.followings.map(friendId=>{
                return Post.find({userId:friendId})
            })
        );
        res.status(200).json(userPosts.concat(...friendPost));
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get Users All Posts
router.get("/profile/:username",async (req,res)=>{
    try {
        const user = await User.findOne({ username:req.params.username }); 
        const posts = await Post.find({ userId:user._id }); 
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;