$(document).ready(function(){
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyyFFQHq6G56mQ_tdR4xO6-lpV9IqmsMM",
  authDomain: "hellchat-53c4e.firebaseapp.com",
  databaseURL: "https://hellchat-53c4e.firebaseio.com",
  projectId: "hellchat-53c4e",
  storageBucket: "hellchat-53c4e.appspot.com",
  messagingSenderId: "1058322765334"
};
firebase.initializeApp(config);
var dbChatRef = firebase.database().ref().child('chatroom');
  var dbUserRef = firebase.database().ref().child('userdata');
  var storageRef = firebase.storage().ref();
  //try
  $(".information_layoyut").hide();
  $(".info_show_layoyut").hide();
  var $img = $('img');

  var $btnLogout = $(".btnLogout");
  //define the sing lable
  var $email = $(".emailInput");
  var $password = $(".passwordInput");
  var $btnSingUp = $("#btn_sing_up");
  var $btnSingIn = $("#btn_sing_in");

  //define the chat lable
  var $messageField = $(".messageInput");
  var $messageList = $('#example-messages');
  var $btnSubmit = $('#btn_submit');

  //define the information fix lable
  var $nameField = $(".nameInput");
  var $qccupation = $(".qccupationInput");
  var $ageField = $(".ageInput");
  var $description = $(".descriptionInput");
  var $btnInfoSubmit = $('#btn_info_submit');
  var photoURL;
  const $file = $('#file');
  //click the logout button
  $btnLogout.click(function(){
    firebase.auth().signOut();
    console.log("signOut");
  });
  //click config_info button
  $(".config_info").click(function(){
    $(".sing_in_layout").hide();
    $(".chat_layoyut").hide();
    $(".information_layoyut").show();
    $(".info_show_layoyut").hide();
  });
  $(".chat_room").click(function(){
    $(".sing_in_layout").hide();
    $(".chat_layoyut").show();
    $(".information_layoyut").hide();
    $(".info_show_layoyut").hide();
  });
  $(".info_show").click(function(){
    $(".sing_in_layout").hide();
    $(".chat_layoyut").hide();
    $(".information_layoyut").hide();
    $(".info_show_layoyut").show();
  });

  //chick the sing up button
  $btnSingUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email,pass);
    promise.catch(function(e){
      console.log(e.message);
    })
    promise.then(function(user){
      const dbUserid = dbUserRef.child(user.uid);
      dbUserid.update({email:user.email});
      $(".sing_in_layout").hide();
      $(".chat_layoyut").hide();
      $(".information_layoyut").show();
      $(".info_show_layoyut").hide();
    });
  })
  //Listening Login user
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      console.log(user);
      user.providerData.forEach(function(profile){
        console.log("Sing-in provider:" + profile.providerId);
        console.log("Provider-specific UID:" + profile.uid);
        console.log("Name:" + profile.displayName);
        console.log("Email:" + profile.email);
        console.log("Photo URL:" + profile.photoURL);
      });
      dbChatRef.limitToLast(10).on('child_added',function(snapshot){
        var data = snapshot.val();
        var username = data.name || "anonymous";
        var message = data.text;
        var userPhoto = data.photoURL || "https://firebasestorage.googleapis.com/v0/b/homework5-3b356.appspot.com/o/images%2F15401122_1162067927237191_7473310595232118502_n.jpg?alt=media&token=24ecae9c-80b8-40b5-8c4d-528df6584b07";

        var $messageElement = $("<li style='list-style-type: none'>");
        var $divElement = $("<span class='mdl-chip mdl-chip--contact'></span>")
        var $userImgElement = $("<img class='mdl-chip__contact' src=''></img>");
        var $barElement = $("<span class='mdl-chip__text'></span>");
        var $nameElement = $("<strong class='example-chat-username'></strong>");
        $nameElement.text(username);
        $barElement.text("   " + message).prepend($nameElement);
        $userImgElement.attr({"src": userPhoto});
        $divElement.append($userImgElement);
        $divElement.append($barElement);
        $messageElement.append($divElement);
        $messageList.append($messageElement);
        $messageList[0].scrollTop = $messageList[0].scrollHeight;
      });
      dbUserRef.child(firebase.auth().currentUser.uid).on('value',function(snapshot){
        $nameField.val(user.displayName);
        $description.val(snapshot.val().description);
        $ageField.val(snapshot.val().age);
        $qccupation.val(snapshot.val().qccupation);
        photoURL = user.photoURL;
        $("#nametext").html(user.displayName);
        $("#user_img").attr({
          "style" : "background: url('" + photoURL + "') center / cover;"
        });
        $("#userinfo").html(function(){
          var text = "<li><b>description</b>:" + snapshot.val().description + "</li>"
          text += "<li><b>age</b>:" + snapshot.val().age + "</li>"
          text += "<li><b>qccupation</b>:" + snapshot.val().qccupation + "</li>"
          return text;
        });
      });
    }else{
      console.log("not logged in");
      $(".sing_in_layout").show();
      $(".chat_layoyut").hide();
      $(".information_layoyut").hide();
      $(".error_information_card").hide();
      $(".info_show_layoyut").hide();
      $nameField.val("");
      $description.val("");
      $ageField.val("");
      $qccupation.val("");
      $messageList.empty();
    }
  });
  //chick the sing in button
  $btnSingIn.click(function(e){

    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(function(e){
      console.log(e.message);
      $(".error_information_card").show();
      $(".error_information").append("<p>"+e.message+"</p>");
    });
    promise.then(function(e){
      $(".sing_in_layout").hide();
      $(".chat_layoyut").show();
      $(".information_layoyut").hide();
      $(".info_show_layoyut").hide();
    });
  });

  //enter to the message
  $messageField.keypress(function(e){
    if(e.keyCode == 13){
      var username = $nameField.val();
      var message = $messageField.val();
      console.log(username);
      console.log(message);

      dbChatRef.push({name:username,text:message,photoURL:photoURL});
      $messageField.val('');
    }
  });
  $btnSubmit.click(function(e){
    var username = $nameField.val();
    var message = $messageField.val();
    console.log(username);
    console.log(message);

    dbChatRef.push({name:username,text:message,photoURL:photoURL});
    $messageField.val('');
  });


  $file.change(function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];

    var metadata = {
      'contentType': file.type
    };

    // Push to child path.
    // [START oncomplete]
    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log(snapshot.metadata);
      photoURL = snapshot.metadata.downloadURLs[0];
      console.log('File available at', photoURL);
    }).catch(function(error) {
      // [START onfailure]
      console.error('Upload failed:', error);
      // [END onfailure]
    });
    // [END oncomplete]
  });


  window.onload = function() {
    $file.change(handleFileSelect);
    // $file.disabled = false;
  }


  //enter the information submit
  $btnInfoSubmit.click(function(e){
    const user = firebase.auth().currentUser;
    const age = $ageField.val();
    const name = $nameField.val();
    const qccupation = $qccupation.val();
    const description = $description.val();
    const promise = user.updateProfile({
      displayName: name,
      photoURL: photoURL
    });

    promise.then(function(){

      const dbUserid = dbUserRef.child(user.uid);
      dbUserid.update({'age':age,'qccupation':qccupation,'description':description});

      $(".sing_in_layout").hide();
      $(".chat_layoyut").show();
      $(".information_layoyut").hide();
      $(".info_show_layoyut").hide();
    });
  });
});
