//- 1 - Appel de l'API à l'aide de fetch pour récupérer les projets
let workList;
async function getWorks(idCategory = null) {
  const response = await fetch('http://localhost:5678/api/works');
  let data = await response.json();
  workList = data;
  if (idCategory) {
 	data = data.filter(work => work.categoryId == idCategory);
  }
  data.forEach((work) => {
	renderWork(work);
})}
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
	// console.log(work);
}


//- 3 - Récupération des catégories et réalisation du filtre
//-Génération du tableau de Catégories uniques
async function collectUniqueCategories() {
//-Fonction fetch sur l'API Catégories pour récuperer les catégories
	const response = await fetch("http://localhost:5678/api/categories");
	const categories = await response.json();
//-Création du tableau de catégories sans doublon grace à Set()
	const uniqueCategories = new Set(categories);
//-Création d'une "div" qui contiendra nos boutons filtres
	const filtersContainer = document.createElement('div');
	filtersContainer.setAttribute('id','filters');
	let gallery = document.querySelector('.gallery');
	let portfolio = document.querySelector('#portfolio');
	portfolio.insertBefore(filtersContainer, gallery);
	return uniqueCategories;
  }
//-Création des boutons filtres
  const categories = collectUniqueCategories();
  categories.then(categories => {
	const button = document.createElement('button');
	let filtersContainer = document.querySelector('#filters');
	filtersContainer.appendChild(button);
	button.textContent = "Tous";
	button.addEventListener('click', function () {
		getWorks();
	})
	for (let category of categories) 
	{
		const button = document.createElement('button');
		let filtersContainer = document.querySelector('#filters');
		filtersContainer.appendChild(button);

		console.log(category.id);
		if (category.id == 3) {
			button.innerHTML = "Hôtels & Restaurants";
		} else {
			button.innerText = category.name;
		}
		button.addEventListener('click', function() {
			const sectionGallery = document.querySelector(".gallery");
			sectionGallery.innerHTML = "";
			getWorks(category.id);
		})
	}})

//- 4 - Création de la modale

let modal = document.getElementById("modal");
let modalClose = document.getElementById("modal-close");

//-Fonction pour afficher la boîte modale
function showModal() {
  	modal.style.display = "block";
	// galleryItems.forEach(function(work) {
    // let galleryItems = document.createElement("div");
    // galleryItems.classList.add("gallery-item");
	// modalContent.appendChild(galleryItems);
	displayWorkModal(workList);
//   });
}

function displayWorkModal (workList) {
	console.log(workList);
	let modalContainer = document.getElementById("modal_container1");
	workList.forEach(work => {
		let figure = document.createElement("div");
		figure.style.position = "relative";
		figure.style.width = "17%";
		let image = document.createElement("img");
		image.src = work.imageUrl;
		image.alt = work.title;
		image.classList.add("style-image");
		// modalContainer.appendChild(image);
		let icon = document.createElement("i");
		icon.classList.add("fa-solid", "fa-trash");
		figure.appendChild(image);
		figure.appendChild(icon);
		modalContainer.appendChild(figure);
	})
}

//-Fonction pour masquer la boîte modale
function hideModal() {
  modal.style.display = "none";
}

//-Ajouter un gestionnaire d'événements au bouton de fermeture pour masquer la boîte modale
modalClose.addEventListener("click", hideModal);

//-Exemple d'utilisation : afficher la boîte modale lorsque le bouton est cliqué
let openModalButton = document.getElementById("open-modal-button");
openModalButton.addEventListener("click", showModal);