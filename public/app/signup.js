const firebaseConfig = {
  };
  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Create an empty array to store the usernames
const usernamesArray = [];

// Reference to the "users" collection
const usersRef = db.collection("users");

// Get all documents from the "users" collection
usersRef.get()
  .then((querySnapshot) => {
    // Loop through each document in the query snapshot
    querySnapshot.forEach((doc) => {
      // Get the "username" field value from each document
      const username = doc.data().username;

      // Push the username into the array
      usernamesArray.push(username);
    });

    // Now the "usernamesArray" contains all the usernames from the "users" collection
    console.log(usernamesArray);
  })
  .catch((error) => {
    console.error("Error fetching usernames:", error);
  });
const policymodal = document.getElementById('policy');
function showpolicy(){
  policymodal.showModal();
}
function policy(agreed){
  if(agreed){
    signup();
  }
  else{
  }
}
//cookies :D
function setCookie(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  }
//firebasifysendingthingthingmagicgptdid the userdata
usernameElement = document.getElementById('usernamein');
let username = usernameElement.value;
passwordElement = document.getElementById('passwordin');
let password= usernameElement.value;
function signup(){
    let username = usernameElement.value;
    let password = passwordElement.value;
    if (usernamesArray.includes(username)) {
        alert('Someone else impersonated you and the username is taken, Try a different one.');
    }
    else if(username != '') {
        const newUser = {
            username: username,
            password: password,
          };
        usersRef
        .add(newUser)
        .then((docRef) => {
            console.log("Document added with ID:", docRef.id);
            setCookie("username", username, 21);
            const nom = document.cookie
            .split('; ')
            .find(row => row.startsWith('username='))
            .split('=')[1];
            console.log("Cookie `username` set to:", nom);
            window.location.replace("app.html");
        })
        .catch((error) => {
            console.error("Error adding document:", error);
        });
    }
    else{
        alert('am i blind or is there no username or password');
    }

}
