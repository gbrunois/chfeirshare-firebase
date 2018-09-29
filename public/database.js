
function readAllBeers() {
  var starCountRef = firebase.database().ref("beers");
  starCountRef.on(
    "value",
    function(snapshot) {
      let str = '';
      snapshot.val().forEach(element => {
        str += `${element.name}</br>`;
      });
      document.getElementById("load").innerHTML = str;
    },
    function(error) {
      console.log("Error: " + error.code);
    }
  );
}