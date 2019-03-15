import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';

export class Splash extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this._navigate();
    }, 100)
  }

  _navigate() {
    const screen = 'Home';
    let toHome = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: screen})]
    });
    this.props.navigation.dispatch(toHome);
  }
  render() {
    return (
      <View style={ styles.root }><Text>Splash</Text></View>
    )
  }
}

let styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  }
}));