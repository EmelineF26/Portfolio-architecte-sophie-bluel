//- 4 - Création de la modale

let modal = document.getElementById("modal");
let modalClose = document.getElementById("modal-close");

//-Fonction pour afficher la boîte modale
function showModal() {
	formValues = {
		image: null,
		title: null,
		category: null,
	};
  modal.style.display = "block";
  displayWorkModal(workList);
  verifyFormValues();
  let imageAdd = imageAdd.style.display = 'block';
}

//-Fonction pour changer de vue dans la modale pour ajouter un projet
function switchModalView(viewNumber) {
  let view1 = document.getElementById("modal_view1");
  let view2 = document.getElementById("modal_view2");
  let arrow = document.getElementById("arrow");
  if (viewNumber == 1) {
    view1.style.display = "flex";
    view2.style.display = "none";
    arrow.style.visibility = "hidden";
  } else if (viewNumber == 2) {
    view1.style.display = "none";
    view2.style.display = "flex";
    arrow.style.visibility = "visible";
    let projectImage = document.getElementById("project_image");
    projectImage.addEventListener("change", verifyImage);
    let categorySelector = document.getElementById("category-selector");
    // console.log(categoryList);
    categoryList.forEach((category) => {
      let option = document.createElement("option");
      option.value = category.name;
      option.innerHTML = category.name;
      option.setAttribute("data-categoryid", category.id);
      categorySelector.appendChild(option);
    });
  }
}

//-Vérification du poids de l'image uploadée
function verifyImage() {
  let image = document.getElementById("project_image");
  let errorMessage = document.getElementById("error_message");
  let parent = document.getElementById("parent_insight");
  if (image.files.length > 0) {
    const size = image.files.item(0).size;
    const sizeMB = size / 1024 ** 2;
    if (sizeMB > 1) {
      let insightImage = document.getElementById("insight_image");
      if (insightImage != null) {
        parent.lastElementChild.remove();
      }
      errorMessage.innerHTML = "L'image doit peser moins de 4Mo.";
    } else {
      errorMessage.innerHTML = "";
      let insightImage = document.createElement("img");
      insightImage.setAttribute("id", "insight_image");
      const file = image.files[0];
      insightImage.src = URL.createObjectURL(file);
      parent.innerHTML = "";
      parent.append(insightImage);
      formValues.image = file;
      verifyFormValues("modal");
    }
  } else {
    //error("Aucun fichier sélectionné")
  }
}

//-Fonction pour masquer la boîte modale
function hideModal(e) {
  e.preventDefault();
  switchModalView(1);
  modal.style.display = "none";
  if (verifyFormValues("save_changes")) {
    let category = categoryList.filter(
      (category) => category.id == formValues.category
    )[0];

    let url = URL.createObjectURL(formValues.image);
    let newWork = {
      category: { id: formValues.category, name: category.name },
      categoryId: formValues.category,
      imageUrl: url,
      title: formValues.title,
      userId: 0,
    };
    //workList.unshift(newWork);
    renderWork(newWork);
    console.log(workList);
  } else {
    formValues = {
      image: null,
      title: null,
      category: null,
    };
    let project_image = document.getElementById("project_image");
    let title = document.getElementById("title");
    let category = document.getElementById("category-selector");
    project_image.value = null;
    title.value = null;
    category.value = null;
  }
}

//-Ajouter un gestionnaire d'évènements au bouton de fermeture pour masquer la modale
modalClose.addEventListener("click", hideModal);

//-Exemple d'utilisation : afficher la modale lorsque le bouton est cliqué
let openModalButton = document.getElementById("open-modal-button");
openModalButton.addEventListener("click", showModal);

//- 5 - Fonction pour afficher les travaux de la galerie dans la modale

function displayWorkModal(workList) {
  // console.log(workList);
  let modalContainer = document.getElementById("modal_container1");
  (modalContainer.innerHTML = ""),
    workList.forEach((work) => {
      let div = document.createElement("div");
      div.style.position = "relative";
      div.style.display = "flex";
      div.style.justifyContent = "center";
      let image = document.createElement("img");
      image.src = work.imageUrl;
      image.alt = work.title;
      image.classList.add("style-image");
      // modalContainer.appendChild(image);
      let icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-trash");
      icon.setAttribute("data-workid", work.id);

      icon.addEventListener("click", function (e) {
        e.preventDefault();
        console.log(e.target.getAttribute("data-workid"));
        removeProject(e.target.getAttribute("data-workid"));
      });
      div.appendChild(image);
      div.appendChild(icon);
      modalContainer.appendChild(div);
    });
}

//-Fonction pour supprimer des travaux existants
const id = "123";

function removeProject(id) {
  let token = sessionStorage.getItem("token");
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Le travail sélectionné a été supprimé avec succès.");
        console.log(workList);
        workList = workList.filter((work) => work.id != id);
        displayWorkModal(workList);
        console.log(workList);
        return response;
        //   const figure = document.querySelector(`figure#"${id}"`);
        //         figure.remove();
      } else {
        alert("Erreur lors de la suppression du projet");
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la suppression du travail sélectionné.",
        error
      );
    });
}

//- 6 - Envoi d'un nouveau projet au back end pour l'ajouter à la galerie

function saveTitle() {
  formValues.title = document.getElementById("title").value;
  verifyFormValues("modal");
}

function saveCategory() {
  let category = document.getElementById("category-selector").value;
  let categoryId = categoryList.filter((item) => item.name == category)[0].id;
  formValues.category = categoryId;
  verifyFormValues("modal");
}

function verifyFormValues(calledFrom) {
  let buttonSubmit = document.getElementById("project_submit");
  buttonSubmit.setAttribute("disabled", "");
  // console.log(buttonSubmit);
  if (
    (formValues.title != null && !formValues.title.length) ||
    formValues.title == null ||
    formValues.category == null ||
    formValues.title == null
  ) {
    return false;
  } else if (formValues.title && formValues.category && formValues.image) {
    if (calledFrom == "modal") {
      buttonSubmit.removeAttribute("disabled");
    } else if (calledFrom == "save_changes") {
      return true;
    }
  }
}

function createNewProject(e) {
  e.preventDefault();
  $("#project_image").change(function(){
    let imageAdd= document.getElementById('project_image_add');
    imageAdd.style.display = 'none';
  });
  let token = sessionStorage.getItem("token");
  let formData = new FormData();
  if (verifyFormValues("save_changes")) {
    formData.append("title", formValues.title);
    formData.append("category", formValues.category);
    formData.append("image", formValues.image);
  }

  fetch(`http://localhost:5678/api/works/`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Le projet a été ajouté avec succès.", response);
        formValues = {
          image: null,
          title: null,
          category: null,
        };
        let project_image = document.getElementById("project_image");
        let title = document.getElementById("title");
        let category = document.getElementById("category-selector");
        project_image.value = null;
        title.value = null;
        category.value = null;
      } else {
        console.error(
          "Une erreur s'est produite lors de l'ajout du projet.",
          response.status
        );
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'ajout du projet.",
        error
      );
    });
}

function removePreviewImage() {
  const previewImage = document.getElementById("fa-image");
  previewImage.src = "";
     previewImage.style.display = "none";
  }