import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/HelloWorld'
import Diagnosis from '../components/Diagnosis'
import Introduction from '../components/Introduction'

Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: Diagnosis
    },
    {
      path: '/intro',
      name: 'introduction',
      component: Introduction
    }
  ]
})