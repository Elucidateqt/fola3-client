<template>
  <h1>This is the home-route</h1>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: "Home",
  components: {
  },
  computed: {
    ...mapState('users', ['users'])
  },
  methods: {
    ...mapActions('users', ['loadUsers']),
    async getAllUsers(){
      await this.loadUsers()
      console.log('users:',...this.users)
    },
  }
};
</script>
