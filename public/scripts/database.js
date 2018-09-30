function watchBeers(onChildAdded, onChildChanged, onChildRemoved) {
  const ref = firebase.database().ref('beers');
  ref.on('child_added', data => {
    const item = data.val();
    item.key = data.key;
    onChildAdded(item);
  });
  ref.on('child_changed', data => {
    const item = data.val();
    item.key = data.key;
    onChildChanged(item);
  });
  ref.on('child_removed', data => {
    onChildRemoved(data.key);
  });
}

function updateBeer(beer) {
  console.debug(`update beers/${beer.key} ${JSON.stringify(beer)}`);
  firebase
    .database()
    .ref('beers/' + beer.key)
    .set(
      {
        name: beer.name,
      },
      function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`update beers/${beer.key} succeed`);
        }
      }
    );
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
