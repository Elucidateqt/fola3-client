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
    <q-card-section v-if="canSetPassword">
      <secret-input
        v-model="password"
        :label="$t('auth.new_password')"
      />
      <secret-input
        v-model="passwordConfirmation"
        :label="$t('auth.confirm_password')"
      />
      <q-btn
        :disable="password.length < 5 || password !== passwordConfirmation"
        :label="$t('auth.update_password')"
        type="submit"
        color="primary"
        @click="updatePassword"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SecretInput from '@/components/SecretInput.vue'
export default {
  name: "Profile",
  components: {
    SecretInput
  },
  async beforeRouteUpdate(to, from) {
    // react to route changes...
    await this.loadOwnProfile()
    await this.loadProfile(to.params.id)
    await this.loadUserPermissions()
  },
  data: () => ({
    password: '',
    passwordConfirmation: ''
  }),
  computed: {
      ...mapState('profile', ["uuid", "username", "email", "createdAt"]),
      ...mapGetters('player', ['getPlayerData']),
      isOwnProfile () {
        return this.$route.params.id === this.getPlayerData.uuid
      },
      canSetPassword () {
        return this.userHasPermission()("USERS:PASSWORD:UPDATE") || this.isOwnProfile
      }
  },
  async created () {
    await this.loadProfile(this.$route.params.id)
    await this.loadOwnProfile()
    await this.loadUserPermissions()
  },
  methods: {
    ...mapGetters('permissions', ['userHasPermission']),
    ...mapActions('permissions', ['loadUserPermissions']),
    ...mapActions('profile', ['loadProfile']),
    ...mapActions('users', ['updateUserPassword']),
    ...mapActions('player', ['updateOwnPassword', 'loadOwnProfile']),
    async updatePassword (){
      if(this.password !== this.passwordConfirmation){
        console.error("not same passwords")
        return
      }
      if(this.isOwnProfile){
        await this.updateOwnPassword({password:this.password})
      }else{
        await this.updateUserPassword({uuid: this.uuid,
                                       password: this.password})
      }
    },
  },

};
</script>
