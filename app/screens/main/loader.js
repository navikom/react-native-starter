import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {Dictionary} from '../../service/dictionary';
import {Drawer, LANDING_SCREEN} from '../../models';

export class Loader extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('loader'),
  };

  componentDidMount(): void {
    setTimeout(this._navigate, 500);
  }

  _toScreen(routeName, params = {}) {
    let toScreen = StackActions.reset({
      index: 0,
      key: routeName,
      actions: [
        NavigationActions.navigate({
          routeName,
          params
        })
      ]
    });
    this.props.navigation.dispatch(toScreen);
  }

  _navigate = () => {
    Drawer.unlock();
    this._toScreen(LANDING_SCREEN);
  }

  render() {
    return (
      <View style={ styles.root }/>
    )
  }
}

let styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  }
}));