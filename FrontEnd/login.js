document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();
    function login(username, password) {
    let url = "http://localhost:5678/api/users/login";
    let data = {
      username: username,
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
        .then(function(response) {
          if (response.ok) {
            return response.json(); // Convertit la réponse en JSON
          } else {
            throw new Error("Erreur lors de la requête de connexion");
          }
      })
      .then(function(data) {
        // Traiter la réponse JSON
        if (data.success) {
          alert("Connexion réussie");
          // Rediriger l'utilisateur vers une autre page ou effectuer d'autres actions nécessaires
        } else {
          alert("Nom d'utilisateur ou mot de passe incorrect");
        }
      })
      .catch(function(error) {
        console.error("Erreur lors de la requête de connexion:", error);
      });
  }})