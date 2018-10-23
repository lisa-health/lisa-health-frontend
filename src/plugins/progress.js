import VueProgress from 'vue-progressbar'
import Vue from 'vue'
import config from '../config/config'

Vue.use(VueProgress, {
  color: config.theme.primary,
  failedColor: config.theme.error,
  thickness: '4px'
})