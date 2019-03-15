/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React from 'react';
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  NavigationActions,
  StackActions,
} from 'react-navigation';

import {
  View,
  Dimensions,
  StatusBar,
  YellowBox,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Alert,
  ToastAndroid,
  BackHandler,
  StyleSheet
} from 'react-native';
import {observer} from 'mobx-react';
import Geolocation from 'react-native-geolocation-service';
// import {Firebase} from './components/firebase';
import {AppRoutes} from '../app/config/navigation/routesBuilder';
import * as Screens from './screens';
import {
  LOADER_SCREEN,
  Drawer, Coordinate
} from './models';
// import Analytics from 'appcenter-analytics';
// import AppCenter, {CustomProperties} from 'appcenter';
// import Push from 'appcenter-push';
// import {AppEventsLogger} from 'react-native-fbsdk';
import {Dictionary} from './service/dictionary';
// import {settings} from "../app/components/api/settings";
// import {SettingsModel} from "./app/components/api";


YellowBox.ignoreWarnings(['RCTBridge']);

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

let SideMenu = Screens.SideMenu;
let RightSideMenu = Screens.RightSideMenu;
const {width, height} = Dimensions.get('window');

const makeDrawer = (routeName) => {
  const LeftMenu = createDrawerNavigator({
      ...AppRoutes,
    },
    {
      initialRouteName: routeName,
      drawerOpenRoute: 'LeftSideMenu',
      drawerCloseRoute: 'LeftSideMenuClose',
      drawerToggleRoute: 'LeftSideMenuToggle',
      drawerPosition: 'left',
      contentComponent: (props) => <SideMenu { ...props }/>,
    });
  return {
    screen: createDrawerNavigator({
      Home: {
        screen: LeftMenu,
      },
    }, {
      drawerPosition: 'right',
      drawerOpenRoute: 'RightSideMenu',
      drawerCloseRoute: 'RightSideMenuClose',
      drawerToggleRoute: 'RightSideMenuToggle',
      drawerWidth: Math.min(height, width) * 0.85,
      contentComponent: (props) => <RightSideMenu { ...props }/>,
    })
  }
};

const Home = makeDrawer(LOADER_SCREEN);

const Helpme = createStackNavigator({
  First: {
    screen: Screens.Splash
  },
  Home,
}, {
  headerMode: 'none',
});

const HelpmeApp = createAppContainer(Helpme);

@observer export default class App extends React.Component {
  state = {
    authStatusReported: false,
    isUserAuthenticated: false,
    permissionsRequested: false,
    grant: 'denied',
    showDebug: false
  };

  constructor(props) {
    super(props);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // Firebase.init();
    // Firebase.auth.onAuthStateChanged(user => {
    //
    //   User.setLog('fetched auth');
    //   this.setState(() => ({
    //     authStatusReported: true,
    //     isUserAuthenticated: !!user
    //   }));
    //   !Drawer.unlocked && Drawer.unlock();
    //   User.trySetData((+new Date));
    //   if (!!user) {
    //     if (settings.branchEnabled) {
    //       let {branch} = require('react-native-branch')
    //       branch.setIdentity(User.email)
    //       this._checkRewards()
    //     }
    //
    //     const properties = new CustomProperties();
    //     properties.set('User', 'LoggedIn');
    //     if (User.isCourier) {
    //       properties.set('Courier', true);
    //     }
    //     if (User.isHQ) {
    //       properties.set('HQ', true);
    //     }
    //     if (User.isCustomer) {
    //       properties.set('Customer', true);
    //     }
    //     if (User.isFranchisee) {
    //       properties.set('Franchisee', true);
    //     }
    //     AppCenter.setCustomProperties(properties);
    //   } else {
    //     User.removeRefreshToken()
    //     if (settings.branchEnabled) {
    //       let {branch} = require('react-native-branch')
    //       branch.logout()
    //     }
    //
    //     const properties = new CustomProperties();
    //     properties.set('User', 'LoggedOut');
    //     AppCenter.setCustomProperties(properties);
    //   }
    // }, err => {
    //   if (settings.branchEnabled) {
    //     let {branch} = require('react-native-branch')
    //     branch.logout()
    //   }
    // });
    this._requestPosition();
  }

  async _checkRewards() {
    let bucket = 'install_bucket'
    let {branch} = require('react-native-branch')
    branch.loadRewards(bucket)
      .then((rewards) => {
        console.log('branch.loadRewards', rewards)
        if (rewards.credits > 0) {
          branch.redeemRewards(rewards.credits, bucket)
        }
      }).then((result) => {
      console.log('branch.redeemRewards', result)
      // TODO: add a coupon
    }).catch((e) => {
      console.log(e)
    })

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this._removePositionUpdates();
    // User.stopTracking();
  }

  handleBackButtonClick() {
    return true;
  }

  async _hasLocationPermission() {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(Dictionary.value('permissionDenied'), ToastAndroid.LONG);
      // AppEventsLogger.logEvent("Location Error", {'error': 'Location permission denied by user'})
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(Dictionary.value('permissionRevoked'), ToastAndroid.LONG);
      // AppEventsLogger.logEvent("Location Error", {'error': 'Location permission revoked by user'})
    }

    return false;
  }

  async _requestPosition() {
    const hasLocationPermission = await this._hasLocationPermission();

    if (!hasLocationPermission) {
      Alert.alert(
        Dictionary.value('error'), Dictionary.value('locationPermissionDenied'),
        [{text: 'OK'}]
      );
      return;
    }


    Geolocation.getCurrentPosition(
      (position) => {
        // User.setCoordinates(position.coords);
        console.log('Added current position', position);
        Coordinate.setCoordinate(position.coords);

        setTimeout(() => {
          this._getPositionUpdates();
        }, 60000);
      },
      (error) => {
        console.log(error);
        // AppEventsLogger.logEvent("Location Error", {'error': error.message})
        Alert.alert(
          Dictionary.value('error'), Dictionary.value('locationError'),
          [{text: 'OK'}]
        )
      },
      {enableHighAccuracy: true, timeout: 25000, distanceFilter: 100}
    );
  }

  async _getPositionUpdates() {
    const hasLocationPermission = await this._hasLocationPermission();

    if (!hasLocationPermission) return;

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        const object = {
          latitude,
          longitude,
          timestamp: (+new Date)
        };
        Coordinate.setCoordinate(object);
        console.log('Changed current position');
      },
      (error) => {
        console.log(error);
        // AppEventsLogger.logEvent("Location Error", {'error': error.message})
      },
      {enableHighAccuracy: true, distanceFilter: 100, interval: 60000, fastestInterval: 20000}
    );
  }

  _removePositionUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
    }
  };

  render() {
    console.log(333, Drawer.lockMode)
    return (
      <SafeAreaView style={ styles.safeArea }>
        <StatusBar backgroundColor='white'/>
        <HelpmeApp
          screenProps={
            {
              isUserAuthenticated: this.state.isUserAuthenticated,
              drawerLockMode: Drawer.lockMode
            }
          }
          onNavigationStateChange={ (prevState, currentState) => {
            const currentScreen = getCurrentRouteName(currentState);
            const prevScreen = getCurrentRouteName(prevState);
            if (prevScreen !== currentScreen) {
              // Analytics.trackEvent(currentScreen);
              // AppEventsLogger.logEvent(currentScreen);
            }
          } }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
