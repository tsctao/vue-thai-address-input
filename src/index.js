import ThaiAddress from './ThaiAddress';
import ThaiAddressInput from './ThaiAddressInput.vue';

function install(Vue, options = {}) {
  Vue.component('ThaiAddressInput', ThaiAddressInput);

  const data = options.database || 'https://tsctao.github.io/vue-thai-address-input/dist/db.json';
  Vue.prototype.$thaiAddressInput = new ThaiAddress(data);
}

const version = '__VERSION__';
// Export all components too
export default { ThaiAddressInput, version, install };
