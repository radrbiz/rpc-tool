<template lang="pug">
mixin footerLinks()
  ul.lnks
    li
      a.uri(href="/" title=`Home` target="_blank") Home
    li
      a.uri(href="//wiki.radarlab.org" title=`Wiki` target="_blank") Wiki
    li
      a.uri(href="//charts.radarlab.org" title=`Charts` target="_blank") Charts
    li
      a.uri(href="//radarlab.org/dev" title=`Development` target="_blank") Development
    li
      a.uri(href="//news.radarlab.org" title=`News` target="_blank") News
    li
      a.uri(href="//radarlab.org/en/download.html" title=`Apps` target="_blank") Apps

mixin extLinks()
  ul.lnks
    li
      a.uri(href="//wiki.radarlab.org/doku.php?id=trade_help" title=`Help` target="_blank") Help
    li
      a.uri(href="//wiki.radarlab.org/law" title=`AML Policy` target="_blank") AML Policy
    li
      a.uri(href="mailto: radar@radarlab.org" title=`Email Feedback` target="_blank") Email Feedback

mixin copyright()
  cite.cr(v-html.once="cr")

//- template start here
v-footer.Footer
  v-container
    v-spacer
    v-row(no-gutters)
      v-col.footer-wrap.version(cols="2")
        v-card(flat)
          .semver(title="Version") {{ver}}
      v-col.footer-wrap(cols="10")
        v-card(flat)
          v-row(no-gutters)
            +footerLinks()
          v-row(no-gutters)
            +extLinks()
            copyright
</template>
<script>
import copyright from '@/components/copyright'

export default {
  components: {copyright},
  props: {
  },
  data () {
    return {
      ver: process.env.VUE_APP_VERSION
    }
  }
}
</script>
<style lang="postcss">
.Footer {
  flex-shrink: 0!important;height: 82px!important;padding-top: 0;font-size: 12px;color: var(--txt2)!important;background: #fff!important;
  & > .container {
    padding-top: 0;padding-bottom: 0;
  }
  & .v-card {
    background: none!important;color: inherit;
    & .row {justify-content: flex-end;}
  }
  & .lnks {
    padding: 0;margin: 0 0 .75em;
    & + .cr {margin-left: 1.25rem}
    & li {
      display: inline-block;padding: 0;margin: 0;
      &:not(:first-child) {
        &::before {content:'\B7';margin:0 .25em;color: var(--txt3)}
      }
      & a {
        color: var(--txt2)!important;
        &:hover {text-decoration: underline;}
      }
    }
  }
  & .footer-wrap {
    &.version {
      text-align: left;display:flex;flex-direction:column;justify-content: center;
    }
  }
}
</style>
