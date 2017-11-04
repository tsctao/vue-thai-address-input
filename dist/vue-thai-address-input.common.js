/*!
 * vue-thai-address-input v0.0.2
 * (c) 2017 tsctao
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Decoder = function Decoder(useLookup, lookup, words) {
  this.useLookup = useLookup;
  this.lookup = lookup;
  this.words = words;
};

Decoder.prototype.decode = function decode (text) {
    var this$1 = this;

  if (!this.useLookup) {
    return text;
  }

  var newText = text;

  if (typeof text === 'number') {
    newText = this.lookup[text];
  }

  return newText.replace(/[A-Z]/ig, function (m) {
    var ch = m.charCodeAt(0);
    return this$1.words[ch < 97 ? ch - 65 : (26 + ch) - 97];
  });
};

var ThaiAddress = function ThaiAddress(db) {
  this.data = this.constructor.extractDataFromDb(db);
};

/**
 * Returns an array of address objects.
 * Address object contains following keys:
 * subdistrict -> แขวง/ตำบล
 * district  -> เขต/อำเภอ
 * province  -> จังหวัด
 * postalCode-> รหัสไปรษณีย์
 * @param {*} db The addresses data from database.
 */
ThaiAddress.extractDataFromDb = function extractDataFromDb (db) {
  var useLookup = db.lookup && db.words;
  var data = useLookup ? db.data : db;

  if (!data[0].length) {
    // non-encoded database
    return data;
  }

  var result = [];
  var lookup = useLookup ? db.lookup.split('|') : [];
  var words = useLookup ? db.words.split('|') : [];
  var decoder = new Decoder(useLookup, lookup, words);

  // extract data tree
  // key meanings:
  // province  -> จังหวัด
  // district  -> เขต/อำเภอ
  // subdistrict -> แขวง/ตำบล
  // postalCode-> รหัสไปรษณีย์
  data.forEach(function (province) {
    var hasGeoData = province.length === 3;
    var index = hasGeoData ? 2 : 1;

    province[index].forEach(function (district) {
      district[index].forEach(function (subdistrict) {
        (Array.isArray(subdistrict[index]) ? subdistrict[index] : [subdistrict[index]])
          .forEach(function (postalCode) {
            var item = {
              subdistrict: decoder.decode(subdistrict[0]),
              district: decoder.decode(district[0]),
              province: decoder.decode(province[0]),
              postalCode: ("" + postalCode),
            };
            if (hasGeoData) {
              item.subdistrict_code = subdistrict[1] || false;
              item.district_code = district[1] || false;
              item.province_code = province[1] || false;
            }
            result.push(item);
          });
      });
    });
  });

  return result;
};

/**
 * Returns an array of addresses that match the query.
 * @example
 * thaiAddress.query({ subdistrict: 'คลอง', province: 'ปทุม' });
 * // returns an array of addresses, which has subdistrict starts with 'คลอง'
 * // and province starts with 'ปทุม'
 * @param {Object} query The object of query
 */
ThaiAddress.prototype.query = function query (query$1) {
  // eslint-disable-next-line arrow-body-style
  return this.data.filter(function (item) {
    return Object.keys(query$1).every(function (key) { return item[key].indexOf(query$1[key]) === 0; });
  });
};

/**
 * Returns an array of addresses that match the keyword.
 * @example
 * thaiAddress.search('บางแค', ['district', 'subdistrict']);
 * // returns an array of addresses, which has district starts with 'บางแค' first
 * // and then subdistrict starts with 'บางแค'
 * @param {String} keyword The keyword of search
 * @param {Array} fields An array of lookup fields ordered by order of result.
 */
ThaiAddress.prototype.search = function search (keyword, fields) {
    if ( fields === void 0 ) fields = ['postalCode', 'subdistrict', 'district', 'province'];

  var matches = {
    province: [],
    district: [],
    subdistrict: [],
    postalCode: [],
  };

  // eslint-disable-next-line arrow-body-style
  this.data.forEach(function (item) {
    return Object.keys(item).some(function (key) {
      var isMatch = item[key].indexOf(keyword) === 0;

      if (isMatch) {
        matches[key].push(item);
      }

      return isMatch;
    });
  });

  return fields.reduce(function (result, field) { return result.concat(matches[field]); }, []);
};

var ThaiAddressInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"thai-address-input"},[_c('input',{ref:"input",class:_vm.inputClass,attrs:{"type":"text","placeholder":_vm.placeholder,"disabled":_vm.disabled},domProps:{"value":_vm.value},on:{"input":function($event){_vm.onType($event.target.value);},"focus":_vm.onFocus,"blur":_vm.onBlur,"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"up",38)){ return null; }$event.preventDefault();_vm.cursorUp($event);},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"down",40)){ return null; }$event.preventDefault();_vm.cursorDown($event);}],"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13)){ return null; }_vm.selectItem();}}}),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isFocus),expression:"isFocus"}],staticClass:"suggestion-list"},_vm._l((_vm.suggestions),function(item,index){return _c('div',{staticClass:"suggestion-list-item",class:{ 'cursor': _vm.cursor === index },on:{"click":function($event){_vm.selectItem(item);}}},[_vm._v(" "+_vm._s(_vm.suggestionText(item))+" ")])}))])},staticRenderFns: [],
  name: 'ThaiAddressInput',
  props: {
    type: {
      type: String,
      required: true,
    },
    minLength: {
      type: Number,
      default: 2,
    },
    value: {
      required: true,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: String,
    }
  },
  data: function data () {
    return {
      suggestions: [],
      isFocus: false,
      cursor: 0,
    };
  },
  methods: {
    query: function query() {
      this.cursor = 0;
      if (this.value.length < this.minLength) {
        this.suggestions = [];
        return;
      }
      this.suggestions = this.type === 'search' ?
        this.$thaiAddressInput.search(this.value) :
        this.$thaiAddressInput.query(( obj = {}, obj[this.type] = this.value, obj ));
      var obj;
    },
    suggestionText: function suggestionText(item) {
      var isBangkok = item.province && item.province.indexOf('กรุงเทพ') > -1;
      var subdistrictPrefix = isBangkok ? 'แขวง' : 'ตำบล';
      var districtPrefix = isBangkok ? 'เขต' : 'อำเภอ';
      var result = [];

      if (item.subdistrict) {
        result.push(("" + subdistrictPrefix + (item.subdistrict)));
      }

      if (item.district) {
        result.push(("" + districtPrefix + (item.district)));
      }

      if (item.province) {
        result.push(item.province);
      }

      if (item.postalCode) {
        result.push(item.postalCode);
      }

      return result.join(' » ');
    },
    changeValue: function changeValue(text) {
      this.$emit('input', text);
    },
    selectItem: function selectItem(item) {
      if ( item === void 0 ) item = null;

      if (!item) {
        item = this.suggestions[this.cursor];
      }

      if (item[this.type]) {
        this.changeValue(item[this.type]);
      }

      this.isFocus = false;
      this.$refs.input.blur();
      this.$emit('selected', item);
    },
    onType: function onType(value) {
      var this$1 = this;

      this.changeValue(value);
      this.$nextTick(function () {
        this$1.query();
      });
    },
    onFocus: function onFocus() {
      this.query();
      this.isFocus = true;
    },
    onBlur: function onBlur() {
      var this$1 = this;

      setTimeout(function () {
        this$1.isFocus = false;
      }, 200);
    },
    cursorUp: function cursorUp() {
      if (this.cursor > 0) {
        this.cursor -= 1;
      }
    },
    cursorDown: function cursorDown() {
      if (this.cursor < this.suggestions.length - 1) {
        this.cursor += 1;
      }
    },
  },
};

function plugin(Vue, options) {
  if ( options === void 0 ) options = {};

  Vue.component('ThaiAddressInput', ThaiAddressInput);

  var data = options.database;
  Vue.prototype.$thaiAddressInput = new ThaiAddress(data);
}

var version = '0.0.2';

exports['default'] = plugin;
exports.ThaiAddressInput = ThaiAddressInput;
exports.version = version;
