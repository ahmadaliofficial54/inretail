import Vue from 'vue'
import axios from 'axios'
// import store from '../store/authentication/authentication'
import store from '../store'

Vue.prototype.$axios = axios

axios.interceptors.request.use(
    config => {
        const loginStoreName = 'authentication/getLoginResponse';
        const token = store().getters[loginStoreName].token;
        // const token = store.state.loginResponse.token;
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(undefined, function(error) {
    const statusCode = error.response ? error.response.status : null;
    const loginStoreName = 'authentication/getLoginResponse';
    const token = store().getters[loginStoreName].refreshToken;
    if(statusCode === 401){
        this.$q.loading.hide();
        if(token == undefined){
            window.location = "/#/"
        }
        
    }

    return Promise.reject(error);
})

export { axios }