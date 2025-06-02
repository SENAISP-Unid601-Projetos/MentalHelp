import localStorageService from "./localStorageService.js"
import hashingUtility from "../utils/hashingUtility.js"
import setupAxiosConfig from "../config/axiosConfig.js"

const loginService = {
    async checkUserAuth(login,password){
        try{
            const instance = setupAxiosConfig.axiosInit();
            const token =  await hashingUtility.generateSecureHash(login,password);

            const response = await instance.post("/login",{
                "email":login,
                "senha":password
            });

            if(response.status === 200){
                localStorageService.saveUserSession(login,password,token);
                return {token, flag:response.data};
            }
        } catch(err){
            console.error('Error:',err);
        }
        return false;
    }, 
    isValidSession(token){
        const session = localStorageService.getUserSession(token)

        if(!session){
            return false;
        }
        return true;
    },
    logout(token) {
        localStorage.removeItem(token);
        return true;
    },
    getTokenFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("token");
    }
}

export default loginService;