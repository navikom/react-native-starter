import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Dictionary} from '../../service/dictionary';

export class Chat extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('chat'),
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