const firebaseConfig = {
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  let nom = '';
  nom = document.cookie
            .split('; ')
            .find(row => row.startsWith('username='))
            .split('=')[1];
            console.log("Variable `nom` is set to:", nom);
let tags = [];
if (nom == ''){
  window.location.href = 'login.html';
}
function post() {
    const title = document.getElementById('inputtitle').value.trim();
    const text = document.getElementById('inputtext').value.trim();
    const imageInput = document.getElementById('file');
    let image = null;
    // Check if an image was uploaded
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(file.name);
      imageRef.put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          image = url;
          savePostData(title, text, tags, image); // Call a function to save the post data with the image
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          alert("An error occurred while uploading the image. Please try again later.");
        });
    } else {
      // If no image is uploaded, call the function with image as null
      savePostData(title, text, tags, image);
    }
  }
  function recreateAddTagButton() {
    // Create a new "Add Tag" button and add it to the tagContainer
    setTimeout(() => {
        const addTagButton = document.createElement('button');
        addTagButton.setAttribute('id', 'addTag');
        addTagButton.textContent = '+';
        addTagButton.setAttribute('onclick', 'handleAddTag()');
        tagContainer.appendChild(addTagButton);
        location.reload();
        tags = [];
      }, 1000);
    }
  // Function to save post data to Firebase Firestore
  function savePostData(title, text, tags, image) {
    // Validate that title and text are not empty
    if (title === "" || text === "") {
      alert("Please enter both title and text for your post.");
      return;
    }
    // Prepare the post data object
    const postData = {
      title: title,
      text: text,
      tags: tags,
      image: image,
      author: nom,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
      // Add any other fields you want to store in Firestore
    };
    // Add the post data to the "Posts" collection using Firestore's .add() method
    db.collection("Posts")
      .add(postData)
      .then((docRef) => {
        console.log("Post data saved successfully! Document ID:", docRef.id);
        // Clear the form inputs
        document.querySelector('.thought').value = "";
        document.querySelector('textarea.thought').value = "";
        document.getElementById('file').value = "";

        const addTagButton = document.createElement('button');
        addTagButton.setAttribute('id', 'addTag');
        addTagButton.textContent = '+';
        addTagButton.addEventListener('click', handleAddTag);
        tagContainer.appendChild(addTagButton);
        // Clear the tags display
        tagContainer.innerHTML = "";
      })
      .catch((error) => {
        console.error("Error saving post data:", error);
      });
    console.log("Post Data:", postData);
    tags = [];
    document.getElementById('inputtitle').value = "";
    document.getElementById('inputtext').value = "";
    document.getElementById('file').value = "";
    const actualBtn = document.getElementById('file');
    const fileChosen = document.getElementById('file-chosen');
    recreateAddTagButton();
    actualBtn.addEventListener('change', function(){
    fileChosen.textContent = this.files.length > 0 ? this.files[0].name : '* Not required';
    });
  }
  const tagContainer = document.getElementById('tags');
  const addTagBtn = document.getElementById('addTag');

  function handleAddTag() {
    const newTag = prompt('Enter a new tag:');
    if (newTag) {
      const tagSpan = document.createElement('span');
      tagSpan.textContent = `#${newTag}`;
      tagSpan.setAttribute('id', 'topic');
      tagSpan.style.cursor = 'pointer';
      tagContainer.appendChild(tagSpan);
      tags.push(`#${newTag}`);
    }
  }
  function getSelectedTags() {
    const tagsContainer = document.getElementById('tags');
    const tagSpans = tagsContainer.querySelectorAll('span');
    const selectedTags = [];
    tagSpans.forEach((tagSpan) => {
      if (tagSpan.classList.contains('selected')) {
        selectedTags.push(tagSpan.textContent);
      }
    });
    return selectedTags.join(',');
  }


//display

function displayPosts(posts) {
  const postContainer = document.getElementById('posts');
  postContainer.innerHTML = ''; // Clear existing posts

  // Loop through the posts and create HTML elements for each post
  posts.forEach((post) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post'); // Add the 'post' class to each post

    // Create the post title element
    const titleElement = document.createElement('p');
    titleElement.textContent = post.title;
    titleElement.classList.add('post-title');

    // Create the post author element
    const authorElement = document.createElement('span');
    authorElement.textContent = `-${post.author}`;
    authorElement.classList.add('author');

    // Create the tags elements
    const tagsElement = document.createElement('span');
    tagsElement.classList.add('tags');
    post.tags.forEach((tag) => {
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      tagElement.classList.add('tag');
      tagsElement.appendChild(tagElement);
    });

    // Create the post text element
    const textElement = document.createElement('pre');
    textElement.textContent = post.text;
    textElement.classList.add('post-text');

    // Create the post image element if available
    if (post.image) {
      const imageElement = document.createElement('img');
      imageElement.src = post.image;
      imageElement.classList.add('post-image');

      // Append the image after the text
      postDiv.appendChild(titleElement);
      postDiv.appendChild(authorElement);
      postDiv.appendChild(tagsElement);
      postDiv.appendChild(document.createElement('br'));
      postDiv.appendChild(textElement);
      postDiv.appendChild(document.createElement('br'));
      postDiv.appendChild(imageElement);
    } else {
      // If no image, just append the elements in the regular order
      postDiv.appendChild(titleElement);
      postDiv.appendChild(authorElement);
      postDiv.appendChild(tagsElement);
      postDiv.appendChild(document.createElement('br'));
      postDiv.appendChild(textElement);
    }

    // Add the postDiv to the post container
    postContainer.appendChild(postDiv);
    applyTransform();
  });
}

// Fetch the post data from Firebase
const postsRef = db.collection('Posts');

// Add an orderBy clause to order the posts by the 'timestamp' field
postsRef.orderBy('timestamp', 'desc')
  .get()
  .then((querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      posts.push(post);
    });

    // Display the posts on the page
    displayPosts(posts);
  })
  .catch((error) => {
    console.error('Error fetching posts:', error);
  });

  const currentuserspan = document.querySelector('.currentuser');
  currentuserspan.textContent = " " + nom + "?";

  function displayUsernames() {
  const newUsersDiv = document.getElementById("newusers");

  // Assuming you have initialized Firebase and have a Firestore reference
  const firestore = firebase.firestore();
  const usersCollectionRef = firestore.collection("users");

  // Fetch the usernames from Firestore (assuming you have a field called "username" in each document)
  usersCollectionRef.get()
    .then((querySnapshot) => {
      // Clear the existing content (in case you want to update the list)
      newUsersDiv.innerHTML = "";

      // Loop through the documents and generate the content
      querySnapshot.forEach((doc) => {
        const username = doc.data().username;

        // Create and append the <p> element with the username
        const pElement = document.createElement("p");
        pElement.style.marginLeft = "10px";
        pElement.textContent = username;
        newUsersDiv.appendChild(pElement);

        // Create and append the <hr> element
        const hrElement = document.createElement("hr");
        hrElement.style.width = "40%";
        newUsersDiv.appendChild(hrElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching usernames:", error);
    });
}

// Call the function to display usernames when the page is loaded or whenever you want to update the list
displayUsernames();
function logout(){
  setCookie('username', '', 999)
  window.location.href = '/public/index.html'
}
//cookies :D
function setCookie(name, value, daysToExpire) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
}