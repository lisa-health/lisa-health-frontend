import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './plugins/progress'
import router from './plugins/router'
import './assets/iconfont.css'

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
  router
}).$mount('#app')

export default app