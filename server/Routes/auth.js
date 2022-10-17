const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

//LOGIN
router.post("/login",async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(400).json("Wrong Username");

        const validatePassword = await bcrypt.compare(req.body.password,user.password);
        !validatePassword && res.status(404).json("Wrong Password");

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
})



module.exports = router