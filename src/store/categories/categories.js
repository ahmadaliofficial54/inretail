import axios from 'axios';

async function getAllItems(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/Item/getAllItems?BranchId="+payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function addCategory(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/Item/createCatgory",payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function addItem(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/Item/createItem",payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function updateProduct(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/Item/updateItem",payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}



const state = {
    allItems: [],
}

const mutations = {

    setAllItems(state, response) {
        if (response.itemModel.length) {
            state.allItems = response.itemModel;
        }
    }


}

const actions = {
    async fetchAllItems({ commit }, payload) {
        return getAllItems(payload).then(response => {
            commit('setAllItems', response);
        })
    },
    async addNewCategory({ commit }, payload) {
        return addCategory(payload);
    },
    async addNewItem({ commit }, payload) {
        return addItem(payload);
    },
    async updateItem({ commit }, payload) {
        return updateProduct(payload);
    },
}

const getters = {
    getAllItems: state => {
        return state.allItems;
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}