import React from 'react';
import {createStackNavigator} from 'react-navigation'
import {NavBar} from '../../components/navBar';
import transition from './transitions';
import {MenuRoutes} from './routes';

let main = {};
let flatRoutes = {};
MenuRoutes.forEach(function (route) {

  let wrapToRoute = (route) => {
    return {
      screen: route.screen,
      title: route.title
    }
  };

  flatRoutes[route.id] = wrapToRoute(route);
  main[route.id] = wrapToRoute(route);
  for (let child of route.children) {
    flatRoutes[child.id] = wrapToRoute(child);
  }
});

const DrawerRoutes = Object.keys(main).reduce((routes, name) => {
  let stack_name = name;
  routes[stack_name] = {
    name: stack_name,
    screen: createStackNavigator(flatRoutes, {
      initialRouteName: name,
      headerMode: 'screen',
      cardStyle: {backgroundColor: 'transparent'},
      transitionConfig: transition,
      defaultNavigationOptions: ({navigation, screenProps}) => ({
        gesturesEnabled: false,
        header: (headerProps) => {
          return <NavBar navigation={navigation} headerProps={headerProps}/>
        }
      })
    })
  };
  return routes;
}, {});

export const AppRoutes = DrawerRoutes;