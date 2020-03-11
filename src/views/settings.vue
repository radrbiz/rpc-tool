<template lang="pug">
v-container.container-settings
  v-row(dense justify="center")
    v-col(cols="12" xs="7" sm="6" md="7" lg="6")
      v-text-field(required label="Server Url"
        v-model="form.host"
        @blur="$v.form.host.$touch()"
        placeholder="Input websocket server url")
    v-col(cols="12" xs="5" sm="6" md="5" lg="4"
      alignment="start" justify="start" style="text-align: left")
      v-btn.mr-4(type="button"
        color="primary" :class="{pending}"
        @click.prevent="setServer"
        :loading="pending"
        :disabled="$v.form.host.$invalid || pending") Set
      v-btn(type="reset" outlined color="secondary" class="mr-4"
        :class="{pending: pending2}" :loading="pending2"
        @click="resetUrl") Reset to Default
</template>

<script>
import {wsUri} from '@/lib/ws'
import {required} from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: { host: this.host, port: '' },
      rules: { host: '', port: '' },
      pending: false,
      pending2: false,
      err: null
    }
  },
  computed: {
    host () {
      return wsUri.val
    },
    hostErrs () {
      const errors = []
      if (!this.$v.form.host.$dirty) return errors
      !this.$v.form.host.required && errors.push(`Server url is required.`)
      return errors
    }
  },
  validations: {
    form: {
      host: {required}
    }
  },
  methods: {
    setServer () {
      if (this.$v.form.$invalid) return this.$v.form.$touch()
      this.pending = true
      this.err = null
      wsUri.update(this.form.host)
      this.pending = false
    },
    resetUrl () {
      this.pending2 = true
      wsUri.reset()
      this.pending2 = false
    }
  },
  mounted () {
    this.form.host = this.host
  }
}
</script>

<style lang="postcss">
html[view="settings"] {
  & .container-settings {
    padding-top: 2.5rem ;padding-bottom: 2rem
  }
}
</style>
