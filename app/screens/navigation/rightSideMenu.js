import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const RightSideMenu = props => (
  (
    <View style={ styles.root }>
      <View>
        <Text>Right menu</Text>
      </View>
    </View>
  )
);

let styles = StyleSheet.create(() => ({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  }
}));