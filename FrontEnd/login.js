document.getElementById("form-login").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
  
  if (username === "" || password === "") {
    alert("Veuillez remplir tous les champs");
    return;
  } 
  // Si les données sont valides, vous pouvez appeler une fonction de connexion
  login(username, password);
});

function login(username, password) {
    ajaxRequest("POST", "/login", { username: username, password: password }, function(response) {
      if (response.success) {
        alert("Connexion réussie");
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect");
      }
    });
  }