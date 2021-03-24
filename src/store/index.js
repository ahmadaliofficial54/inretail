import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import authentication from './authentication/authentication'
import categories from './categories/categories'
import saleOrder from './saleOrder/saleOrder'
import * as Cookies from "js-cookie";
const ls = new SecureLS({ isCompression: false });
// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  // var ls = new SecureLS({isCompression: false});
  const Store = new Vuex.Store({
    modules: {
      authentication,
      categories,
      saleOrder
      // example
    },
    plugins: [
      createPersistedState({
        key: 'inretail',
        paths: ["authentication", "categories", "saleOrder"],
        storage: {
          getItem: key => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: key => ls.remove(key)
        }
      })
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEBUGGING
    strict: process.env.DEBUGGING
  })

  return Store
}
