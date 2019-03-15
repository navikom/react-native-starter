import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native';
import {ImageIcons} from '../../../assets/icons';

export class BtnIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderText() {
    const selected = this.props.selected;
    const texStyle = {fontSize: 19, width: '80%'};
    selected && (texStyle.color = this.props.color);
    return (
      <View style={ styles.text }>
        <Image style={ [styles.image, {marginHorizontal: 5}] } source={ this.props.icon }/>
        <Text style={ texStyle }>{ this.props.text }</Text>
      </View>
    )
  }

  _doubleBtn() {
    return (
      <View style={ [styles.wrapper, this.props.style] }>
        <View style={ styles.container }>
          <TouchableOpacity onPress={ this.props.onPress }>
            { this._renderText() }
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.btn }
            onPress={ this.props.onBtnPress }>
            <Image style={styles.image} source={ this.props.btnIcon }/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _singleBtn() {
    return (
      <TouchableOpacity style={ [styles.wrapper, this.props.style] } onPress={ this.props.onPress }>
        <View style={ styles.container }>
          { this._renderText() }
          <View style={styles.btn}>
            <Image style={ styles.image } source={ ImageIcons.plus }/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return this.props.btnIcon ? this._doubleBtn() : this._singleBtn()
  }
}

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18
  },
  text: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 20,
    height: 20
  }
});