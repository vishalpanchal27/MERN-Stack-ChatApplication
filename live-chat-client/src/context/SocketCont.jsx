import { createContext, useEffect, useState } from "react";

export const SocketCont=createContext();

export const SocketContextProvider=({children})=>{
    const [socket,setSocket]=useState(null)
    const [onlineUser, setOnlineUsers]=useState([])
    // const {authUser}=useAuthContext();
    

    useEffect(()=>{

    },[])

    return(
        <SocketCont.Provider value={{}}>
            {children}
        </SocketCont.Provider>
    )
}