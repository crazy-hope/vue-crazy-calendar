import Vue from 'vue'
import App from './App.vue'

import CrazyCalendar from 'vue-crazy-calendar'
Vue.use(CrazyCalendar)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
