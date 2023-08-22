document.getElementById("login").addEventListener("submit", function (event) {
  event.preventDefault();

  //-Récupérer inputs username et password
  let inputUsername = document.getElementById("username");
  let usernameValue = inputUsername.value;

  let inputPassword = document.getElementById("password");
  let passwordValue = inputPassword.value;

  login(usernameValue, passwordValue);
})

function login(username, password) {
  let url = "http://localhost:5678/api/users/login";
  let data = {
    email: username,
    password: password
  };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  fetch(url, options)
    .then(function (response) {
      if (response.ok) {
        return response.json(); //-Convertit la réponse en JSON
      } else {
        throw new Error("Erreur lors de la requête de connexion");
      }
    })
    .then(function (data) {
      //-Traiter la réponse JSON
      if (data.token) {
        alert("Connexion réussie");
        //-Effectuer les actions supplémentaires nécéssaires
        sessionStorage.setItem("token", data.token);
        //-Redirection de l'utilisateur vers une autre page ou effectuer d'autres actions nécessaires
        window.location.href = 'index.html';
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect");
      }
    })
    .catch(function (error) {
      console.error("Erreur lors de la requête de connexion:", error);
    })
};