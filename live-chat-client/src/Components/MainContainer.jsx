import { React, useState } from 'react'
import './MainContainer.css'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import UserWelcomePage from './UserWelcomePage'
import CreateGroup from './CreateGroup'
import Groups from './Groups'
import OnlineUsers from './OnlineUsers'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const lastMessageModel = {
    message: "",
    time: "",
    isRead: ""
}

const MainContainer = () => {
    const theme = useSelector((state) => state.theme)
    const [lastMessage, setLastMessage] = useState([lastMessageModel]);

    return (
        <div className={`main-container ${theme ? '' : 'dark-themeShadeDarker'}`}>
            {/* <Sidebar /> */}
            {/* <Outlet /> */}
            <Sidebar lastMessage={lastMessage} />
            <Outlet context={{ setLastMessage }} />
            {/* <ChatArea /> */}
            {/* <UserWelcomePage /> */}
            {/* <CreateGroup /> */}
            {/* <Groups /> */}
            {/* <OnlineUsers /> */}


        </div>
    )
}

export default MainContainer
