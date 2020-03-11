<template lang="pug">
cite.cr(v-html.once="cr")
</template>

<script>
const site = 'Radarlab.org'
export default {
  props: {},
  data () {
    const cr = [`&copy;${new Date().getUTCFullYear()}`, `<a href="//${site.toLowerCase()}" target="_blank" title="${site}">${site}</a>`]
    return {
      cr: cr.join(' ')
    }
  }
}
</script>

<style lang="postcss">
.cr {
  &.xs {font-size: smaller}
  & > a::first-letter {text-transform: uppercase;}
}
</style>
