import { io } from "socket.io-client"
import { BASE_URL } from "./constant"

export const createSocketConnection=()=>{
    if(location.hostname==="localjost"){
        return io(BASE_URL);
    }else{
        return io("/",{path: "/api/socket.io"}) // Telling client connect to backend system
    }
    
}