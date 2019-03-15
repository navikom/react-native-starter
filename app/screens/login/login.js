import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Dictionary} from '../../service/dictionary';

export class Login extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('login'),
  };

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