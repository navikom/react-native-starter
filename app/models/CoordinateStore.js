import {types} from "mobx-state-tree";
import {
  AddressStore,
  Address,
  AddressHelper,
  fetchAddress,
} from "./AddressStore";

export const CoordinateStore = types.model('CoordinateStore', {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.02522,
  longitudeDelta: 0.02522,
  address: AddressStore,
})
    .actions(self => ({
      setLatLng(lat, lng) {
        self.latitude = lat;
        self.longitude = lng;
      },
      updateAddress(address) {
        self.address.update(address);
      },
      setCoordinate({latitude, longitude}, callback) {
        self.setLatLng(latitude, longitude);
        fetchAddress(latitude, longitude).then(address => {
          address.latitude = self.latitude;
          address.longitude = self.longitude;
          self.updateAddress(address);
          callback && callback();
        }).catch(e => {
          console.log('Error %s', e.message);
          self.updateAddress(null);
          callback && callback();
        });
      }
    }))
    .views(self => ({
      latLng() {
        return {lat: self.latitude, lng: self.longitude};
      },
      latitudeLongitude() {
        return {
          latitude: self.latitude,
          longitude: self.longitude,
          latitudeDelta: self.latitudeDelta,
          longitudeDelta: self.longitudeDelta
        };
      },
    }));

export const Coordinate = CoordinateStore.create(Object.assign({address: Address}));

export const CoordinateHelper =
    CoordinateStore.create(Object.assign({address: AddressHelper}));
