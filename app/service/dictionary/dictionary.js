import {settings} from './settings';

class DictionaryService {
  constructor() {
    this.data = settings[settings.current];
    this.current = settings.current;
  }

  value(key, values) {
    let data = this.data[key];
    if(values) {
      if(Array.isArray(values)) {
        values.forEach((e, i) => {
          data = data.replace(`%${i}`, e);
        })
      } else {
        data = data.replace('$', values);
      }
    }
    return data ? data : key;
  }

  safeValue(key, defaults, values) {
    if (this.exists(key)) {
      return this.value(key, values)
    } else {
      return this.value(defaults)
    }
  }

  exists(key) {
    return this.data[key] !== undefined;
  }
}

export const Dictionary = new DictionaryService();