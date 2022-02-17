<template>
  <q-select
    v-model="$i18n.locale"
    :options="langs"
    outlined
    label-color="white"
    label="lang"
    class="lang-select"
  />
</template>

<script>
export default {
  name: 'LocaleChanger',
  data () {
    return { langs: ['de', 'en'] }
  }
}
</script>