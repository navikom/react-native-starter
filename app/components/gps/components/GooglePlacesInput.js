import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {API_KEY, Dictionary} from '../../../service';

const {width, height} = Dimensions.get('window');

const Btn = props => {
  return (
    <TouchableOpacity
      style={ styles.rkBtn }
      onPress={ () => props.onOkPress ? props.onOkPress() : props.navigation.goBack() }
    >
      <Text>Ok</Text>
    </TouchableOpacity>
  );
};

export const GooglePlacesInput = props => {
  return (
    <GooglePlacesAutocomplete
      placeholder={Dictionary.value('enterLocation')}
      getDefaultValue={ () => props.addrValue }
      listViewDisplayed={false}
      minLength={ 0 }
      autoFocus={ false }
      returnKeyType={ 'default' }
      fetchDetails={ true }
      minLength={ 2 }
      predefinedPlacesAlwaysVisible={ true }
      onPress={ props.onStreet }
      filterReverseGeocodingByTypes={ ['locality', 'administrative_area_level_3'] }
      query={ {
        key: API_KEY,
        language: Dictionary.current
      } }
      styles={ places }
      renderRightButton={ () => <Btn { ...props }/> }
    />
  );
};

const places = {
  textInputContainer: {
    width,
    height: Platform.OS === 'ios' ? 0 : 60,
    backgroundColor: '#fff'
  },
  textInput: {
    height: 45,
    fontSize: 22,
  },
  listView: {
    position: 'absolute',
    top: 80,
    backgroundColor: '#e9e9ef',
    elevation: 3,
  }
};

let styles = StyleSheet.create({
  rkBtn: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    width: 55,
    height: 45,
    top: 7
  }
});