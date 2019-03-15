import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Dictionary} from '../../service/dictionary';
import {RightMenuButton} from '../../components/buttons';
import {ImageIcons} from '../../assets/icons';

export class Landing extends React.Component {
  static navigationOptions = ({navigation}) => {

    return {
      title: Dictionary.value('landing'),
      headerRight: style => <RightMenuButton style={style} navigation={navigation} icon={ImageIcons.nav}/>
    }
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