
const localStorageService = {
    saveUserSession(login,password,token){
        const user = {
            "login":login,
            "password":password
        }

        localStorage.setItem(token,JSON.stringify(user))
    },
    getUserSession(token){
        const data =  localStorage.getItem(token);
        return data ? JSON.parse(data) : null;
    }

}

export default localStorageService;