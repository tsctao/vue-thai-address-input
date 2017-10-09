import ThaiAddress from './ThaiAddress';
import ThaiAddressInput from './ThaiAddressInput.vue';

function plugin(Vue, options = {}) {
  Vue.component('ThaiAddressInput', ThaiAddressInput);

  const data = options.database;
  Vue.prototype.$thaiAddressInput = new ThaiAddress(data);
}

export default plugin;
const version = '__VERSION__';
// Export all components too
export { ThaiAddressInput, version };
