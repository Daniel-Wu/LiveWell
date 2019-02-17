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
  TextInput,
} from 'react-native';
import { WebBrowser, MapView, Constants, Location, Permissions } from 'expo';
import { Marker } from 'react-native-maps';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';


import { MonoText } from '../components/StyledText';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBTKIet6yPKfP12TwnCkyVXBiHhP5hagrA",
  authDomain: "livewell-treehacks.firebaseapp.com",
  databaseURL: "https://livewell-treehacks.firebaseio.com",
  projectId: "livewell-treehacks",
  storageBucket: "livewell-treehacks.appspot.com",
  messagingSenderId: "595091963289"
};

firebase.initializeApp(config);



//Home 
class HomeScreen extends React.Component {

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
      db:firebase.firestore(),
      markers: [],
      currentMarker: {          
        key:0,
        latitude: 0, 
        longitude: 0,
        title:"Selection",
        description:""},
    }
    this._populateMarkers()
  }


  _populateMarkers(){

      this.state.db.collection('sample').onSnapshot(snapshot => {
        const results = []
        snapshot.forEach(doc => {
         let data = doc.data()

         let new_marker = {
           key:doc.id,
           latitude: data.lat, 
           longitude: data.lng,
           title:"Some Title",
           description:"Hello world"
         }
         results.push(new_marker)

     });
      this.setState({markers: results})
   });
  };

  _addMarker(marker) {
     //this.setState({markers: [...this.state.markers, marker]});
     this.state.markers.push(marker)
  }

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
        onPress= {(e) => {
          let coordinate = e.nativeEvent.coordinate
          this.state.currentMarker.latitude = coordinate.latitude
          this.state.currentMarker.longitude = coordinate.longitude
          this.setState({currentMarker: this.state.currentMarker})
        }}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              title={marker.title}
              description={marker.description}
            />

          ))}
          <Marker
            key = {this.state.currentMarker.key}
            coordinate={{
                latitude: this.state.currentMarker.latitude,
                longitude: this.state.currentMarker.longitude
            }}
            title={this.state.currentMarker.title}
            description={this.state.currentMarker.description}
            pinColor='blue'
          />



        </MapView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => this.props.navigation.navigate('Report', {
            lat: this.state.currentMarker.latitude,
            lng: this.state.currentMarker.longitude,
          })}
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
    this.state = {
      text: "Type here", 
      db:firebase.firestore(),
    }

  }



  // /**
  //  * Adds a click to firebase.
  //  * @param {Object} data The data to be added to firebase.
  //  *     It contains the lat, lng, sender and timestamp.
  //  */
  addToFirebase(data) {
    var ref = this.state.db.collection('sample').add(data)
    .then(function(docRef) {
        this.state.db.collection('sample').doc(docRef.id).update({"timestamp": firebase.firestore.Timestamp.fromDate(new Date())});
    });
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        <Text style={styles.headerText}>What's wrong?</Text>

        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/LiveWellIcon.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <View
          style={{flex:1, marginLeft: 20, marginRight: 20, alignItems: 'stretch', justifyContent: 'center'}}
          >
        <TextInput
          style={{height: 100, fontSize: 30, color: 'grey', flex: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />

        <Button
          title="Submit Report"
          onPress={() => {
            var data = {
              lat: this.props.navigation.getParam('lat', 0),
              lng: this.props.navigation.getParam('lng', 0),
              quality: 1,
            };
            this.addToFirebase(data)
            this.props.navigation.navigate('Maps')
          }}
          style={{fontSize:30, height:30}}
        />
        </View>

      </View>
    );
  }
}

//Make navigator
const TabNavigator = createBottomTabNavigator({
  Home: { 
    screen: HomeScreen,
      navigationOptions: {
      tabBarTitle: 'Home',
      tabBarIcon: ({tintColor}) => <Ionicons name="md-home" size={30} color={tintColor} />,
    }
  },
  Maps: { 
    screen: MapsScreen,
      navigationOptions: {
      tabBarTitle: 'Map',
      tabBarIcon: ({tintColor}) => <Ionicons name="md-compass" size={30} color={tintColor} />,
    }
  },
  Report: {
    screen: ReportScreen,
    navigationOptions: {
      tabBarTitle: 'Report',
      tabBarIcon: ({tintColor}) => <Ionicons name="md-checkmark-circle" size={30} color={tintColor} />,
    }
  }
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
    marginTop: 10,
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
  },

});