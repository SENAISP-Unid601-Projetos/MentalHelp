
const loginService = {
    async checkUserAuth(login,password){
        try{
            const instance = setupAxiosConfig.axiosInit();

            const token = hashingUtility.generateSecureHash(login,password);

            const response = await instance.post('profissional/login',{
                "email":login,
                "senha":password
            });

            if(response.status === 200){
                localStorageService.saveUserSession(login,password,token);
                return token;
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