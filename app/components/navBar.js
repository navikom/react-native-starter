import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  Text,
  Image
} from 'react-native';
import _ from 'lodash';
import {ImageIcons} from '../assets/icons';
import {UIConstants} from '../config/appConstants';
import {GPSAddress} from './gps';
// import {Logo} from './logo';
// import {Notifier} from './notifier';

export class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: undefined};

  }

  componentDidMount() {
    this.searchInput && this.searchInput.focusInput();
  }

  _renderLeft(headerLeft) {
    if (headerLeft) {
      return (
        <View style={ styles.left }>{ headerLeft(styles.menu) }</View>
      )
    }

    let windowWidth = Dimensions.get('window').width;
    const width = this.state.width
      ? (windowWidth - this.state.width) / 2
      : undefined;

    let renderLeftContent = () => {
      let index = _.findIndex(this.props.headerProps.scenes, {isActive: true});
        return (
          <TouchableOpacity
            style={ [styles.menu, styles.title] }
            onPress={ () => {
              index > 0 ? this.props.navigation.goBack() : this.props.navigation.openDrawer();
            } }>
            <Image style={styles.img} source={ImageIcons[index ? 'navBack' : 'nav']}/>
          </TouchableOpacity>
        )
    };

    return (
      <View style={ [{width}, styles.left] }>
        { renderLeftContent() }
      </View>
    )
  }

  _renderRight(options) {
    const navParams = this.props.navigation.state.params;
    if (navParams && navParams.item && options.rightBtn) {
      return <TouchableOpacity
        style={ [styles.menu, styles.right] }
        onPress={ () => {
          options.rightBtn.action(navParams);
          this.props.navigation.goBack()
        } }>
        <Text style={ styles.titleColor }>{ options.rightBtn.icon }</Text>
      </TouchableOpacity>
    } else if (options.headerRight) {
      return <View style={ [styles.right] }>{ options.headerRight(styles.menu) }</View>
    }
  }

  _renderTitle(title, headerTitle, gps, search, navigateTo) {
    if (search) {
      return <View style={ styles.search }>
        { search(this) }
      </View>
    }
    if (headerTitle) {
      return (
        <View style={ styles.title } onLayout={ onLayout }>{ headerTitle }</View>);
    }

    const onLayout = (e) => {
      this.setState({
        width: e.nativeEvent.layout.width,
      });
    };
    if (gps) {
      return <GPSAddress styleTitle={ styles.title } navigation={ this.props.navigation }/>
    }

    if (title === 'logo') {
      return (
        <View style={ styles.logoTitle } onLayout={ onLayout }>
          {/*<Logo style={ styles.blackLogo }/>*/}
        </View>
      )
    }

    return (
      <View style={ styles.title } onLayout={ onLayout }>
        <Text style={ styles.titleColor }>{ title }</Text>
      </View>
    )
  }

  render() {
    let options = this.props.headerProps.scene.descriptor.options;
    if (options.header === null) {
      return null;
    }
    return (
      <View style={ styles.layout }>
        <View style={ styles.container }>
          { this._renderTitle(options.title, options.headerTitle, options.gps, options.search) }
          { this._renderLeft(options.headerLeft) }
          { this._renderRight(options) }
        </View>
        {/*<Notifier navigation={ this.props.navigation }/>*/}
      </View>
    )
  }
}

const {width, height} = Dimensions.get('window');
let styles = StyleSheet.create({
  layout: {
    backgroundColor: '#fff',
    paddingTop: UIConstants.StatusbarHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc'
  },
  container: {
    flexDirection: 'row',
    height: UIConstants.AppbarHeight,

  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  right: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center'
  },
  title: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 44,
    height: 44,
  },
  rightMenuBtn: {
    width: 100
  },
  search: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * .7,
    marginLeft: width * .15
  },
  logoTitle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -15
  },
  logo: {
    fontSize: 40,
  },
  img: {
    width: 20,
    height: 20
  },
  blackLogo: {
    fontSize: 40,
    color: '#ccc'
  },
  titleColor: {
    fontSize: 21
  }
});