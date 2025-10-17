import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [isLogin, setIsLogin] = useState(null); 
    
    const [userDate, setUserDate] = useState(null); 

   
    async function getLoggedUserDate(token) {
        if (!token) return; 
        try {
            const { data } = await axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
                headers: {
                   token: token 
                }
            });
            setUserDate(data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
       
        }
    }
    
    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        if (userToken) {
            setIsLogin(userToken);
            getLoggedUserDate(userToken); 
        }
    }, []); 



    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, userDate }} >
            {children}
        </AuthContext.Provider>
    );
}