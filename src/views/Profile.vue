<template>
  <q-card class="my-card">
    <q-card-section>
      <h1>{{ $t('profile.title', {name: username}) }}</h1>
    </q-card-section>
    <q-card-section>
      <span>
        ID: {{ uuid }}
      </span>
    </q-card-section>
    <q-card-section>
      <span>
        {{ $t('profile.username') }} : {{ username }}
      </span>
    </q-card-section>
    <q-card-section v-if="email">
      <span>
        Email: {{ email }}
      </span>
    </q-card-section>
    <q-card-section v-if="createdAt">
      <span>
        {{ $t('profile.member_since', {date: $d(createdAt, 'short')}) }}
      </span>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: "Profile",
  components: {
  },
  computed: {

  },
  computed: {
      ...mapState('profile', ["uuid", "username", "email", "createdAt"])
  },
  async created () {
    await this.loadProfile(this.$route.params.id)
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('profile', ['loadProfile']),
    canCreateProjects () {
      return this.userHasPermission('PROJECT:CREATE')
    },
    createProject (){
      console.log('create project popup', this.userHasPermission('PROJECT:CREATE'))
    },
  },

};
</script>
