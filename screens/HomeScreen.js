import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput
} from 'react-native';
import { WebBrowser, MapView, Constants, Location, Permissions } from 'expo';
import { Marker } from 'react-native-maps';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';


import { MonoText } from '../components/StyledText';

//Home 
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {

    return (


      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/LiveWellLogo.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

        <Button
          title="Look Around"
          onPress={() => this.props.navigation.navigate('Maps')}
          style={{fontSize:30}}
        />
      </View>
    );
  }
}

//Screen with mapview
class MapsScreen extends React.Component {

  constructor(props){
    super(props)
    this.state = {location: null, 
      markers: [
        {
          key:1,
          coordinate:{latitude: 15.3694, longitude: 44.1910},
          title:"Some Title",
          description:"Hello world",
        }
      ]
    }
    //this._getLocationAsync()
  }
  static navigationOptions = {
    title: 'Maps',
  };


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }else{
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
    }
  };

  render() {
    return (

      <View style={{flex: 1}}>

        <MapView
        style={{ flex: 1 }}
          initialRegion={{
            latitude: 15.3694,
            longitude: 44.1910,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          >


          {this.state.markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}

        </MapView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => this.props.navigation.navigate('Report')}
          >
            <Text style = {styles.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>

    );
  }
}


//Screen for item reporting
class ReportScreen extends React.Component {

  constructor(props){
    super(props)
    this.state = {text: "Placeholder"}
  }

  static navigationOptions = {
    title: 'Report',
  };


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        <Text style={styles.headerText}>Report Screen</Text>

        <TextInput
          style={{height: 100, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />

      </View>
    );
  }
}

//Make navigator
const TabNavigator = createBottomTabNavigator({
  Home: { screen: HomeScreen },
  Maps: { screen: MapsScreen },
  Report: {screen: ReportScreen},
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 300,
    height: 240,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    fontSize: 30,
    color: 'white'
  }
});