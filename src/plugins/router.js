import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/HelloWorld'
import Diagnosis from '../components/Diagnosis'
import Introduction from '../components/Introduction'
import HospitalSearch from '../components/HospitalSearch'
import NotFound from '../components/NotFound'
import Symlab from '../components/Symlab'
import Labresult from '../components/Labresult'
Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        title: 'Lisa Health'
      }
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: Diagnosis,
      meta: {
        title: '智能诊断'
      }
    },
    {
      path: '/intro',
      name: 'introduction',
      component: Introduction
    },
    {
      path: '/aids',
      name: 'aids',
      component: Diagnosis,
      meta: {
        title: '急救查询'
      }
    },
    {
      path: '/symlab',
      name: 'Symlab',
      component: Symlab,
      meta: {
        title: '疾病百科'
      }
    },
    {
      path:'/hospital-search',
      name:'HospitalSearch',
      component:HospitalSearch,
      meta: {
        title:'医院查询'
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '噢，你的页面消失了'
      }
    },
    {
      path:'/Symlab/labresult',
      name:'S_result',
      component:Labresult,
      meta:{
        title:'病症查询结果'
      }
    }
  ]
})