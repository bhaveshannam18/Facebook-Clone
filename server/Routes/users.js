const router = require("express").Router();
const bcrypt = require("bcrypt");
const { findById } = require("../models/user");
const User = require("../models/user");

//UPDATE USER DETAILS
router.put("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            } catch (err) {
                res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
        } catch (err) {
            res.status(500).json(err);
        }
        res.status(200).json("User Updated Successfully");
    }else{
        res.status(403).json("You can update only your account");
    }
})

//DELETE USER
router.delete("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User Deleted Successfully");
        } catch (err) {
            res.status(500).json(err);
        }        
    }else{
        res.status(403).json("You can delete only your account");
    }
})

//GET ONE USER
router.get("/",async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
        try {
            const user = userId 
            ? await User.findById(userId)
            :await User.findOne({username:username});
            const {password,updatedAt,...others} = user._doc;
            res.status(200).json(others);
        } catch (err) {
            res.status(500).json(err);
        }        
    }
)

// router.get("/allusers",async (req,res)=>{
//     const userId = req.query.userId;
//     const username = req.query.username;
//         try {
//             const user = userId 
//             ? await User.findById(userId)
//             :await User.findOne({username:username});
//             const {password,updatedAt,...others} = user._doc;
//             res.status(200).json(others);
//         } catch (err) {
//             res.status(500).json(err);
//         }        
//     }
// )

//GET FRIENDS


router.get("/friends/:userId",async (req,res)=>{
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId=>{
                return User.findById(friendId);
            })
        )
        let friendList = [];
        friends.map(friend=>{
            const {_id,username,profilePic} = friend;
            friendList.push({_id,username,profilePic});
        })
        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err);
    }
})

//FOLLOW A USER
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push :{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("User has been followed");
            }
            else{
                res.status(403).json("You already follow this user");
            }                
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
    res.status(403).json("You cannot follow Yourself");   
}
}
)

//UNFOLLOW A USER
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull :{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("You dont follow this user");
            }                
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
    res.status(403).json("You cannot unfollow Yourself");   
}
}
)

router.get("/suggestedfriends",async (req,res)=>{
    try {
        const allUsers = await User.find();
        //console.log(allUsers);
        let friendList = [];
        allUsers.map(oneUser=>{
            const {_id,username,profilePic} = oneUser;
            friendList.push({_id,username,profilePic});
        })
        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router