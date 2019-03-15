import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import {DrawerActions} from 'react-navigation';

export const RightMenuButton = props => {
  return (
    <TouchableOpacity
      style={[props.style, styles.center]}
      onPress={ () => props.onPress ? props.onPress() : props.navigation.dispatch(DrawerActions.openDrawer()) }>
      <Image style={styles.img} source={props.icon}/>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  img: {
    width: 20,
    height: 20
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})