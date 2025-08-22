const userModel = require('../models/userModel')
const expressAsyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//registeration
const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    //check for all fields
    if (!name || !email || !password) {
        res.send(400)
        throw Error("All necessary input fields have not been filled")
    }

    //pre-existing user
    const userExist = await userModel.findOne({ email })

    if (userExist) {
        throw new Error("User already Exists")
    }

    //userName already taken
    const userNameExist = await userModel.findOne({ name })
    if (userNameExist) {
        throw new Error('userName is already taken')
    }

    //hashed password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
        return res.status(500).json({
            success: false,
            messages: 'error in building hashed password',
            message: error.message0
        })
    }


    //create an entry in the db
    const user = await userModel.create({ name, email, password: hashedPassword })

    const payload = {
        id: user._id,
        email: user.email,
        name: user.name
    }

    if (user) {
        const token = generateToken(payload)
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.cookie("token", token, options).status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            password: hashedPassword,
            token: token,
        })
    }
    else {
        res.status(400)
        console.log(error.message)
        throw new Error("registration error")
    }
})

//login
const loginController = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'plz fill all the field'
            })
        }

        let user = await userModel.findOne({ email })
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'account does not exist'
            })
        }




        if (await bcrypt.compare(password, user.password)) {
            user.password = undefined;

            const payload = {
                id: user._id,
                email: user.email,
                name: user.name
            }
            console.log(payload)

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            const token = generateToken(payload)
            res.cookie("token", token, option).status(200).json({
                success: true,
                message: 'login successfully',
                user: user,
                token: token
            })
        }

    } catch (err) {
        console.log(err)
    }

})
const fetchAllUsersCTRL = async (req, res) => {
    try {
        const token = await req.cookies.token
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const email = decode.email
        const allusers = await userModel.find({ email: { $ne: email } })
        res.status(200).json({
            success: true,
            message: 'fetchuser is complete',
            users: allusers
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}



module.exports = { loginController, registerController, fetchAllUsersCTRL }