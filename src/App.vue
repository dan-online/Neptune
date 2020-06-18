<template>
  <div>
    <div id="loadingScreen" v-if="!connected && !timeout">
      <h1>Loading</h1>
    </div>
    <div id="unableToConnect" v-if="timeout">
      <h1>Connection timed out</h1>
    </div>
    <notifications></notifications>
    <router-view
      :key="$route.fullPath"
      v-if="connected && !timeout"
    ></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connected: false,
      timeout: false
    };
  },
  methods: {
    disableRTL() {
      if (!this.$rtl.isRTL) {
        this.$rtl.disableRTL();
      }
    },
    toggleNavOpen() {
      let root = document.getElementsByTagName("html")[0];
      root.classList.toggle("nav-open");
    },
    connect() {
      this.connected = true;
    }
  },
  mounted() {
    this.$watch("$route", this.disableRTL, { immediate: true });
    this.$watch("$sidebar.showSidebar", this.toggleNavOpen);
    this.$socket.client.on("connect", this.connect);
    this.$socket.client.on("config", data => {
      console.log(data);
      this.$store.commit("config", data);
    });
    setTimeout(() => {
      if (!this.connected) {
        this.timeout = true;
      }
    }, 30000);
  }
};
</script>

<style lang="scss"></style>
