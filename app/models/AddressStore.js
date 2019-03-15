import {values} from 'mobx';
import {destroy, types, clone} from 'mobx-state-tree';
import {fetchAddressService} from '../service/gps';
// import {Firebase} from '../components/firebase';

const getAddressComponent = (address, component, type) => {
  let element = 'null';
  address && address.address_components.forEach((address_component) => {
    if (address_component.types[0] === component) {
      element = (type === 'short') ? address_component.short_name : address_component.long_name;
    }
  });
  return element;
};

export const getAddressDetail = place => {
  return {
    countryCode: place.countryCode ? place.countryCode : 'null',
    countryName: place.country ? place.country : 'null',
    cityCode: place.locality ? place.locality : 'null',
    cityName: place.locality ? place.locality : 'null',
    postalCode: place.postalCode ? place.postalCode : 'null',
    streetName: place.streetName ? place.streetName : 'null',
    streetNumber: place.streetNumber ? place.streetNumber : 'N/A'
  };
};

export const fetchAddress = async (lt, lg) => {
  return fetchAddressService(lt, lg)
    .then(data => getAddressDetail(data))
}

export const AddressStore = types.model('AddressStore', {
  id: types.maybe(types.string),
  countryCode: types.maybe(types.string),
  countryName: types.maybe(types.string),
  cityCode: types.maybe(types.string),
  cityName: types.maybe(types.string),
  streetName: types.maybe(types.string),
  streetNumber: types.maybe(types.string),
  postalCode: types.maybe(types.string),
  itemKey: types.maybe(types.string),
  title: types.maybe(types.string),
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number)
})
  .actions(self => ({
    update(data, title) {
      if (data) {
        Object.keys(data).forEach(key => self[key] = data[key]);
      }
      title && (self.title = title);
    },
    async writeNewAddress(address, title) {
      self.update(address, title);
      const record = {};
      Object.keys(address)
        .filter(key => !['itemKey'].includes(key))
        .forEach(key => address[key] !== undefined && (record[key] = address[key]))
      // await Firebase.database.ref(`addresses/${ self.id }`).update(record);
      // DeliveryAddress.id === self.id && DeliveryAddress.update(address, title)
    },
    clear() {
      ['countryCode', 'countryName', 'cityCode', 'cityName', 'streetName', 'streetNumber', 'postalCode', 'latitude', 'longitude', 'cityCode']
        .forEach(key => self[key] = undefined);
    }
  }))
  .views(self => ({
    getLocation() {
      return {
        country: self.countryCode,
        city: self.cityName,
        streetName: self.streetName,
        streetNumber: self.streetNumber
      };
    },
    getData() {
      return {
        countryCode: self.countryCode,
        countryName: self.countryName,
        cityCode: self.cityCode,
        cityName: self.cityName,
        streetName: self.streetName,
        streetNumber: self.streetNumber,
        postalCode: self.postalCode
      }
    },
    get address() {
      let text = self.streetName;
      if (self.streetNumber && self.streetNumber.length) {
        text += `, ${ self.streetNumber }`;
      }
      return text;
    },
    get streetWithNumber() {
      let text = self.streetName;
      if (self.streetNumber && self.streetNumber.length) {
        text += `, ${ self.streetNumber }`;
      }
      return text;
    },
    get headerAddress() {
      let text = self.streetName || '';
      if (self.streetNumber && self.streetNumber.length) {
        text += `, ${ self.streetNumber }`;
      }
      return text.length > 0 ? text : 'Unknown';
    },
    get latLng() {
      return {latitude: self.latitude, longitude: self.longitude}
    }
  }));

const AddressEntries = types.model('AddressEntries', {
  id: types.identifier,
  items: types.array(AddressStore)
})
  .actions(self => ({
    addItem(item) {
      self.items.push(item);
    },
    deleteItem(item) {
      destroy(item);
    }
  }));

const AddressesStore = types.model('AddressesStore', {
  entries: types.map(AddressEntries)
})
  .actions(self => ({

    addItem(label, item) {
      if (!self.entries.has(label)) {
        self.entries.put({id: label});
      }
      self.entries.get(label).addItem(item);
    },
    removeItem(id) {
      self.entries.has(id) && destroy(self.entries.get(id));
    },
    deleteItem(label, item) {
      self.entries.get(label).deleteItem(item);
      if (!self.entries.get(label).items.length) {
        self.removeItem(label);
      }
    },
    changeLabel(oldLabel, newLabel, item) {
      self.deleteItem(oldLabel, item);
      const cloned = clone(item);
      self.addItem(newLabel, cloned);
      return cloned;
    },
    clear() {
      self.entries.clear();
    },
  }))
  .views(self => ({
    getAddress(item) {
      return self.entries.get(item.label).items.filter(e => e.id === item.key)[0];
    }
  }));

export const Address = AddressStore.create();

export const AddressHelper = AddressStore.create();

export const DeliveryAddress = AddressStore.create();

export const Addresses = AddressesStore.create();
