const jwt = require("jsonwebtoken")
require('dotenv').config()
exports.protect = async (req, res, next) => {
    const token = req.cookies.token
    // console.log(token)

    if (!token) {
        // console.log(token)
        return res.status(201).json({
            success: false,
            message: 'token is missing'
        })
    }

    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode)
        req.user = decode
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        })
    }
}