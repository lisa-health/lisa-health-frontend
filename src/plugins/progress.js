import VueProgress from 'vue-progressbar'
import Vue from 'vue'
import config from '../config/config'

Vue.use(VueProgress, {
  color: config.theme.accent,
  failedColor: config.theme.error,
  thickness: '4px'
})