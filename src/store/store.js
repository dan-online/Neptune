import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

import state from "./state";
import mutations from "./mutations";


const store = new Vuex.Store({
  state,
  mutations
});

export default store;
