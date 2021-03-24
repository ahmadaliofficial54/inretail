import axios from 'axios';
// import links from 'src/assets/link.js';

async function validateUser(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/User/loginUser?username=" + payload.Username + "&password=" + payload.Password + "&OrganizationId=" + payload.OrgnanizationNo
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function handShake() {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/Encryption/HandShake?Message=chavealpor"
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function getEncryptedMessage(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/Encryption/EncryptData?Message=" + payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function isIMEIRegistered(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/User/isIMEIRegistered?IMEI=" + payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function checkOTP(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/User/verifyUserOTP?UserId=" + payload.userId + "&OTP=" + payload.otp
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function signUpUser(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/User/registerUserDevice", payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function changePassword(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/User/resetChangePassword", payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function changePasswordAfterOTP(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/User/changeUserPasswordAfterOTP", payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function getNewToken(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/User/refresh-token",payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}


const state = {
    userName: null,
    loginResponse: [],
    userData: [],
    handShake: "",
    imeiResponse: []
}

const mutations = {
    setLoginResponse(state, response) {
        state.loginResponse = response;
    },
    setHandShakeResponse(state, response) {
        state.handShake = response;
    },
    setIMEIResponse(state, response) {
        state.imeiResponse = response;
    },
    setNewToken(state, response) {
        state.loginResponse = response;
    },
    logout(state, response) {
        state.loginResponse = response;
    }
}

const actions = {
    async loginUser({ commit }, payload) {
        return validateUser(payload).then(response => {
            document.cookie = "refreshToken="+response.refreshToken+""
            commit('setLoginResponse', response);
        })
    },
    async getHandShakeResponse({ commit }, payload) {
        return handShake().then(response => {
            commit('setHandShakeResponse', response);
        })
    },
    async signUp({ commit }, payload) {
        return signUpUser(payload).then(response => {
            commit('setLoginResponse', response);
        });
    },
    async getIMEIIsRegistered({ commit }, payload) {
        return isIMEIRegistered(payload).then(response => {
            commit('setIMEIResponse', response);
        });
    },
    async getEncrptedMessage({ commit }, payload) {
        return getEncryptedMessage(payload);
    },
    async validateOTP({ commit }, payload) {
        return checkOTP(payload);
    },
    async changePassword({ commit }, payload) {
        return changePassword(payload);
    },
    async changePasswordAfterOtp({ commit }, payload) {
        return changePasswordAfterOTP(payload);
    },
    async fetchNewToken({ commit }, payload) {
        return getNewToken(payload).then(response => {
            commit('setNewToken', response);
        });
    },
    async logout({ commit }, payload) {
        commit('logout', [])
    },
}

const getters = {
    getLoginResponse: state => {
        return state.loginResponse;
    },
    getLoginUser: state => {
        return state.userData;
    },
    getHandShake: state => {
        return state.handShake;
    },
    getImeiResponse: state => {
        return state.imeiResponse;
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}