<template lang="pug">
.Logo.hasSub
  a.logo(href="//radarlab.org" :class="{large}" :title.once="home")
  slot.sublogo
</template>

<script>
export default {
  props: {
    large: Boolean
  },
  components: {
  },
  data () {
    return { home: `${process.env.VUE_APP_TM} Home` }
  }
}
</script>

<style lang="postcss">
:root {
  --logoTxt: #444;
  --logoSub: #5482fb;
  &.theme-dark {
    --logoTxt: #ddd;
    --logoSub: #fff;
  }
}
.Logo {
  position: relative;display:inline-flex;min-width: 76px;height: 30px;align-items: center;font-size:14px;
  & .logo {
    display:inline-flex;width: 76px;height:100%;background: var(--logoBgI) no-repeat 0;background-size: contain;
  }
  &.hasSub {
    & .sublogo {
      display: inline-block;font-size: 1.4em;text-decoration: none;font-weight: 600;transform: skewX(-10deg);
      color: var(--logoSub)!important;
    }
  }
  &.large {width: 15em;height:4em;}
}
</style>
