const generateTokenAndSetCookie = require("../Config/generateToken");
const User = require("../Models/user.model");
const bcrypt = require("bcrypt")

const signup = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: "password don't match"
            })
        }

        const user = await User.findOne({ userName })
        if (user) {
            return res.status(400).json({
                error: "username already exists"
            })
        }

        // https://avatar.iran.liara.run/public/boy?username=${username}
        // https://avatar.iran.liara.run/public/girl?username=${username}

        const hashedPassword = await bcrypt.hash(password, 10)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            gender,
            profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        })

        // const payload = {
        //     fullName: newUser.fullName,
        //     userName: newUser.userName,
        //     gender: newUser.gender,
        //     password: newUser.password
        // }

        if (newUser) {
            const token = generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                password: hashedPassword,
                gender: newUser.gender,
                token: token
            })
        }
        else {
            res.status(400).json({
                error: "invalid user data"
            })
        }
    } catch (error) {
        console.log("error in signup controller", error.message)
        res.status(500).json({
            error: "internal server error",
            message: error.message,
        })
    }

}

const login = async (req, res) => {
    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({
                error: "Invalid username or password"
            })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully" })
    } catch (error) {
        console.log("error in logged out controller", error.message)
        res.status(500).json({
            error: "internal server error"
        })
    }
}

module.exports = { login, logout, signup }