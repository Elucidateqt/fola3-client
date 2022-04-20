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
    <q-card-section class="q-gutter-md" v-if="roles">
          <q-chip v-for="role in roles" :key="role.uuid">{{role.name}}</q-chip>
          <q-btn v-if="canSetGroups" flat round icon="settings" @click="roleEditorVisible=true" />
    </q-card-section>
    <q-card-section v-if="canRevokePermissions">
      {{$t('permissions.revoked_permissions_title')}}:
      <q-chip v-for="permission in revokedPermissions" :key="permission.uuid">{{permission.name}}</q-chip>
    </q-card-section>
  </q-card>

  <q-dialog v-model="roleEditorVisible">
    <q-card class="q-pa-md q-gutter-md">
      <q-form @submit.prevent="handleRoleUpdate">
      <q-card-section>
      <q-select
        filled
        v-model="roleModel"
        multiple
        :options="playerRoleOptions"
        use-chips
        stack-label
        :label="$t('roles.title')"
      />
      </q-card-section>
      <q-card-actions align="around">
        <q-btn :label="$t('base.save')" flat color="primary" type="submit" />
        <q-btn :label="$t('base.cancel')" flat @click="resetRoleForm" />
      </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
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
    try {
      await this.loadProfile(to.params.id)
      await this.loadOwnProfile()
      await this.loadOwnPermissions()
      this.updateRoleModel()
    } catch (err) {
      this.setAlert({
        type: 'negative',
        visible: true,
        message: this.$i18n.t('errors.default'),
      })
    }
  },
  data: () => ({
    password: '',
    passwordConfirmation: '',
    roleEditorVisible: false,
    roleModel: []
  }),
  computed: {
      ...mapState('profile', ["uuid", "username", "email", "createdAt", "roles", "revokedPermissions"]),
      ...mapGetters('player', ['getPlayerData']),
      isOwnProfile () {
        return this.$route.params.id === this.getPlayerData.uuid
      },
      canSetPassword () {
        return this.userHasPermission()("API:USERS:PASSWORD:UPDATE") || this.isOwnProfile
      },
      canSetGroups() {
        return this.userHasPermission()('API:USERS:ROLES:UPDATE')
      },
      playerRoleOptions() {
        const roleOptions = this.getPlayerData.roles.map(role => {
          return { "label": role.name, "value": role.uuid}
        })
        return roleOptions
      },
      canRevokePermissions() {
        return this.userHasPermission()('API:USERS:PERMISSIONBLACKLIST:MANAGE')
      }
  },
  async created () {
    try {
      await this.loadProfile(this.$route.params.id)
      await this.loadOwnProfile()
      await this.loadOwnPermissions()
      if(this.canSetGroups){
        this.updateRoleModel()
      }
    } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
    }
  },
  methods: {
    ...mapGetters('player', ['userHasPermission']),
    ...mapActions('alert', ['setAlert']),
    ...mapActions('player', ['loadOwnPermissions']),
    ...mapActions('profile', ['loadProfile', 'updateProfileRoles']),
    ...mapActions('users', ['updateUserPassword']),
    ...mapActions('player', ['updateOwnPassword', 'loadOwnProfile']),
    updateRoleModel () {
      this.roleModel = this.roles.map(role => {
        return { "label": role.name, "value": role.uuid}})
    },
    async updatePassword (){
      try {
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
      } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
      }
    },
    async handleRoleUpdate() {
      try {
        if(this.roleModel.length === 0){
          return
        }
        await this.updateProfileRoles({
          "userId": this.uuid,
          "roleIds": this.roleModel.map(option => option.value)
        })
        this.roleEditorVisible = false
        this.setAlert({
          type: 'positive',
          visible: true,
          message: this.$i18n.t('profile.confirm_update'),
        })
      } catch (err) {
        this.setAlert({
          type: 'negative',
          visible: true,
          message: this.$i18n.t('errors.default'),
        })
      }
    },
    resetRoleForm () {
      this.updateRoleModel()
      this.roleEditorVisible = false
    }
  },

};
</script>
