const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateTokenAndSetCookie = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET,
            {
                expiresIn: "15d"
            })


        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent xss attack  cross-site scripting attack
            sameSite: "strict", // CSRF attacks cross-site request foregery attack
            secure:process.env.NODE_ENV!=="development",
        })
        return token
    } catch (error) {
        console.log("error encounter in the generatetoken")
        res.json({
            error: error.message
        })
    }
}

module.exports = generateTokenAndSetCookie 