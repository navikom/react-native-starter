import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import {observer} from 'mobx-react';

import {
  Address,
  Coordinate,
  DeliveryAddress,
  LOADER_SCREEN,
} from '../../../models';
import MapView, {Marker} from 'react-native-maps';
import {NavigationActions, StackActions} from 'react-navigation';
import {ImageIcons} from '../../../assets/icons';
import {RightMenuButton} from '../../buttons';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.59922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const placeMarker = require('../../../assets/images/deliveryStatus/icon_place_circle_small.png');
// const lisekMarker = require('../../../assets/images/deliveryStatus/icon_Lisek_circle_small.png');

const UserMarker = observer(props => (
  <Marker { ...props }/>
));

@observer export class MapDeliveryTime extends React.Component {
  static navigationOptions = ({navigation}) => {
    const navigate = () => {
      let toScreen = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: LOADER_SCREEN})]
      });
      navigation.dispatch(toScreen);
    };
    return {
      headerLeft: () => <View/>,
      title: <Text rkType='header6' numberOfLines={ 1 }>Some Address</Text>,
      headerRight: style =>
        <RightMenuButton onPress={ navigate } style={ style } icon={ ImageIcons.person }/>
    }
  };

  constructor(props) {
    super(props);
    this.userAddress = Address;
    const region = {
      latitude: this.userAddress.latitude,
      longitude: this.userAddress.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };
    this.origin = region;
    this.state = {
      infoEnabled: false,
    };
  };

  render() {
    const coordinate = Address;
    const userLocation = {latitude: coordinate.latitude, longitude: coordinate.longitude};
    console.log(userLocation);
    return (
      <View style={ styles.container }>
        <MapView
          style={ styles.map }
          enableZoomControl="true"
          region={this.origin}
        >
          <UserMarker coordinate={ userLocation }/>
        </MapView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  info: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    width: width * .75,
    borderRadius: 8,
    opacity: .9,
    padding: 15
  },
  infoTitle: {
    flexDirection: 'row',
  },
  distance: {
    marginLeft: 'auto'
  },
  img: {
    width: 10,
    height: 15
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});