const API_URL =
  "https://6893186bc49d24bce8696873.mockapi.io/champions/champions";

const championsDiv = document.getElementById("championsDiv");
const newChampionsName = document.getElementById("newChampionsName");
const newChampionsYears = document.getElementById("newChampionsYears");
const newChampionsPhoto = document.getElementById("newChampionsPhoto");
const addChampionBtn = document.getElementById("addChampionBtn");
const searchChampionsName = document.getElementById("searchChampionsName");

let championsCache = [];

fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    championsCache = data;
    displayChampions(data);
  });

searchChampionsName.oninput = () => {
  const filtered = championsCache.filter((champ) =>
    champ.name.toLowerCase().startsWith(searchChampionsName.value.toLowerCase())
  );

  displayChampions(filtered);
};

addChampionBtn.onclick = async () => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: newChampionsName.value.trim(),
      yearsOfChampions: newChampionsYears.value.trim(),
      photoUrl: newChampionsPhoto.value.trim(),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const newChampion = await response.json();

  championsCache.push(newChampion);
  displayChampions(championsCache);
};

const displayChampions = (data) => {
  championsDiv.innerHTML = "";
  data.forEach((champ) => {
    displayOneCard(champ);
  });
};

const displayOneCard = (champ) => {
  const div = document.createElement("div");
  div.classList.add("champion-card");
  div.id = `${champ.id}div`;
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

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "X";
  btnDelete.classList.add("deleteChamp");
  btnDelete.dataset.id = champ.id;
  div.appendChild(btnDelete);

  const btnEdit = document.createElement("button");
  btnEdit.textContent = "Edit";
  btnEdit.classList.add("editChamp");
  btnEdit.dataset.id = champ.id;
  div.appendChild(btnEdit);

  newChampionsName.value =
    newChampionsPhoto.value =
    newChampionsYears.value =
      "";
};

championsDiv.onclick = (event) => {
  const id = event.target.dataset.id;

  if (event.target && event.target.matches("button.editChamp")) {
    const divToEdit = document.getElementById(`${id}div`);
    console.log(divToEdit);

    const pName = divToEdit.getElementsByTagName("p")[0];
    const pDate = divToEdit.getElementsByTagName("p")[1];
    const img = divToEdit.getElementsByTagName("img");
    const imgSrc = img[0].src;
    divToEdit.innerHTML = "";

    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.value = pName.textContent;
    divToEdit.appendChild(inputName);

    const inputDate = document.createElement("input");
    inputDate.type = "text";
    inputDate.value = pDate.textContent;
    divToEdit.appendChild(inputDate);

    const inputImg = document.createElement("input");
    inputImg.type = "text";
    inputImg.value = imgSrc;
    divToEdit.appendChild(inputImg);

    const btnSave = document.createElement("button");
    btnSave.textContent = "Save";
    btnSave.id = `${id}Save`;
    divToEdit.appendChild(btnSave);

    btnSave.onclick = async () => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          name: inputName.value.trim(),
          yearsOfChampions: inputDate.value.trim(),
          photoUrl: inputImg.value.trim(),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const updated = await response.json();

      championsCache = championsCache.map((champ) =>
        champ.id === id ? updated : champ
      );
      displayChampions(championsCache);
    };
  }

  if (event.target && event.target.matches("button.deleteChamp")) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        championsCache = championsCache.filter(champ => champ.id !== id);
        displayChampions(championsCache);

        alert(`Champion with id ${id} removed`);
      }
    });
  }
};
