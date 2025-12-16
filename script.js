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
loadChampions();

//Events
searchChampionName.oninput = debounce(() => displayChampions(currentView()));

clearSearch.onclick = () => {
  searchChampionName.value = "";
  displayChampions(currentView());
};

addChampionBtn.onclick = async () => {
  try {
    const data = {
      name: newChampionName.value.trim(),
      yearsOfChampions: newChampionYears.value.trim(),
      photoUrl: newChampionPhoto.value.trim(),
    };

    validateChampion(data);
    await addChampion(data);
    clearForm();
  } catch (error) {
    showError(error.message);
  }
};

championsDiv.onclick = (event) => {
  const id = event.target.dataset.id;

  if (event.target && event.target.matches("button.editChamp")) {
    const divToEdit = event.target.parentElement;

    displayEditCard(id, divToEdit);
  }

  if (event.target && event.target.matches("button.deleteChamp")) {
    deleteChampion(id);
  }
};

//Business logic
async function loadChampions() {
  try {
    championsCache = await request(API_URL);
    displayChampions(championsCache);
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
    displayChampions(currentView());
    alert(`Champion with id ${newChampion.id}`);
  } catch (error) {
    showError("Failed to add champion");
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

    displayChampions(currentView());
  } catch (error) {
    showError("Failed to update champion");
  }
}

async function deleteChampion(id) {
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    alert(`Champion with id ${id} removed`);
    championsCache = championsCache.filter((ch) => ch.id !== id);
    displayChampions(currentView());
  } catch (error) {
    showError("Failed to delete champion");
  }
}

//Render
function displayChampions(data) {
  championsDiv.innerHTML = "";
  data.forEach((champ) => {
    displayOneCard(champ);
  });
}

function displayOneCard(champ) {
  const div = document.createElement("div");
  div.classList.add("champion-card");
  div.dataset.id = champ.id;
  championsDiv.appendChild(div);

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
}

function displayEditCard(id, divToEdit) {
  const oldChampion = championsCache.find((ch) => ch.id === id);
  if (!oldChampion) {
    showError("Champion not found");
    return;
  }

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

  const btnSave = document.createElement("button");
  btnSave.textContent = "Save";
  btnSave.dataset.id = id;
  divToEdit.appendChild(btnSave);

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancel";
  divToEdit.appendChild(btnCancel);

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
    divToEdit.remove();
    displayOneCard(oldChampion);
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

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
