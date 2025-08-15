import axiosInstance from "@/api/axiosInstance"
import { removeToken, saveToken } from "@/utils/auth";

export const useAuth = () =>{

    const login = async (email: string , password: string) => {
        try {
            const res = await axiosInstance.post('/auth/signin' , {email , password});
            saveToken(res.data.token)
            return true
        } catch (error) {
            console.error('login failed:', error);
            return false
        }
    }

    const signup = async (name: string,email: string , password: string) => {
        try {
            const res = await axiosInstance.post('/auth/signup' , {name, email , password});
            saveToken(res.data.token)
            return true

        } catch (error) {
            console.error('Signin failed:', error);
            return false
        }
    }

    const logout = () => {
        removeToken();
    }

    return {login , signup , logout}
}