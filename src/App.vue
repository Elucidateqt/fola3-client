<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      class="glossy"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>
        <locale-changer />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>
              quasar.dev
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://github.com/quasarframework/"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>
              github.com/quasarframework
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://chat.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>
              chat.quasar.dev
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://forum.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="forum" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>
              forum.quasar.dev
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://twitter.com/quasarframework"
        >
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>
              @quasarframework
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="flex flex-center">
        <router-view />
        <q-btn
          color="primary"
          label="Get all users"
          @click="getAllUsers"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LocaleChanger from '@/components/LocaleChanger.vue'

export default {
  name: "LayoutDefault",

  components: {
    LocaleChanger
  },
  data: () => ({
    leftDrawerOpen: false,
  }),
  computed: {
    ...mapState('users', ['users'])
  },
  created () {
    //TODO: check if user is logged in and redirect to login-view if not
  },
  methods: {
    ...mapActions('users', ['loadUsers']),
    async getAllUsers(){
      this.loadUsers()
      console.log('users:',this.users)
    }
  },
};
</script>
