let workList;
let categoryList;

let login;
let formValues = {
  image: null,
  title: null,
  category: null,
};

displayBar();
function checkLogin() {
  let token = sessionStorage.getItem("token");
  token ? (login = true) : (login = false);
  if (login == true) {
  let buttonOpenModal = document.getElementById("open-modal-button");
      buttonOpenModal.style.display = 'block';
  }
}

function displayBar() {
  checkLogin();
  let bar = document.getElementById("bar");
  let loginButton = document.getElementById("login_button");
  if (login == true) {
    bar.style.visibility = "visible";
    loginButton.innerHTML = "logout";
    loginButton.addEventListener("click", logOut);
  }
}

function logOut() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

//- 1 - Appel de l'API à l'aide de fetch pour récupérer les projets
async function getWorks(idCategory = null) {
  const response = await fetch("http://localhost:5678/api/works");
  let data = await response.json();
  workList = data;
  if (idCategory) {
    data = data.filter((work) => work.categoryId == idCategory);
  }
  data.forEach((work) => {
    renderWork(work);
  });
}
getWorks();

//- 2 - Ajout à la galerie des travaux récupérés
function renderWork(work) {
  const sectionGallery = document.querySelector(".gallery");
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  img.src = work.imageUrl;
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  sectionGallery.appendChild(figure);
}

//- 3 - Récupération des catégories et réalisation du filtre
//-Génération du tableau de Catégories uniques
async function collectUniqueCategories() {
  //-Fonction fetch sur l'API Catégories pour récuperer les catégories
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  //-Création du tableau de catégories sans doublon grace à Set
  const uniqueCategories = new Set(categories);
  categoryList = categories;
  configModal2Form();
  //-Création d'une "div" qui contiendra nos boutons filtres
  const filtersContainer = document.createElement("div");
  filtersContainer.setAttribute("id", "filters");
  let gallery = document.querySelector(".gallery");
  let portfolio = document.querySelector("#portfolio");
  portfolio.insertBefore(filtersContainer, gallery);
  return uniqueCategories;
}
//-Création des boutons filtres
const categories = collectUniqueCategories();
categories.then((categories) => {
  const button = document.createElement("button");
  button.classList.add("style_btn");
  let filtersContainer = document.querySelector("#filters");
  filtersContainer.appendChild(button);
  button.textContent = "Tous";
  button.addEventListener("click", function () {
    getWorks();
  });
  for (let category of categories) {
    const button = document.createElement("button");
    button.classList.add("style_btn");
    let filtersContainer = document.querySelector("#filters");
    filtersContainer.appendChild(button);
    // console.log(category.id);
    if (category.id == 3) {
      button.innerHTML = "Hôtels & Restaurants";
    } else {
      button.innerText = category.name;
    }
    button.addEventListener("click", function () {
      const sectionGallery = document.querySelector(".gallery");
      sectionGallery.innerHTML = "";
      getWorks(category.id);
    });
  }
});