const Authentification = (function () {
  'use strict';

  let provider = new firebase.auth.GoogleAuthProvider();

  function onAuthStateChanged(callback) {
    firebase.auth().onAuthStateChanged(function (user) {
      callback(user);
    });
  }

  function googleSignin(onAuthenticated) {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;

        if (onAuthenticated) {
          onAuthenticated(token, user);
        }
      })
      .catch(function (error) {
        console.log('Error: ' + error.code);
      });
  }

  function googleSignout() {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log('Signout Succesfull');
        },
        function (error) {
          console.log('Error: ' + error.code);
          console.log('Signout Failed');
        }
      );
  }
  return {
    onAuthStateChanged,
    googleSignin,
    googleSignout
  }
})();