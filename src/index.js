import ThaiAddress from './ThaiAddress';
import ThaiAddressInput from './ThaiAddressInput.vue';

function plugin(Vue, options = {}) {
  Vue.component('ThaiAddressInput', ThaiAddressInput);

  const data = options.database || 'https://tsctao.github.io/vue-thai-address-input/dist/db.json';
  Vue.prototype.$thaiAddressInput = new ThaiAddress(data);
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin;

const version = '__VERSION__';
// Export all components too
export { ThaiAddressInput, version };
