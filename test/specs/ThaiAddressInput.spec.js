/* eslint-disable prefer-arrow-callback */
// eslint-disable-next-line
import ThaiAddressInput from 'src/ThaiAddressInput.vue';
import { createVM } from '../helpers/utils';

describe('ThaiAddressInput.vue', function describe() {
  it('should render query inputs', function it() {
    const vm = createVM(this, `
      <form>
        <ThaiAddressInput id="subdistrict" type="subdistrict" v-model="subdistrict" @selected="selected" required></ThaiAddressInput>
        <ThaiAddressInput id="district" type="district" v-model="district" @selected="selected"></ThaiAddressInput>
        <ThaiAddressInput id="province" type="province" v-model="province" @selected="selected"></ThaiAddressInput>
        <ThaiAddressInput id="postalCode" type="postalCode" v-model="postalCode" @selected="selected"></ThaiAddressInput>
        <button type="submit">submit</button>
      </form>
      `, {
        components: { ThaiAddressInput },
        data() {
          return {
            subdistrict: '',
            district: '',
            province: '',
            postalCode: '',
          };
        },
        methods: {
          selected(item) {
            this.subdistrict = item.subdistrict;
            this.district = item.district;
            this.province = item.province;
            this.postalCode = item.postalCode;
          },
        },
      });
  });

  it('should render search input', function it() {
    const vm = createVM(this, `
        <ThaiAddressInput id="search" type="search" v-model="search" @selected="selected"></ThaiAddressInput>
        <p>{{ address }}</p>
      `, {
        components: { ThaiAddressInput },
        data() {
          return {
            search: '',
            address: '',
          };
        },
        methods: {
          selected(item) {
            this.address = Object.keys(item).map(key => item[key]).join(' ');
          },
        },
      });
  });
});
