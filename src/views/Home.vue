<template>
  <h1>{{ $t('base.greeting', {name: username}) }}</h1>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: "Home",
  components: {
  },
  computed: {
    ...mapState('player', ['uuid', 'username']),
  },
  async created () {
    await this.loadOwnPermissions()
    await this.loadOwnProfile()
  },
  methods: {
    ...mapActions('profile', ['loadProfile']),
    ...mapActions('player', ['loadOwnProfile']),
    ...mapActions('player', ['loadOwnPermissions'])
  }
};
</script>
