import ThaiAddress from './ThaiAddress';
import db from '../database/db.json';
import ThaiAddressInput from './ThaiAddressInput.vue';
import ThaiAddressInputGroup from './ThaiAddressInputGroup.vue';

function plugin(Vue, options = {}) {
  Vue.component('ThaiAddressInput', ThaiAddressInput);
  Vue.component('ThaiAddressInputGroup', ThaiAddressInputGroup);

  const data = options.database || db;
  Vue.prototype.$thaiAddressInput = new ThaiAddress(data);
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin, { db: ThaiAddress });
}

export default plugin;
const version = '__VERSION__';
// Export all components too
export {
  ThaiAddressInput,
  version,
};
