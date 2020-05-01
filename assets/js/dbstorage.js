



firebase.auth().onAuthStateChanged(function (user) {
    
    if (user) {
      // User is signed in.
      console.log("hello");
      // document.getElementById("user_div").style.display = "none";
    //   document.getElementById("login_div").style.display = "none";
  
      var user = firebase.auth().currentUser;
      // var userID = user.uid;
      // var db = firebase.database().ref('users/' + userID);
      // var email = firebase.auth().currentUser.email;
  
      // var flag = false;
      //     db.on('value', function(users){
      //         users.forEach(function(data) {
      //             var usere = data.val();
      //             if(usere.email === email)
  
      //              flag= true;
      //         });
  
      //          if(flag === false)
      //          {
      //              firebase.database().ref('users/'+userID).child('email').set(email);
      //          }
      //         });
     
  
      if (user != null) {
        console.log("hello");
        // var email_id = user.email;
        localStorage.setItem('id',user.uid);
        // document.getElementById("user_para").innerHTML =
        //   "Welcome User : " + email_id;
          var user_id=user.uid;
          var db =firebase.database().ref('users/' +user_id );
          console.log(user.email);
          console.log(localStorage.getItem('id'));
        //   var user_id=user.uid;
        //   var db =firebase.database().ref('users/' +user_id );
          db.once('value',function(data){
            console.log(data.key);
              if(!data.hasChild('name')){
                  console.log('name');
                var name=document.getElementById("name").value;
                db.child('name').set(name);
              }
            }).then(function(){
               
                window.location= "main.html";
            });

          // db.once('value',function(data){
          //   if(data.hasChild("name")&&data.hasChild("city")&&data.hasChild("mobile")){
          //     document.getElementById("user_div").style.display = "none";
          //     window.location = "iframe.html";
          //     console.log("iframe");
          //   }
          //   else{
              
          //     document.getElementById("user_div").style.display = "block";
              
          //    // window.location="registration_form.html";
          //     console.log("registrtaion");
          //   }
  
          // });
        
  
  
      }
    } else {
      // No user is signed in.
  
      //  document.getElementById("user_div").style.display = "none";
      // document.getElementById("login_div").style.display = "block";
    }
  
  
    // window.location = "iframe.html";
  
  
  
  
  });

  if(document.getElementById('signupform'))
  document.getElementById('signupform').addEventListener('submit', signUp);
  function signUp(e) {
    e.preventDefault();
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("pass").value;
  
  
    firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, userPass)
      .then(function () {
          console.log("hello");
        //   var user_id =localStorage.getItem('id');
         

        // var id = firebase.auth().currentUser.uid;
        // // window.location.replace("contact.html");
        // localStorage.setItem("id", id);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
  
        window.alert("Error : " + errorMessage);
  
        // ...
      });
      
  }
if(document.getElementById('loginform'))
  document.getElementById('loginform').addEventListener('submit', login);
  function login(e) {
    //   alert("hello");
    e.preventDefault();
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("pass").value;
  
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPass)
      .then(function () {
          console.log("hello");
        // var id = firebase.auth().currentUser.uid;
        // // window.location.replace("viewprofile.html");
        // localStorage.setItem("id", id);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
  
        // window.alert("Error : " + errorMessage);
   alert("No existing user with this account. Please create new account");
        // ...
      });
  }
  
  // function ClearHistory()
  // {
  //      var backlen = history.length;
  //      history.go(-backlen);
  //     //  window.location = "index.html";
  // }
