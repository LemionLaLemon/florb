const firebaseConfig = {
    apiKey: "AIzaSyAmIklkvQizta3qinqaXYIImYz_3yIQaCM",
    authDomain: "florb-6eb74.firebaseapp.com",
    projectId: "florb-6eb74",
    storageBucket: "florb-6eb74.appspot.com",
    messagingSenderId: "413728580900",
    appId: "1:413728580900:web:107434e2336ce858b8bfb1",
    measurementId: "G-31P0FQX4DD"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
let tags = [];
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
      capybaras: 0,
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