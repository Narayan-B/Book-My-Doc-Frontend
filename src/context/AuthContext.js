import { createContext,useState,useContext } from "react";
import {toast} from 'react-toastify'

export const AuthContext=createContext()
export const useAuth=()=>{
    return useContext(AuthContext)
}
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const handleLogin=(user)=>{
        setUser(user)
    }
    
    const handleLogout=()=>{
        setUser(null)
        toast.success('Logged Out Successfully')
        
    }
    
    return(
        <AuthContext.Provider value={{user,handleLogin,handleLogout}}>
        {children}
        </AuthContext.Provider>
    )
}