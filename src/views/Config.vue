<template>
  <div>
    <p>{{ data }}</p>
    <h1 @click="shutdown">Shutdown</h1>
    <h1 @click="saveConfig">Save config</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      events: {
        console: this.console,
        "console-debug": this["console-debug"],
        "console-warn": this["console-warn"],
        "console-force": this["console-force"],
        config: this.config,
      },
    };
  },
  methods: {
    console: function(data) {
      console.log(data);
    },
    "console-debug": function(data) {
      console.log(data);
    },
    "console-warn": function(data) {
      console.log(data);
    },
    "console-force": function(data) {
      console.log(data);
    },
    config: function(data) {
      this.data = data;
    },
    enablePlugin(plugin, config) {
      this.data[plugin] = config;
    },
    saveConfig() {
      this.$socket.client.emit("streamConsole"); 
      this.$socket.client.emit("saveConfig", this.data);
    },
    shutdown() {
      this.$socket.client.emit("shutdown"); 
    }
  },
  mounted() {
    console.log("mounted");
    Object.keys(this.events).forEach(event => {
      this.$socket.client.on(event, this.events[event]);
    });
  },
  name: "mounted",
};
</script>
