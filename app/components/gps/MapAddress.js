import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Text
} from 'react-native';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import MapView, {Marker, Polygon} from 'react-native-maps';
import haversine from 'haversine';
import {
  CoordinateHelper,
  Coordinate,
  MAP_FORM_ADDRESS_SCREEN,
} from '../../models';
import {FixedMarker} from './components/FixedMarker';
import {UIConstants} from '../../config/appConstants';
import {Dictionary} from '../../service/dictionary';
import {GooglePlacesInput} from './components/GooglePlacesInput';
import Spinner from 'react-native-loading-spinner-overlay';

const latitudeDelta = 0.01;
const longitudeDelta = 0.01;
const {height} = Dimensions.get('window');

@observer
export class MapAddress extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('address')
  };

  constructor(props) {
    super(props);
    const region = Coordinate.latitudeLongitude();
    region.latitudeDelta = latitudeDelta;
    region.longitudeDelta = longitudeDelta;
    CoordinateHelper.setCoordinate(region);
    this.region = region;
    this.state = {
      modalVisible: false,
      region,
      address: Coordinate.address.streetWithNumber,
      layout: false,
      spinner: false
    };
    this.time = (+new Date);
  };

  _handleNavigation() {

  }

  _calcDistance = newLatLng => {
    return Math.round(haversine(this.region, newLatLng, {unit: 'meter'})) || 0;
  };

  _onRegionChange(region) {
    if (this.started) return;
    this.started = true;
    this.time = (+new Date);
    CoordinateHelper.setCoordinate(region, () => {
      this.started = false;
    });
  };

  @autobind _tryAddAddress() {
    const region = CoordinateHelper.latitudeLongitude();
    if (CoordinateHelper.address.streetName === 'null') return;
    region.latitudeDelta = latitudeDelta;
    region.longitudeDelta = longitudeDelta;
    this.setState(() => ({region}));
    const length = this._calcDistance(region);
    // if (User.isAuthorized) {
    //   if (length) {
    //     this._setModalVisible(true);
    //   } else {
    //     this._addAddress();
    //   }
    // } else {
    //   User.setTempAddress(region);
    //   this.props.navigation.goBack();
    // }
  }

  @autobind _handleOnStreet() {
    const navParams = this.props.navigation.state.params;
    if (CoordinateHelper.address.streetName === 'null') return;
    navParams.onStreet(CoordinateHelper.latitudeLongitude());
    this._handleNavigation();
  }

  _addAddress() {
    this._setModalVisible(false);
    const state = this.props.navigation.state;
    this.props.navigation.navigate(MAP_FORM_ADDRESS_SCREEN,
      {key: state.params.key});
  }

  _setModalVisible(visible) {
    this.setState(() => ({modalVisible: visible}));
  }

  _onAddress = (data, place) => {
    CoordinateHelper.setCoordinate(
      {longitude: place.geometry.location.lng, latitude: place.geometry.location.lat},
      () => {
        const region = CoordinateHelper.latitudeLongitude();
        region.latitudeDelta = latitudeDelta;
        region.longitudeDelta = longitudeDelta;
        this.setState(() => ({region}));
      });
  };

  _onLayout = () => {
    this.setState({
        layout: true
      },
      () => this._onRegionChange(CoordinateHelper.latitudeLongitude()));
  };

  _renderModal() {
    const length = this._calcDistance(this.state.region);
    const text = Dictionary.value('mapAddressLocationIsOn', length);
    return (
      <Modal
        animationType={ 'fade' }
        transparent={ true }
        onRequestClose={ () => this._setModalVisible(false) }
        visible={ this.state.modalVisible }>
        <View style={ styles.popupOverlay }>
          <View style={ styles.popup }>
            <View style={ styles.popupContent }>
              <Text style={ styles.popupHeader }>{ text }</Text>
            </View>
            <View style={ styles.popupButtons }>
              <TouchableOpacity
                onPress={ () => this._setModalVisible(false) }
                style={ [styles.popupButton, {backgroundColor: '#ccc'}] }
                rkType='contrast'>
                <Text rkType='textBtn'>{ Dictionary.value('no') }</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={ this._addAddress }
                style={ styles.popupButton }
                rkType='link'>
                <Text rkType='textBtn'>{ Dictionary.value('yes') }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  _renderMarker() {
    if (Platform.OS === 'ios') {
      return (
        <Marker coordinate={ this.state.region }>
          <Image style={ styles.marker } source={ require('./assets/marker.png') }/>
        </Marker>
      )
    } else {
      return <Marker
        coordinate={ this.state.region }
        style={ {opacity: .4} }
        image={ require('./assets/marker.png') }/>
    }
  }

  render() {
    const navParams = this.props.navigation.state.params;
    return (
      <View style={ styles.container }>
        <MapView
          onRegionChange={ this._onRegionChange }
          style={ styles.map }
          region={ this.state.region }
          onLayout={ this._onLayout }>
          { this._renderMarker() }
        </MapView>
        <FixedMarker onPress={ navParams.onStreet ? this._handleOnStreet : this._tryAddAddress }/>
        <View style={ styles.places }>
          <GooglePlacesInput
            addrValue={ navParams.value ? navParams.value : this.state.address }
            onStreet={ this._onAddress }
            onOkPress={ navParams.onStreet ? this._handleOnStreet : this._tryAddAddress }
            navigation={ this.props.navigation }/>
        </View>
        { this._renderModal() }
        <Spinner
          visible={ this.state.spinner }
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  popup: {
    backgroundColor: '#fff',
    marginTop: height / 3,
    marginHorizontal: 37
  },
  popupOverlay: {
    flex: 1,
    marginTop: UIConstants.HeaderHeight
  },
  popupContent: {
    alignItems: 'center',
    margin: 16
  },
  popupHeader: {
    color: '#ccc'
  },
  popupButtons: {
    flexDirection: 'row',
    padding: 5
  },
  popupButton: {
    flex: 1,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 5
  },
  marker: {
    width: 30,
    height: 48,
    opacity: .4
  },
  places: {
    position: 'absolute',
    top: 0,
    left: 0
  }
});
