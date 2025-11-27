const firebaseConfig = {
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//cookies :D
function setCookie(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  }
// Function to check if a user with the given username and password exists in the "users" collection
function loginUser(username, password) {
    const usersRef = db.collection("users");

    return usersRef
      .where("username", "==", username)
      .where("password", "==", password)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          return false; // User not found
        } else {
          return true; // User found
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        return false;
      });
  }

  // Function to handle the login button click
  function login() {
    const username = document.getElementById("usernamein").value;
    const password = document.getElementById("passwordin").value;

    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }

    loginUser(username, password)
      .then((userExists) => {
        if (userExists) {
          setCookie("username", username, 21);
          window.location.href = "app.html";
        } else {
          alert("Invalid username or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }
