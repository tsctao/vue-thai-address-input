<template>
  <div class="thai-address-input">
    <input type="text"
      :value="value"
      ref="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClass"
      @input="onType($event.target.value)"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.up.prevent="cursorUp"
      @keydown.down.prevent="cursorDown"
      @keyup.enter="selectItem()">
    <div class="suggestion-list" v-show="isFocus">
      <div class="suggestion-list-item"
        v-for="(item, index) in suggestions"
        :class="{ 'cursor': cursor === index }"
        @click="selectItem(item)">
        {{ suggestionText(item) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      suggestions: [],
      isFocus: false,
      cursor: 0,
    };
  },
  methods: {
    query() {
      this.cursor = 0;
      if (this.value.length < this.minLength) {
        this.suggestions = [];
        return;
      }
      this.suggestions = this.type === 'search' ?
        this.$thaiAddressInput.search(this.value) :
        this.$thaiAddressInput.query({ [this.type]: this.value });
    },
    suggestionText(item) {
      const isBangkok = item.province && item.province.indexOf('กรุงเทพ') > -1;
      const subdistrictPrefix = isBangkok ? 'แขวง' : 'ตำบล';
      const districtPrefix = isBangkok ? 'เขต' : 'อำเภอ';
      const result = [];

      if (item.subdistrict) {
        result.push(`${subdistrictPrefix}${item.subdistrict}`);
      }

      if (item.district) {
        result.push(`${districtPrefix}${item.district}`);
      }

      if (item.province) {
        result.push(item.province);
      }

      if (item.postalCode) {
        result.push(item.postalCode)
      }

      return result.join(' » ');
    },
    changeValue(text) {
      this.$emit('input', text);
    },
    selectItem(item = null) {
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
    onType(value) {
      this.changeValue(value);
      this.$nextTick(() => {
        this.query();
      });
    },
    onFocus() {
      this.query();
      this.isFocus = true;
    },
    onBlur() {
      setTimeout(() => {
        this.isFocus = false;
      }, 200);
    },
    cursorUp() {
      if (this.cursor > 0) {
        this.cursor -= 1;
      }
    },
    cursorDown() {
      if (this.cursor < this.suggestions.length - 1) {
        this.cursor += 1;
      }
    },
  },
};
</script>

<style>
.thai-address-input {
  position: relative;
}

.thai-address-input .suggestion-list {
  position: absolute;
  z-index: 1000;
  width: 100%;
}

.thai-address-input .suggestion-list-item {
  border: solid 1px #ddd;
  border-top-style: none;
  background: #fff;
  padding: 10px 5px;
  cursor: pointer;
}

.thai-address-input .suggestion-list-item:first-child {
  border-top-style: solid;
}

.thai-address-input .suggestion-list-item.cursor,
.thai-address-input .suggestion-list-item:hover {
  background: #eee;
}
</style>

