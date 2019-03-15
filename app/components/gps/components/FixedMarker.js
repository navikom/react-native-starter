import React from 'react';
import autobind from 'autobind-decorator';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text
} from 'react-native';
import {observer} from 'mobx-react';

import marker from '../assets/marker.png'
import {ImageIcons} from "../../../assets/icons";
import {CoordinateHelper as Coordinate} from '../../../models';

@observer
export class FixedMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toLeft: 0
    }
  }

  @autobind _handleTextLayout(evt) {
    const width = evt.nativeEvent.layout.width;
    this.setState(() => ({
      toLeft: width / 2
    }));
  }

  _renderBtn() {
    const {onPress} = this.props;
    const address = Coordinate.address.streetWithNumber;
    const margin = {marginLeft: 10};
    return (
      <View style={ styles.btn }>
        <TouchableOpacity
          onLayout={ this._handleTextLayout }
          style={ [styles.rkBtn, {marginLeft: -this.state.toLeft}] }
          rkType='rounded'
          onPress={ onPress }>
          <Text rkType='header6 textBtn' style={ margin }>{ address }</Text>
          <Image style={ [margin, {width: 10, height: 10}] } source={ ImageIcons.plus }/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View pointerEvents="box-none">
        { this._renderBtn() }
        <View style={ styles.markerFixed }>
          <Image style={styles.marker} source={ marker }/>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  marker: {
    height: 48,
    width: 30,
  },
  markerFixed: {
    marginTop: Platform.OS === 'ios' ? -24 : -48,
    marginLeft: Platform.OS === 'ios' ? -15 : -19,
    position: 'absolute',
  },
  btn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -70 : -100,
  },
  rkBtn: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  }
});