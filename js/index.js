  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAon9_kStpk5Wljxk5jDCi4zOMjswLwLVs",
    authDomain: "oronoticias-f990a.firebaseapp.com",
    databaseURL: "https://oronoticias-f990a.firebaseio.com",
    projectId: "oronoticias-f990a",
    storageBucket: "oronoticias-f990a.appspot.com",
    messagingSenderId: "649049354655",
    appId: "1:649049354655:web:d1708190f08865ccc44daa"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  //PARA REGISTRARSE...
  /*
  function signUp(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e=> alert(e.message));

    alert("Usuario registrado");
  }
  */
  

  //PARA ENTRAR
  function signIn(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      alert("DATOS CORRECTOS");
      window.location.replace("inicio.html");
    })
    .catch((error) => {
      alert("DATOS INCORRECTOS");
      var errorCode = error.code;
      var errorMessage = error.message;
    });

    /*
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    
    promise.catch(e=> alert(e.message));
    alert("Signed Up");
    */
  }

  //PARA CERRAR SESIÓN...
  function signOut(){
      auth.signOut();
  }

  taskForm.addEventListener('submit', async (e)=> {
    e.preventDefault();
    signIn();
  })

