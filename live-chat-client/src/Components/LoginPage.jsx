import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = ({ setLogedIn }) => {

    const [data, setData] = useState({ userName: "", password: "" })
    const [loading, setLoading] = useState(false)

    const changeHandler = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const loginHandler = async () => {
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const response = await axios.post(
                "/api/auth/login",
                data,
                config
            )
            console.log(response)
            navigate('/app/welcome')
            localStorage.setItem("userData", JSON.stringify(response.data));
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }



    const navigate = useNavigate()
    return (
        <div className="welcome-loginForm">
            <p className='wel-loginText'>Login Your Account</p>
            <TextField
                required
                onChange={changeHandler}
                className='wel-idPassword'
                id="userName"
                name='userName'
                value={data.userName}
                label="User Id"
                variant="outlined" />
            <TextField
                required
                onChange={changeHandler}
                className='wel-idPassword'
                id="password"
                label="Password"
                name='password'
                value={data.password}
                type='password'
                variant="outlined" />
            <Button variant="outlined" onClick={loginHandler} >Submit</Button>
            <div>If You Don't have Account <p onClick={() => { navigate('signUpPage'); setLogedIn(false); }}> <u>Sign Up</u></p></div>
        </div>
    )
}

export default LoginPage
