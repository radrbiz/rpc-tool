<template lang="pug">
.CallQuery
  v-form(@submit.prevent="submitQuery")
    v-row
      v-col.pt-0.pb-0(cols="12" md="10")
        v-text-field(required
          v-model="form.addr"
          :readonly="pending"
          placeholder="RADR Address or TransactionHash or Ledger index")
        v-checkbox.pt-0(color="primary" style="margin-top: -.5rem"
          v-model="form.expand")
          template(v-slot:label)
            | if you want to see full ledger info, select this checkbox
      v-col.pt-0(cols="10" md="10" style="text-align: left")
        v-btn.mr-4(type="submit" color="primary"
          :class="{pending}"
          :loading="pending"
          :disabled="$v.form.addr.$invalid || pending") Submit
</template>

<script>
const { required } = require('vuelidate/lib/validators')

export default {
  components: {},
  props: {
    req: {type: Object, required: true}
  },
  data () {
    return {
      form: {
        addr: this.req.addr || '',
        expand: false
      },
      pending: false
    }
  },
  validations: {
    form: {
      addr: {required}
    }
  },
  methods: {
    submitQuery () {
      if (this.$v.form.$invalid) return this.$v.form.$touch()
      this.$emit('update:req', {...this.form})
    }
  }
}
</script>
