import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Text,
  Button
} from 'react-native';
import {observer} from 'mobx-react';
// import {AppEventsLogger} from 'react-native-fbsdk';
import {
  MAP_DELIVERY_TIME_SCREEN,
  Address,
} from '../../models';
import {Dictionary} from '../../service/dictionary';

@observer
export class GPSAddress extends React.Component {
  constructor(props) {
    super(props);
    // this.direction = DirectionsStore.create();
  }

  _navigate(addr, route, params) {
    if (addr === 'Unknown') {
    } else {
      this.props.navigation.navigate(route, params);
    }
  }

  _handlePressAddress(addr) {

  }

  render() {
    const address = Address;

    let addr = address.headerAddress;
    return (
      <View style={ styles.street }>
        <Button
          disabled={ addr === 'Unknown' }
          rkType='clear'
          style={ [styles.clearBtn, {width: '70%'}] }
          onPress={ () => this._handlePressAddress(addr) }>
          <Text rkType='header6' style={ styles.titleColor } numberOfLines={ 1 }>{ addr  === 'Unknown' ? Dictionary.value('lookingForAddress') : addr }</Text>
        </Button>
        <TouchableOpacity
          disabled={ addr === 'Unknown' }
          style={ [styles.duration, styles.clearBtn] }
          onPress={ () => this._navigate(null, MAP_DELIVERY_TIME_SCREEN, {locationCenter: true}) }>
          <Text rkType='header6' style={ styles.titleColor }>{ duration }</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create(theme => ({
  street: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    right: 0,
  },
  clearBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  titleColor: {
    color: theme.colors.primary
  }
}));
