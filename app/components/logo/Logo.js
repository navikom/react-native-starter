import React from 'react';
import {
  View,
  Image
} from 'react-native';

import {ImageIcons} from '../../assets/icons';

export const Logo = props => {
  return (
    <Image style={ props.style }
           source={ ImageIcons.logo }/>
  )
};
