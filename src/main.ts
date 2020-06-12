import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import encrypt from "socket.io-encrypt";

console.log(encrypt);

const socket = io("http://localhost:3000");
console.log(process.env);

encrypt("123")(socket);

Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
