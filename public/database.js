function watchAllBeers(onSnapshot) {
  const ref = firebase.database().ref('beers');
  ref.on(
    'value',
    function(snapshot) {
      const beers = [];
      snapshot.val().forEach(element => {
        beers.push(element);
      });
      onSnapshot(beers);
    },
    function(error) {
      console.log('Error: ' + error.code);
    }
  );
  return ref;
}

function watchAllBreweries(callback) {
  const ref = firebase.database().ref('breweries');
  ref.on(
    'value',
    function(snapshot) {
      const breweries = [];
      snapshot.val().forEach(element => {
        breweries.push(element);
      });
      callback(breweries);
    },
    function(error) {
      console.log('Error: ' + error.code);
    }
  );
  return ref;
}

function updateBeer(beerId, beer) {
  console.debug(`update beers/${beerId} ${JSON.stringify(beer)}`);
  firebase
    .database()
    .ref('beers/' + beerId)
    .set(
      {
        name: beer.name,
      },
      function(error) {
        if (error) {
          console.log('Error: ' + error.code);
        } else {
          console.debug(`update beers/${beerId} succeed`);
        }
      }
    );
}
