const Database = (function() {
  function watchBeers(onChildAdded, onChildChanged, onChildRemoved) {
    const beersRef = firebase.database().ref('beers');
    beersRef.on('child_added', data => {
      const item = data.val();
      item.key = data.key;
      watchUserRate(item, onChildAdded);
    });
    beersRef.on('child_changed', data => {
      const item = data.val();
      item.key = data.key;
      onChildChanged(item);
    });
    beersRef.on('child_removed', data => {
      onChildRemoved(data.key);
    });
  }

  function watchUserRate(beer, callback) {
    if (!firebase.auth().currentUser) {
      callback(beer);
    }
    const userId = firebase.auth().currentUser.uid;
    const usersRatesRef = firebase
      .database()
      .ref(`users-rates/${beer.key}/${userId}/rate`);
    usersRatesRef.once('value', data => {
      beer.userRate = data.val();
      callback(beer);
    });
  }

  function updateBeer(beer) {
    console.debug(`update beers/${beer.key} ${JSON.stringify(beer)}`);
    firebase
      .database()
      .ref(`beers/${beer.key}/name`)
      .set(beer.name, function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`update beers/${beer.key} succeed`);
        }
      });
  }

  function rateABeer(beerKey, rateValue) {
    console.debug(`rateABeer(${beerKey}, ${rateValue})`);
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`users-rates/${beerKey}/${userId}/rate`)
      .set(rateValue, function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`rateABeer(${beerKey}) succeed`);
        }
      });
  }

  function deleteBeer(key) {
    firebase
      .database()
      .ref('beers/' + key)
      .remove(function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`delete beers/${key} succeed`);
        }
      });
  }

  function addNewBeer(beer) {
    const newKey = firebase
      .database()
      .ref()
      .child('beers')
      .push().key;
    return firebase
      .database()
      .ref('/beers/' + newKey)
      .set(beer, function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`add new beers/${newKey} succeed`);
        }
      });
  }
  return {
    addNewBeer,
    deleteBeer,
    updateBeer,
    watchBeers,
    rateABeer,
  };
})();
