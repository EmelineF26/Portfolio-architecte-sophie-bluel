//- 1 - Appel de l'API à l'aide de fetch pour récupérer les projets
async function getWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const data = await response.json();
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
  const toto = collectUniqueCategories();
  toto.then(param => {
	for (let item of param) 
	{
		console.log(item.name);
//-Création des boutons filtres
	const button = document.createElement('button');
	let filtersContainer = document.querySelector('#filters');
	filtersContainer.appendChild(button);
	button.textContent = "Tous";
	button.addEventListener('click', function() {
	const figures = document.querySelectorAll('figure');
		for (let figure of figures) {
			figure.style.display = 'block';
			}})
	}
		});
//-Fonction pour créer les boutons des filtres associés aux catégories

//  async function createFilterButtons(category) {
//  		console.log('titi', categoriesUniques);
//  	categoriesUniques.forEach((category) => {
//  		console.log('tata', category);
//  		createFilterButtons(category)
//  	})}

 	const createFilterButton = (category) => {
 		console.log('toto');
 	  const button = document.createElement('button');
 	  button.innerText = category.title;
 	  button.addEventListener('click', function() {
 		const figures = document.querySelectorAll('.projet');
 		for (let figure of figures) {
 		  if (figure.getAttribute('data-category-id') == category.id || category === null) {
 			//Affiche tous les blocs catégories
 			figure.style.display = 'block';
 		  } else {
 			figure.style.display = 'none';
 		  }
 		}
 	  });
 	  return button;
 	};

//-Bouton "Toutes les catégories"
 	// const tousFilters = createFilterButtons("Tous", null);
 	// filtersContainer.appendChild(tousFilters);
  
//-Boutons pour chaque catégorie unique
 	// categoriesUniques.forEach(function(category) {
 	// //   const button = createFilterButtons(category.name, category);
 	//   button.setAttribute('data-category-id', category.id);
 	//   filtersContainer.appendChild(button);
 	// });