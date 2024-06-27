import { useAuth } from '../context/AuthContext'
export default function Account(){
    const {user}=useAuth()
    console.log(user)
    return (
        <div>
            <h1>Account</h1>
            {user && 
            <>
            <h4>Username : {user.username}</h4>
            <h4>Role:{user.role}</h4>
            </>
            }
        </div>
    )
}