class Decoder {
  constructor(useLookup, lookup, words) {
    this.useLookup = useLookup;
    this.lookup = lookup;
    this.words = words;
  }

  decode(text) {
    if (!this.useLookup) {
      return text;
    }

    let newText = text;

    if (typeof text === 'number') {
      newText = this.lookup[text];
    }

    return newText.replace(/[A-Z]/ig, (m) => {
      const ch = m.charCodeAt(0);
      return this.words[ch < 97 ? ch - 65 : (26 + ch) - 97];
    });
  }
}

class ThaiAddress {
  constructor(db) {
    if (typeof db === 'string' && /^https?:\/\//.test(db.substring(0, 8))) {
      this.data = [];

      const request = new XMLHttpRequest();
      request.open('GET', db, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          const data = JSON.parse(request.responseText);
          this.data = this.constructor.extractDataFromDb(data);
        }
      }
      request.send();
    } else {
      this.data = this.constructor.extractDataFromDb(db);
    }
  }

  /**
   * Returns an array of address objects.
   * Address object contains following keys:
   * subdistrict -> แขวง/ตำบล
   * district    -> เขต/อำเภอ
   * province    -> จังหวัด
   * postalCode  -> รหัสไปรษณีย์
   * @param {*} db The addresses data from database.
   */
  static extractDataFromDb(db) {
    const useLookup = db.lookup && db.words;
    const data = useLookup ? db.data : db;

    if (!data[0].length) {
      // non-encoded database
      return data;
    }

    const result = [];
    const lookup = useLookup ? db.lookup.split('|') : [];
    const words = useLookup ? db.words.split('|') : [];
    const decoder = new Decoder(useLookup, lookup, words);

    // extract data tree
    // key meanings:
    // province    -> จังหวัด
    // district    -> เขต/อำเภอ
    // subdistrict -> แขวง/ตำบล
    // postalCode  -> รหัสไปรษณีย์
    data.forEach((province) => {
      const hasGeoData = province.length === 3;
      const index = hasGeoData ? 2 : 1;

      province[index].forEach((district) => {
        district[index].forEach((subdistrict) => {
          (Array.isArray(subdistrict[index]) ? subdistrict[index] : [subdistrict[index]])
            .forEach((postalCode) => {
              const item = {
                subdistrict: decoder.decode(subdistrict[0]),
                district: decoder.decode(district[0]),
                province: decoder.decode(province[0]),
                postalCode: `${postalCode}`,
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
  }

  /**
   * Returns an array of addresses that match the query.
   * @example
   * thaiAddress.query({ subdistrict: 'คลอง', province: 'ปทุม' });
   * // returns an array of addresses, which has subdistrict starts with 'คลอง'
   * // and province starts with 'ปทุม'
   * @param {Object} query The object of query
   */
  query(query) {
    // eslint-disable-next-line arrow-body-style
    return this.data.filter((item) => {
      return Object.keys(query).every(key => item[key].indexOf(query[key]) === 0);
    });
  }

  /**
   * Returns an array of addresses that match the keyword.
   * @example
   * thaiAddress.search('บางแค', ['district', 'subdistrict']);
   * // returns an array of addresses, which has district starts with 'บางแค' first
   * // and then subdistrict starts with 'บางแค'
   * @param {String} keyword The keyword of search
   * @param {Array} fields An array of lookup fields ordered by order of result.
   */
  search(keyword, fields = ['postalCode', 'subdistrict', 'district', 'province']) {
    const matches = {
      province: [],
      district: [],
      subdistrict: [],
      postalCode: [],
    };

    // eslint-disable-next-line arrow-body-style
    this.data.forEach((item) => {
      return Object.keys(item).some((key) => {
        const isMatch = item[key].indexOf(keyword) === 0;

        if (isMatch) {
          matches[key].push(item);
        }

        return isMatch;
      });
    });

    return fields.reduce((result, field) => result.concat(matches[field]), []);
  }
}

export default ThaiAddress;
