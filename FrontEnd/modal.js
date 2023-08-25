//- 4 - Création de la modale
let modal = document.getElementById("modal");
let modalClose = document.getElementById("modal-close");

//-Fonction pour afficher la boîte modale
function showModal() {
  modal.style.display = "block";
}

//-Fonction pour changer de vue dans la modale pour ajouter un projet
let backModalView = document.getElementById("arrow");
let addProject = document.getElementById("add_project");
backModalView.addEventListener('click', function() {
  showModalView(1)
  hideModalView(2)
});
addProject.addEventListener('click', function() {
  showModalView(2)
  hideModalView(1)
});

function showModalView(viewNumber) {
  let view1 = document.getElementById("modal_view1");
  let view2 = document.getElementById("modal_view2");
  let arrow = document.getElementById("arrow");
  if (viewNumber == 1) {
    view1.style.display = "block";
  } else if (viewNumber == 2) {
    view2.style.display = "flex";
    arrow.style.visibility = "visible";
  }
}

function hideModalView(viewNumber) {
  let view1 = document.getElementById("modal_view1");
  let view2 = document.getElementById("modal_view2");
  let arrow = document.getElementById("arrow");
  if (viewNumber == 1) {
    view1.style.display = "none";
  } else if (viewNumber == 2) {
    view2.style.display = "none";
    arrow.style.visibility = "hidden";
  }
}

function configModal2Form () {
  let projectImage = document.getElementById("project_image");
    projectImage.addEventListener("change", verifyImage);
    let categorySelector = document.getElementById("category-selector");
    categoryList.forEach((category) => {
      let option = document.createElement("option");
      option.value = category.name;
      option.innerHTML = category.name;
      option.setAttribute("data-categoryid", category.id);
      categorySelector.appendChild(option);
    });
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
      removePreviewImage();
    }
  } else {
    error("Aucun fichier sélectionné")
  }
}

//-Fonction pour masquer la boîte modale
let formNewProject = document.getElementById("newproject_form");
formNewProject.addEventListener("submit", function(e) {
  e.preventDefault();
  if (verifyFormValues()) {
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
    renderWork(newWork)
    displayWork(newWork)
    resetModal2Form()
    hideModalView(2)
    showModalView(1)
  } else {
      console.error("Le formulaire n'est pas valide");
  }
});

function hideModal() {
  modal.style.display = "none";

//     showModalView(1);
//     hideModalView(2);
//     console.log(workList);
//   } else {
}

function resetModal2Form () {
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
  category.value = "default";
  //hideImage
  //Show input + label
  let imageAdd = document.getElementById("project_image_add");
  let insightImage = document.getElementById("insight_image");
  let faImage = document.getElementById("fa-image");
  imageAdd.style.display = 'flex';
  insightImage.style.display = 'none';
  faImage.setAttribute('./assets/icons/icone-grise.png');
  faImage.style.display = 'flex';
}

//-Ajouter un gestionnaire d'évènements au bouton de fermeture pour masquer la modale
modalClose.addEventListener("click", function () {
  hideModal()
  hideModalView(1)
  hideModalView(2)
  resetModal2Form()
});

//-Exemple d'utilisation : afficher la modale lorsque le bouton est cliqué
let openModalButton = document.getElementById("open-modal-button");
openModalButton.addEventListener("click", function () {
  showModal()
  showModalView(1)
  formValues = {
    image: null,
    title: null,
    category: null,
  };
  displayWorks(workList);
  verifyFormValues();
});

//- 5 - Fonction pour afficher les travaux de la galerie dans la modale
function displayWork (work) {
  let div = document.createElement("div");
  div.style.position = "relative";
  div.style.display = "flex";
  div.style.justifyContent = "center";
  let image = document.createElement("img");
  image.src = work.imageUrl;
  image.alt = work.title;
  image.classList.add("style-image");
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
  let modalContainer = document.getElementById("modal_container1");
  modalContainer.appendChild(div);
}

function displayWorks(workList) {
  let modalContainer = document.getElementById("modal_container1");
  (modalContainer.innerHTML = ""),
    workList.forEach((work) => {
      displayWork(work)
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
        displayWorks(workList);
        console.log(workList);
        return response;
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
let title = document.getElementById("title");
title.addEventListener("input", saveTitle);
function saveTitle() {
  formValues.title = document.getElementById("title").value;
  verifyFormValues();
}

let categorySelect = document.getElementById("category-selector");
categorySelect.addEventListener("change", saveCategory);
function saveCategory() {
  let category = document.getElementById("category-selector").value;
  let categoryId = categoryList.filter((item) => item.name == category)[0].id;
  formValues.category = categoryId;
  verifyFormValues();
}

function verifyFormValues() {
  let buttonSubmit = document.getElementById("project_submit");
  buttonSubmit.setAttribute("disabled", "");
  if (
    formValues.title == null ||
    !formValues.title.length ||
    formValues.category == null ||
    formValues.image == null
  ) {
    return false;
  } else {
    buttonSubmit.removeAttribute("disabled");
    return true;
  }
}

let saveChanges = document.getElementById("save_changes");
saveChanges.addEventListener("click", createNewProject);

function createNewProject() {
  let token = sessionStorage.getItem("token");
  let formData = new FormData();
  if (verifyFormValues()) {
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
        alert(
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
  let imageAdd = document.getElementById("project_image_add");
    imageAdd.style.display = 'none';
}