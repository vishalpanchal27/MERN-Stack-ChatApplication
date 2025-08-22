import React, { useEffect, useState, useRef } from 'react';
import './MainContainer.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';

import { useOutletContext } from 'react-router-dom';

const ChatArea = () => {
    const theme = useSelector((state) => state.theme);
    const chatWith = useSelector((state) => state.chatWith);
    // const user = useSelector((state) => state.user); // assuming you store logged-in user 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const socket = useRef(null);
    const messageEndRef = useRef(null);
    const { setLastMessage } = useOutletContext();

    useEffect(() => {
        socket.current = io("http://localhost:8000");
        if (userData?._id) {
            console.log("join room")
            socket.current.emit("joinRoom", userData._id);
        }

        socket.current.on("connect_error", (err) => {
            console.log("Socket connection error:", err.message);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [userData]);

    // Fetch chat messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (chatWith?._id) {
                    const response = await axios.get(`/api/message/${chatWith._id}`);
                    setMessages(response.data);
                }
            } catch (error) {
                console.log('Error fetching messages:', error.message);
            }
        };
        fetchMessages();
    }, [chatWith]);

    // Listen for new incoming socket messages
    // useEffect(() => {
    //     console.log("socket before check current")
    //     if (!socket.current) return;
    //     console.log("socket after check current")
    //     socket.current.on("newMessage", (newMsg) => {
    //         if (newMsg.senderId === chatWith._id || newMsg.receiverId === chatWith._id) {
    //             console.log("all varification done")
    //             setMessages((prev) => [...prev, newMsg]);
    //         } else {
    //             console.log("validation fail")
    //         }
    //     });
    //     return () => {
    //         socket.current.off("newMessage");
    //         console.log("return")
    //         messageEndRef.current?.scrollIntoView();
    //     };
    // }, [messages]);

    useEffect(() => {
        if (!socket.current || !chatWith?._id) return;

        console.log("socket after check current");

        // join room when chatWith changes
        socket.current.emit("joinRoom", chatWith._id);
        console.log("join room", chatWith._id);

        // handle new messages
        const handleNewMessage = (newMsg) => {
            if (newMsg.senderId === chatWith._id || newMsg.receiverId === chatWith._id) {
                setMessages((prev) => [...prev, newMsg]);
            }
        };

        socket.current.on("receiveMessage", handleNewMessage); // 🔄 use same event name as backend
        messageEndRef.current?.scrollIntoView();

        return () => {
            socket.current.emit("leaveRoom", chatWith._id);
            socket.current.off("receiveMessage", handleNewMessage);
            console.log("return cleanup");
        };
    }, [chatWith, socket, messages]); // ✅ no messages here




    // const time = new Date().toLocaleTimeString([], {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     hour12: true,
    // });

    const eventHandler = (event) => {
        setMessage(event.target.value);
    };
    const sendMessage = async () => {
        try {
            if (!message.trim()) return;

            const time = new Date();

            // 1. Save in DB
            const response = await axios.post(`/api/message/send/${chatWith._id}`, {
                message,
                time,
                isRead: true
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const newMsg = response.data;

            // 2. Update UI immediately
            setMessages((prev) => [...prev, newMsg]);
            setMessage('');

            // 3. Emit socket event (match backend: "newMessage")
            socket.current.emit("newMessage", {
                roomId: chatWith._id,
                senderId: userData._id,
                ...newMsg
            });
        } catch (error) {
            console.log('Error sending message:', error.message);
        }
    };


    // const [onlineUsers, setOnlineUsers] = useState([]);
    // const [lastSeenMap, setLastSeenMap] = useState({});

    // const isOnline = onlineUsers.includes(userData._id);
    // const lastSeen = lastSeenMap[person._id];

    // useEffect(() => {
    //     const socket = io("http://localhost:8000");
    //     socket.emit("userOnline", userData._id);
    //     socket.on("updateOnlineUsers", (users) => {
    //         setOnlineUsers(users);
    //     });
    //     socket.on("userOffline", ({ userId, lastSeen }) => {
    //         setLastSeenMap(prev => ({ ...prev, [userId]: lastSeen }));
    //         console.log(userId, userData)
    //     });
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [userData._id]);

    return (
        <div className='ca-container'>
            {chatWith &&
                <div className={`ca-header ${theme ? '' : 'dark-theme'}`}>
                    <div className='ca-header-icon'>
                        <img className='ca-header-imageIcon' src={chatWith.profilePicture} alt="" />
                    </div>
                    <p className={`ca-header-name ${theme ? '' : 'iconTextLight'}`}>{chatWith.userName}</p>
                    
                    <p className={`ca-header-laststamb ${theme ? '' : 'iconTextLight'}`}>Today</p>
                    <div className='ca-moreBtn'>
                        <IconButton>
                            <MoreVertIcon className={`${theme ? '' : 'iconTextLight'}`} />
                        </IconButton>
                    </div>
                </div>
            }

            <div className={`ca-message-container ${theme ? '' : 'dark-theme'}`}>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.senderId === userData._id ? (
                            <MessageSelf message={message.message} time={message.time} isRead={message.isRead} />
                        ) : (
                            <MessageOthers message={message} time={message.time} isRead={message.isRead} />
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <div className={`ca-input-area ${theme ? '' : 'dark-theme'}`}>
                <input
                    onChange={eventHandler}
                    className={`ca-input-field ${theme ? '' : 'dark-theme'} ${theme ? '' : 'iconTextLight'}`}
                    type='text'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                    placeholder='Enter your message'
                    value={message}
                    name='message'
                />
                <IconButton onClick={sendMessage} className='ca-input-sendbtn'>
                    <SendIcon className={`${theme ? '' : 'iconTextLight'}`} />
                </IconButton>
            </div>
        </div>
    );
};

export default ChatArea;
