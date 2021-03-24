import axios from 'axios';

async function placeOrder(payload) {
    return await axios
        .post(
            "http://107.172.195.107:8081/api/SaleOrder/createSaleOrder", payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function fetchAllOrders(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/SaleOrder/searchSaleOrders?BranchId="+payload.branchId+"&FromDate="+payload.fromDate+"&ToDate="+payload.toDate+""
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function getSaleOrderById(id) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/SaleOrder/getSaleOrderById?Id="+id
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function printOrder(payload) {
    return await axios
        .get(
            "http://107.172.195.107:8081/api/SaleOrder/printSaleOrder?SaleOrderId="+payload
        )
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}



const state = {
    allOrders: [],
    order: []
}

const mutations = {

    setAllOrders(state, response) {
        state.allOrders = response.saleOrderModel;
    },
    setSpecificOrder(state, response) {
        state.order = response.saleOrderDetail;
    }


}

const actions = {
    async placeAnOrder({ commit }, payload) {
        return placeOrder(payload);
    },
    async printSaleOrder({ commit }, payload) {
        return printOrder(payload);
    },
    async getAllOrders({ commit }, payload) {
        return fetchAllOrders(payload).then(response => {
            commit('setAllOrders', response);
        })
    },
    async getOrderById({ commit }, payload) {
        return getSaleOrderById(payload).then(response => {
            commit('setSpecificOrder', response);
        })
    }
}

const getters = {
    getOrders: state => {
        return state.allOrders;
    },
    getOrder: state =>{
        return state.order;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}