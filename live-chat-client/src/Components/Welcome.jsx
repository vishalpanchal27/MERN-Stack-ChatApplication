import React, { useState } from 'react'
import mainImage from '../assets/mainImage.jpg';
import './MainContainer.css'
import { Button, TextField } from '@mui/material';
import LoginPage from './LoginPage';
import { Outlet } from 'react-router-dom';
import SignUpPage from './SignUpPage';

const Welcome = () => {
    const [logedin, setLogedIn] = useState(false)
    console.log(logedin)
    return (
        <div className='welcome-container'>
            <div className="welcome-image-container">
                <img className='welcome-image' src={mainImage} alt="" />
            </div>
            {
                logedin &&
                <LoginPage setLogedIn={setLogedIn} />
            }
            {
                !logedin &&
                <SignUpPage setLogedIn={setLogedIn} />
            }

        </div>
    )
}

export default Welcome
