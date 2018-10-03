const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAverageRate = functions.database
  .ref('/users-rates/{beerKey}/{userId}/rate')
  .onWrite((change, context) => {
    const userId = context.params.userId;
    const beerKey = context.params.beerKey;
    console.log(`onWrite /users-rates/${beerKey}/${userId}/rate`);

    return admin
      .database()
      .ref(`/users-rates/${beerKey}`)
      .once('value')
      .then(snapshot => {
        const userRates = [];
        snapshot.forEach(data => {
          userRates.push(data.val());
        });
        return userRates;
      })
      .then(userRates => {
        const allRates = userRates.map(x => x.rate);
        const newBeerRate =
          allRates.reduce((total, rate) => {
            total += rate;
            return total;
          }) / allRates.length;
        return newBeerRate;
      })
      .then(newBeerRate =>
        admin
          .database()
          .ref(`/beers/${beerKey}/rate`)
          .set(newBeerRate)
      );
  });
