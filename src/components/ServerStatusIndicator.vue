<template>
  <div>
    Server Status:<q-icon
      name="circle"
      :color="apiOnline ? 'green' : 'red'"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: "ServerStatusIndicator",
  data: () => ({
    interval: null
  }),
  computed: {
    ...mapState(['apiOnline']),
  },
  created () {
    this.checkApiHealth()
    this.interval = setInterval(() => {
      this.checkApiHealth()
    }, 10000)
  },
  berforeUnmount: function(){
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions(['checkApiHealth']),
  },
};
</script>

<style></style>
