import localStorageService from "./localStorageService.js"
import hashingUtility from "../utils/hashingUtility.js"
import setupAxiosConfig from "../config/axiosConfig.js"

const loginService = {
    async checkUserAuth(login,password,flag){
        try{
            const instance = setupAxiosConfig.axiosInit();
            const URL = flag ? "profissional/login" : "paciente/login"
            const token = hashingUtility.generateSecureHash(login,password);

            const response = await instance.post(URL,{
                "email":login,
                "senha":password
            });

            if(response.status === 200){
                localStorageService.saveUserSession(login,password,token);
                return {token };
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
        window.location.href = "login.html";
    },
    getTokenFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("token");
    }
}

export default loginService;