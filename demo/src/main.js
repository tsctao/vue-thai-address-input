import Vue from 'vue';
import ThaiAddressInput from '../../dist/vue-thai-address-input.common';
import App from './App.vue';

require('../../dist/vue-thai-address-input.min.css');

Vue.use(ThaiAddressInput);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
