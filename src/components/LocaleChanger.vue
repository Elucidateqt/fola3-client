<template>
  <div class="locale-changer">
    <q-select
      v-model="$i18n.locale"
      :options="langs"
      color="purple-12"
      dense
    />
  </div>
</template>

<script>
export default {
  name: 'LocaleChanger',
  data () {
    return { langs: ['de', 'en'] }
  }
}
</script>