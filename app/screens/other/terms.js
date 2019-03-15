import React from 'react';
import { WebView, View, StyleSheet } from 'react-native';
import {Dictionary} from '../../service/dictionary';


export class Terms extends React.Component {
  static navigationOptions = {
    title: Dictionary.value('therms')
  };

  render() {
    return (
        <View style={ styles.root }>
          {/*<WebView ref={'webview'}*/}
                   {/*automaticallyAdjustContentInsets={false}*/}
                   {/*source={require('../../data/terms/t_and_c.html')} />*/}

        </View>
    );
  }
}

let styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  }

}));