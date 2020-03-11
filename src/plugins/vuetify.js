import Vue from 'vue'
import {Ripple} from 'vuetify/lib/directives'
import {} from 'vuetify/lib/directives/'
import Vuetify from 'vuetify/lib'

/* Global components */
import vExpandTransition from 'vuetify/lib/components/transitions/expand-transition'
import {VApp, VBottomNavigation, VAlert, VBadge, VMenu, VBtn, VSwitch, VChip, VIcon, VNavigationDrawer, VPagination, VDataTable, VSimpleTable, VDataIterator, VSelect, VToolbar, VTooltip, VContent, VDivider, VDialog, VSubheader, VForm, VTextField, VAutocomplete, VCheckbox, VProgressLinear, VProgressCircular, VImg, VAppBar, VAppBarNavIcon, VToolbarTitle, VSkeletonLoader, VFooter, VMain} from 'vuetify/lib'
const components = {VApp, VBottomNavigation, VAlert, VBadge, VMenu, VBtn, VSwitch, VChip, VIcon, VNavigationDrawer, VPagination, VDataTable, VSimpleTable,VDataIterator, VSelect, VToolbar, VTooltip, VContent, VDivider, VDialog, VSubheader, VForm, VTextField, VAutocomplete, VCheckbox, VProgressLinear, VProgressCircular, VImg, VAppBar, VAppBarNavIcon, VToolbarTitle, VSkeletonLoader, VFooter, VMain, vExpandTransition}
// Collections
import * as VGrid from 'vuetify/lib/components/VGrid'
import * as VCard from 'vuetify/lib/components/VCard'
import * as VList from 'vuetify/lib/components/VList'
import * as VTabs from 'vuetify/lib/components/VTabs'
import * as VRadioGroup from 'vuetify/lib/components/VRadioGroup'
import * as VStepper from 'vuetify/lib/components/VStepper'
import * as VCarousel from 'vuetify/lib/components/VCarousel'


Object.assign(components, {...VGrid, ...VCard, ...VList, ...VTabs, ...VRadioGroup, ...VStepper, ...VCarousel})

//
Vue.use(Vuetify, {components, directives: {Ripple}})
const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'mdi'
  }
})
Vue.$vuetify = vuetify

export default vuetify
