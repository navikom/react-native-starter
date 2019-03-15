import React from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
  findNodeHandle,
  Alert,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import autobind from 'autobind-decorator';
import MapView, {Marker} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {
  CoordinateHelper,
  Coordinate,
  Addresses,
  ADDRESSES_SCREEN,
  DeliveryAddress
} from '../../models';

import marker from './assets/marker.png'
import {ImageIcons} from '../../assets/icons';
import {Dictionary} from '../../service/dictionary';

const latitudeDelta = 0.001;
const longitudeDelta = 0.001;
const inputHeightScroll = Platform.OS === 'ios' ? 110 : 0;
const {height, width} = Dimensions.get('window');

const initialState = {
  data: {
    countryCode: '',
    countryName: '',
    cityName: '',
    streetName: '',
    streetNumber: '',
    description: '',
    doorNo: '',
    floor: '',
    postalCode: '',
  },
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta,
    longitudeDelta
  }
};

const deleteItem = (params) => {
  const {key, item} = params;
  // const id = item.userAddrId;
  Addresses.deleteItem(key, item);
  // User.deleteAddress(id);
};

export class MapFormAddress extends React.Component {
  static navigationOptions = () => {
    const menu = {
      title: Dictionary.value('address')
    };
    // if(User.address.size > 1) {
    //   menu.rightBtn = {
    //     action: deleteItem,
    //     icon: FontAwesome.trash
    //   }
    // }
    return menu;
  };

  constructor(props) {
    super(props);
    const region = Coordinate.latitudeLongitude();
    this.currPosition = region;
    this.state = {...initialState, label: this.props.navigation.state.params.key};
  };

  componentDidMount() {
    const navParams = this.props.navigation.state.params;
    if (navParams && navParams.item) {
      this._fillRegionByParam(navParams.item);
    } else {
      this._fillRegion();
    }
  }

  _fillRegionByParam(item) {
    this.setState(() => ({
      data: item,
      region: {
        ...this.state.region,
        latitude: item.latitude,
        longitude: item.longitude
      }
    }));
  }

  _fillRegion() {
    let {countryCode, countryName, cityName, streetName, streetNumber, postalCode} =
      CoordinateHelper.address.getData();
    const latLong = CoordinateHelper.latLng();
    this.setState(() => ({
      data: {
        ...this.state.data,
        countryCode,
        countryName,
        cityName,
        streetName,
        streetNumber,
        postalCode
      },
      region: {
        ...this.state.region,
        latitude: latLong.lat,
        longitude: latLong.lng
      }
    }));
  }

  _enterField(fieldName, value) {
    this.setState(() => ({
      data: {
        ...this.state.data,
        [fieldName]: value
      }
    }));
  }

  _create(record) {
    // User.addAddress(record, this.state.label);
  }

  async _update(record) {
    let item = this.props.navigation.state.params.item;
    if (this.state.label !== this.props.navigation.state.params.key) {
      // User.updateAddress(item.userAddrId, this.state.label);
      item = Addresses.changeLabel(
        this.props.navigation.state.params.key,
        this.state.label, item);
    }
    item.writeNewAddress(record, this.state.label);
  }

  async _saveAddress() {
    const navParams = this.props.navigation.state.params;

    try {
      const record = Object.assign(
        {latitude: this.state.region.latitude, longitude: this.state.region.longitude},
        this.state.data
      );
      // record.owner = User.uid;
      if (navParams.item) {
        this._update(record);
      } else {
        this._create(record);
      }
    } catch (e) {
      console.warn('Write to database failed: %s', e.message)
    }
    this.props.navigation.navigate(ADDRESSES_SCREEN);
  }

  _scrollTo(e) {
    this.scroll.scrollToFocusedInput(findNodeHandle(this.submit), inputHeightScroll)
  }

  _label(icon) {
    return <Text style={ styles.icon } rkType='awesome secondaryColor'>{ ImageIcons[icon] }</Text>;
  }

  _renderForm() {
    const {data} = this.state;
    const w = {width: width / 3};
    const label = this._label('check');
    return (
      <View style={ styles.content }>
        <View style={ [styles.row, styles.contentRow] }>
          <TextInput
            label={ this._label('tag') }
            placeholder={ Dictionary.value('label') }
            onChangeText={ e => this.setState({label: e}) }
            value={ this.state.label }
            onFocus={ this._scrollTo }
          />
        </View>
        <View style={ [styles.row, styles.contentRow] }>
          <TextInput
            disabled={ true }
            label={ this._label('mapMarker') }
            placeholder={ Dictionary.value('street') }
            onChangeText={ e => this._enterField('streetName', e) }
            value={ data.streetName }
            onFocus={ this._scrollTo }
          />
        </View>
        <View style={ styles.row }>
          <TextInput
            label={ this._label('buildingO') }
            style={ w }
            placeholder={ Dictionary.value('houseNumber') }
            onChangeText={ e => this._enterField('streetNumber', e) }
            value={ data.streetNumber }
            onFocus={ this._scrollTo }
          />
          <TextInput
            label={ label }
            style={ w }
            placeholder={ Dictionary.value('flatNumber') }
            onChangeText={ e => this._enterField('doorNo', e) }
            value={ data.doorNo }
            onFocus={ this._scrollTo }
          />
          <TextInput
            label={ label }
            style={ w }
            placeholder={ Dictionary.value('floor') }
            onChangeText={ e => this._enterField('floor', e) }
            value={ data.floor }
            onFocus={ this._scrollTo }
          />
        </View>
        <View style={ [styles.row, styles.contentRow] }>
          <TextInput
            label={ label }
            placeholder={ Dictionary.value('otherDescription') }
            onChangeText={ e => this._enterField('description', e) }
            value={ data.description }
            onFocus={ this._scrollTo }
          />
        </View>
        <TouchableOpacity
          ref={ ref => this.submit = ref }
          style={ styles.rkBtn }
          onPress={ this._saveAddress }>
          <Text> { Dictionary.value('save') } </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderMarker(region, style) {
    if (Platform.OS === 'ios') {
      return (
        <Marker style={ style } coordinate={ region }>
          <Image style={ styles.marker } source={ marker }/>
        </Marker>
      )
    } else {
      return <Marker
        coordinate={ region }
        style={ style }
        image={ marker }/>
    }
  }

  render() {
    const navParams = this.props.navigation.state.params;

    return (
      <KeyboardAwareScrollView
        style={ styles.form }
        keyboardShouldPersistTaps="always"
        ref={ ref => (this.scroll = ref) }
      >
        <TouchableOpacity onPress={ Keyboard.dismiss }>
          <MapView
            onPanDrag={ () => this.props.navigation.goBack() }
            style={ styles.map }
            region={ this.state.region }
            enableZoomControl="true">
            { this._renderMarker(this.state.region) }
          </MapView>
        </TouchableOpacity>

        { this._renderForm() }
      </KeyboardAwareScrollView>
    );
  }
}

let styles = StyleSheet.create(theme => ({
  form: {
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: height / 2
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    width
  },
  contentRow: {
    alignItems: 'center'
  },
  rkBtn: {
    backgroundColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10
  },
  icon: {
    fontSize: 24
  },
  marker: {
    width: 36,
    height: 48
  }
}));