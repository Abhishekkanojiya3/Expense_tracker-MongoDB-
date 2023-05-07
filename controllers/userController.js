const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const sequelize = require("../util/database");
// const Sib = require("sib-api-v3-sdk");

function generateAccessToken(id, email) {
    return jwt.sign({ userId: id, email: email }, process.env.TOKEN);
}

const isPremiumUser = async(req, res, next) => {
    try {
        if (req.user.isPremiumUser) {
            return res.json({ isPremiumUser: true });
        }
    } catch (error) {
        console.log(error);
    }
};

const getLoginPage = async(req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
    } catch (error) {
        console.log(error);
    }
};
const postUserSignUp = async(req, res, next) => {
    try {
        const { userName, email, phoneNumber, password } = req.body
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(error, hash) => {
            if (error) {
                console.log("error in password", error)
            } else {
                await User.create({
                    userName,
                    email,
                    phoneNumber,
                    password: hash
                })
            }
        })
        res.json({ success: true })
    } catch (err) {
        console.log(err)
    }

}


const postUserLogin = async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        await User.findOne({ email: email }).then(async(user) => {
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    return res.status(200).json({
                        success: true,
                        message: "Login Successful!",
                        token: generateAccessToken(user.id, user.email),
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Password Incorrect!",
                    });
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User doesn't Exists!",
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const getAllUsers = async(req, res, next) => {
    try {
        User.find()
            .select({ userName: 1, totalExpenses: 1, _id: 0 })
            .sort({ totalExpenses: -1 })
            .then((users) => {
                const result = users.map((user) => ({
                    userName: user.userName,
                    totalExpenses: user.totalExpenses,
                }));
                res.send(JSON.stringify(result));
            });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    generateAccessToken,
    getLoginPage,
    postUserLogin,
    postUserSignUp,
    isPremiumUser,
    getAllUsers,
};