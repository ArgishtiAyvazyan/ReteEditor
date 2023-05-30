import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import NodeEditor from './views/Editor.vue'
import './plugins/bootstrap-vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

// Vue.prototype.$logger = window.electronAPI.logger.editor

const routes = [
  {
    path: '/',
    name: 'home',
    component: NodeEditor,
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

export default router