
const setupAxiosConfig = {
    axiosInit(){
        const instance = axios.create({
            baseURL:'http://10.110.12.4:9500/',
            timeout:'1000',
            headers:{
                "Content-Type": "application/json"
            }
        });
        return instance
    }
};

export default setupAxiosConfig;