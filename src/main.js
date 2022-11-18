import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSession from 'vue-session'
import VueCookies from 'vue-cookies'
import Chat from 'jwchat'


Vue.use(ElementUI)
Vue.use(VueCookies);
Vue.use(VueSession);
Vue.use(Chat)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
