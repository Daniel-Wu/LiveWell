var db = firebase.firestore();

// /**
// * Data object to be written to Firebase.
// */
var data = {
  lat: null,
  lng: null
};

function makeInfoBox(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '2px';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '100%';
  controlText.style.padding = '6px';
  controlText.textContent = 'Click on map to upload to Firebase.';
  controlUI.appendChild(controlText);
}

// /**
// * Starting point for running the program. Authenticates the user.
// * @param {function()} onAuthSuccess - Called when authentication succeeds.
// */
// function initAuthentication(onAuthSuccess) {
//   firebase.authAnonymously(function(error, authData) {
//     if (error) {
//       console.log('Login Failed!', error);
//     } else {
//       data.sender = authData.uid;
//       onAuthSuccess();
//     }
//   }, {remember: 'sessionOnly'});  // Users will get a new id for every session.
// }

/**
 * Creates a map object with a click listener and a heatmap.
 */
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off POI.
    },
    {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus, train stations etc.
    }],
    disableDoubleClickZoom: true,
    streetViewControl: false,
  });

  // Create the DIV to hold the control and call the makeInfoBox() constructor
  // passing in this DIV.
  var infoBoxDiv = document.createElement('div');
  makeInfoBox(infoBoxDiv, map);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

  // Listen for clicks and add the location of the click to firebase.
  map.addListener('click', function(e) {
    data.lat = e.latLng.lat();
    data.lng = e.latLng.lng();
    addToFirebase(data);
  });

  db.collection('clicks').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(function(change) {
      // if (change.type === "added") {
      //     console.log("New city: ", change.doc.data());
      // }
      if (change.type === "modified") {
          console.log("Latitude: ", change.doc.data().lat, " | Longitude: ", change.doc.data().lng);
          
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(change.doc.data().timestamp.seconds);
      console.log("Timestamp: ", d);
      }
      // if (change.type === "removed") {
      //     console.log("Removed city: ", change.doc.data());
      // }
    });
  });

  //initAuthentication(afterAuth);
}

// /**
//  * Adds a click to firebase.
//  * @param {Object} data The data to be added to firebase.
//  *     It contains the lat, lng, sender and timestamp.
//  */
function addToFirebase(data) {
  var ref = db.collection('clicks').add(data)
  .then(function(docRef) {
      db.collection('clicks').doc(docRef.id).update({"timestamp": firebase.firestore.Timestamp.fromDate(new Date())});
  });
}