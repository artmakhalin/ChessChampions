//Config
const API_URL =
  "https://6893186bc49d24bce8696873.mockapi.io/champions/champions";

//DOM
const championsDiv = document.getElementById("championsDiv");
const newChampionName = document.getElementById("newChampionName");
const newChampionYears = document.getElementById("newChampionYears");
const newChampionPhoto = document.getElementById("newChampionPhoto");
const addChampionBtn = document.getElementById("addChampionBtn");
const searchChampionName = document.getElementById("searchChampionName");
const clearSearch = document.getElementById("clearSearch");

//State
let championsCache = [];

//Init
init();

function init() {
  loadChampions();
  bindEvents();
}

//Events
function bindEvents() {
  searchChampionName.oninput = debounce(() => renderChampions(currentView()));

  clearSearch.onclick = () => {
    searchChampionName.value = "";
    renderChampions(currentView());
  };

  addChampionBtn.onclick = async () => {
    try {
      const data = {
        name: newChampionName.value.trim(),
        yearsOfChampions: newChampionYears.value.trim(),
        photoUrl: newChampionPhoto.value.trim(),
      };

      validateChampion(data);
      const champ = await addChampion(data);
      alert(`Champion ${champ.name} added`);
      clearForm();
    } catch (error) {
      showError(error.message);
    }
  };

  championsDiv.onclick = (event) => {
    const id = event.target.dataset.id;

    if (event.target && event.target.matches("button.editChamp")) {
      renderEditChampionCard(id);
    }

    if (event.target && event.target.matches("button.deleteChamp")) {
      deleteChampion(id);
    }
  };
}

//Business logic
async function loadChampions() {
  try {
    championsCache = await request(API_URL);
    renderChampions(championsCache);
  } catch (error) {
    showError("Failed to load champions");
  }
}

async function addChampion(data) {
  try {
    const newChampion = await request(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    championsCache.push(newChampion);
    renderChampions(currentView());
    return newChampion;
  } catch (error) {
    showError("Failed to add champion");
    throw error;
  }
}

async function updateChampion(data) {
  try {
    const updated = await request(`${API_URL}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    championsCache = championsCache.map((ch) =>
      ch.id === data.id ? updated : ch
    );

    renderChampions(currentView());
  } catch (error) {
    showError("Failed to update champion");
  }
}

async function deleteChampion(id) {
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    alert(`Champion with id ${id} removed`);
    championsCache = championsCache.filter((ch) => ch.id !== id);
    renderChampions(currentView());
  } catch (error) {
    showError("Failed to delete champion");
  }
}

//Render
function renderChampions(data) {
  championsDiv.innerHTML = "";
  data.forEach((champ) => {
    championsDiv.appendChild(renderChampionCard(champ));
  });
}

function renderChampionCard(champ) {
  const div = document.createElement("div");
  div.classList.add("champion-card");
  div.dataset.id = champ.id;
  div.id = `champion-${champ.id}`;

  const p = document.createElement("p");
  p.textContent = champ.name;
  div.appendChild(p);

  const pDate = document.createElement("p");
  pDate.textContent = champ.yearsOfChampions;
  div.appendChild(pDate);

  const img = document.createElement("img");
  img.src = `${champ.photoUrl}`;
  img.alt = "Champion";
  div.appendChild(img);

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("card-actions");
  div.appendChild(buttonsWrapper);

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "X";
  btnDelete.classList.add("deleteChamp");
  btnDelete.dataset.id = champ.id;

  const btnEdit = document.createElement("button");
  btnEdit.textContent = "Edit";
  btnEdit.classList.add("editChamp");
  btnEdit.dataset.id = champ.id;

  buttonsWrapper.appendChild(btnEdit);
  buttonsWrapper.appendChild(btnDelete);

  return div;
}

function renderEditChampionCard(id) {
  closeActiveEdit();

  const oldChampion = championsCache.find((ch) => ch.id === id);

  if (!oldChampion) {
    showError("Champion not found");
    return;
  }

  const divToEdit = document.getElementById(`champion-${id}`);
  divToEdit.classList.add("edit-mode");
  divToEdit.innerHTML = "";

  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.value = oldChampion.name;
  divToEdit.appendChild(inputName);

  const inputDate = document.createElement("input");
  inputDate.type = "text";
  inputDate.value = oldChampion.yearsOfChampions;
  divToEdit.appendChild(inputDate);

  const inputImg = document.createElement("input");
  inputImg.type = "text";
  inputImg.value = oldChampion.photoUrl;
  divToEdit.appendChild(inputImg);

  const actions = document.createElement("div");
  actions.classList.add("edit-actions");
  divToEdit.appendChild(actions);

  const btnSave = document.createElement("button");
  btnSave.textContent = "Save";
  btnSave.dataset.id = id;
  btnSave.classList.add("save-btn");

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancel";
  btnCancel.classList.add("cancel-btn");

  actions.appendChild(btnSave);
  actions.appendChild(btnCancel);

  btnSave.onclick = async () => {
    const data = {
      name: inputName.value.trim(),
      yearsOfChampions: inputDate.value.trim(),
      photoUrl: inputImg.value.trim(),
    };
    try {
      validateChampion(data);
      data.id = id;
      await updateChampion(data);
    } catch (error) {
      showError(error.message);
    }
  };

  btnCancel.onclick = () => {
    divToEdit.classList.remove("edit-mode");
    divToEdit.replaceWith(renderChampionCard(oldChampion));
  };
}

//Helpers
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

function validateChampion({ name, yearsOfChampions, photoUrl }) {
  if (!name || !yearsOfChampions || !photoUrl) {
    throw new Error("All fields are required");
  }
}

function showError(message) {
  alert(message);
}

function clearForm() {
  newChampionName.value = "";
  newChampionPhoto.value = "";
  newChampionYears.value = "";
}

function currentView() {
  const value = searchChampionName.value.trim().toLowerCase();
  return value
    ? championsCache.filter((ch) => ch.name.toLowerCase().startsWith(value))
    : championsCache;
}

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

function closeActiveEdit() {
  const activeEditCard = document.querySelector(".champion-card.edit-mode");

  if (!activeEditCard) return;

  if (activeEditCard) {
    const confirmClose = confirm("Discard changes?");
    if (!confirmClose) return;
  }

  const id = activeEditCard.dataset.id;
  const champion = championsCache.find((ch) => ch.id === id);

  if (!champion) return;

  activeEditCard.replaceWith(renderChampionCard(champion));
}
