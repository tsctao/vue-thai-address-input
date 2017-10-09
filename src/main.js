import Vue from 'vue';
import ThaiAddressInput from '../../dist/vue-thai-address-input.common';
import db from '../../database/db.json';
import App from './App.vue';

require('../../dist/vue-thai-address-input.min.css');

Vue.use(ThaiAddressInput, { database: db });

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
