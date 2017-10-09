<template>
  <div id="app">
    <h1>Vue Thai Address Input</h1>
    <p class="lead">
      Autocomplete ที่อยู่ประเทศไทย สำหรับ Vue (without jQuery dependency)<br>
      <small>&mdash; Original from <a href="https://github.com/earthchie/jquery.Thailand.js" target="_blank">jquery.Thailand.js</a></small>
    </p>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>แขวง/ตำบล</label>
          <thai-address-input type="subdistrict"
            v-model="subdistrict"
            input-class="form-control"
            @selected="onSelected"></thai-address-input>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>เขต/อำเภอ</label>
          <thai-address-input type="district"
            v-model="district"
            input-class="form-control"
            @selected="onSelected"></thai-address-input>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>จังหวัด</label>
          <thai-address-input
            type="province"
            v-model="province"
            input-class="form-control"
            @selected="onSelected"></thai-address-input>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>รหัสไปรษณีย์</label>
          <thai-address-input type="postalCode"
            v-model="postalCode"
            input-class="form-control"
            @selected="onSelected"></thai-address-input>
        </div>
      </div>
    </div>

    <hr>

    <div class="form-group">
      <label>ค้นหาที่อยู่</label>
      <thai-address-input type="search"
        v-model="search"
        input-class="form-control"
        @selected="onSearched"></thai-address-input>
        <span class="help-block">ลองกรอกอย่างใดอย่างหนึ่ง ตำบล, อำเภอ, จังหวัด หรือ รหัสไปรษณีย์</span>
    </div>
    <div v-show="searchResult" class="alert alert-info">
      {{ searchResult }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      subdistrict: '',
      district: '',
      province: '',
      postalCode: '',
      search: '',
      searchResult: '',
    };
  },
  methods: {
    onSelected(address) {
      this.subdistrict = address.subdistrict;
      this.district = address.district;
      this.province = address.province;
      this.postalCode = address.postalCode;
    },
    onSearched(address) {
      this.searchResult = address;
    }
  },
};
</script>
