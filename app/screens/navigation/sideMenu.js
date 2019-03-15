import React from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  View,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  Text
} from 'react-native';

import {Menus} from '../../config/navigation/routes';
import {
  Drawer,
  LANDING_SCREEN, LOGIN_SCREEN,
} from '../../models';
import {NavigationActions, StackActions} from 'react-navigation';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {Dictionary} from '../../service/dictionary';
import {Logo} from '../../components/logo/Logo';

const {width} = Dimensions.get('window');

@observer
export class SideMenu extends React.Component {

  _navigate(route) {
    if ([LANDING_SCREEN].includes(route.id)) {
      let toScreen = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: route.id
          })
        ]
      });
      this.props.navigation.dispatch(toScreen);
    } else {
      this.props.navigation.navigate(route.id);
    }

  }

  _onLoginPress() {
    this._navigate({id: LOGIN_SCREEN});
    Drawer.lock();
  }

  _renderMenu(items) {
    return items.map(route => {
        return (
          <TouchableHighlight
            style={ styles.container }
            key={ route.id }
            activeOpacity={ 1 }
            onPress={ () => this._navigate(route) }>
            <View style={ styles.content }>
              <View style={ styles.content }>
                <Image style={ styles.icon } source={ route.icon }/>
                <Text rkType='secondary1'>{ route.title }</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      }
    )
  }

  render() {
    const menuName = 'Customer';
    return (
      <View style={ styles.root }>
        <ScrollView
          showsVerticalScrollIndicator={ false }>
          <View
            style={ {alignItems: 'center', marginBottom: 5} }>
            <Logo style={ styles.logo }/>
          </View>
          <View style={ styles.divider }/>
          { this._renderMenu(Menus[menuName]) }
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc'
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  root: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 15,
    width: 20,
    height: 29
  },
  logo: {
    width: 75,
    height: 22
  },
  buttons: {
    bottom: 0,
    flexDirection: 'row',
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    width: '85%',
  },
  social: {
    width: 60,
    height: 60
  }
});