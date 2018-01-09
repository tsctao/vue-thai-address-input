# VueThaiAddressInput

[![npm](https://img.shields.io/npm/v/vue-thai-address-input.svg)](https://www.npmjs.com/package/vue-thai-address-input) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Autocomplete ที่อยู่ประเทศไทย สำหรับ Vue.js (ไม่ต้องใช้ jQuery) โดยใช้ฐานข้อมูลและโค้ดบางส่วนจาก [jquery.Thailand.js](https://github.com/earthchie/jquery.Thailand.js)

## Demo

https://tsctao.github.io/vue-thai-address-input/

## Installation

```bash
npm install --save vue-thai-address-input
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueThaiAddressInput from 'vue-thai-address-input'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-thai-address-input/dist/vue-thai-address-input.css'

Vue.use(ThaiAddressInput);
```

ดูตัวอย่างการใช้งานในโฟลเดอร์ demo

## Development

### Launch visual tests

```bash
npm run dev
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```

## License

[MIT](http://opensource.org/licenses/MIT)
