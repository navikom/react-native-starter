import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {observer} from 'mobx-react';
import {BtnIcon} from './components/BtnIcon';
import {ImageIcons} from '../../assets/icons';
import {
  MAP_ADDRESS_SCREEN,
  MAP_FORM_ADDRESS_SCREEN,
  LANDING_SCREEN,
} from '../../models';
import {Dictionary} from '../../service/dictionary';

@observer
export class Addresses extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('addresses'),
  };

  constructor(props) {
    super(props);
    this.state = {
      addresses: null,
      spinner: false
    };
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  _navigate(key, route = MAP_ADDRESS_SCREEN, item) {
    this.props.navigation.navigate(route, {key, item});
  }

  _handleNavigation() {
    this.setState({spinner: true});
  }

  _setDeliveryAddress(item, title) {
    // DeliveryAddress.update(item, title);
    // User.updateDeliveryAddress(item.userAddrId);
    this._handleNavigation();
  }

  _renderNewAddressBtns() {
    return (
      <View>
        <View style={ styles.row }>
          <BtnIcon
            color='#3b5998'
            text={Dictionary.value('addressAddNewHome')}
            icon={ ImageIcons.person }
            onPress={ () => this._navigate(Dictionary.value('home')) }/>
        </View>
        <View style={ styles.row }>
          <BtnIcon
            color='#3b5998'
            text={Dictionary.value('addressAddNewOffice')}
            icon={ ImageIcons.person }
            onPress={ () => this._navigate(Dictionary.value('office')) }/>
        </View>
        <View style={ styles.row }>
          <BtnIcon
            color='#3b5998'
            text={Dictionary.value('addressAddNew')}
            icon={ ImageIcons.person }
            onPress={ () => this._navigate(Dictionary.value('other')) }/>
        </View>
      </View>
    )
  }

  _renderAddressRow(items) {
    const title = items[0];
    return items[1].items.map((item, i) => {
      let text = item.streetName;
      if (item.streetNumber.length && item.streetNumber !== 'null') {
        text += `, ${item.streetNumber}`;
      }
      if (item.doorNo && item.doorNo.length) {
        text += `/${item.doorNo}`;
      }
      if (item.floor.length) {
        text += `, ${item.floor} ${Dictionary.value('floor')}`;
      }
      return (
        <View key={ i } style={ styles.row }>
          <BtnIcon
            color={ true ? '#e94335' : '#3b5998' }
            selected={ true }
            text={ text }
            icon={ ImageIcons.mapO }
            btnIcon={ ImageIcons.pencil }
            onPress={ () => this._setDeliveryAddress(item, title) }
            onBtnPress={ () => this._navigate(title, MAP_FORM_ADDRESS_SCREEN, item) }/>
        </View>
      );
    })
  }

  _renderAddresses() {
    if (AddrStore.entries.size === 0) return;
    return Array.from(AddrStore.entries.entries()).map((entry, i) => (
      <View key={ i } style={ styles.section }>
        <View style={ [styles.row, styles.heading] }>
          <Text rkType='primary header6'>{ entry[0] }</Text>
        </View>
        { this._renderAddressRow(entry) }
      </View>
    ));
  }

  render() {
    return (
      <View style={ styles.fullscreen }>
        <ScrollView style={ styles.root }>
          { this._renderNewAddressBtns() }
        </ScrollView>
        <Spinner
          visible={ this.state.spinner }
        />
      </View>
    );
  }
}

let styles = StyleSheet.create(theme => ({
  fullscreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  root: {
    backgroundColor: '#fff',
  },
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 10.5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    alignItems: 'center',
  }
}));
