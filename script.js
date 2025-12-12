const championsDiv = document.getElementById("championsDiv");
const newChampionsName = document.getElementById("newChampionsName");
const newChampionsYears = document.getElementById("newChampionsYears");
const newChampionsPhoto = document.getElementById("newChampionsPhoto");
const addChampionBtn = document.getElementById("addChampionBtn");

// console.log("" + (new Date().getTime() + Math.random()));

fetch("https://6893186bc49d24bce8696873.mockapi.io/champions/champions")
  .then((res) => res.json())
  .then((champions) => {
    console.log(champions);
    
    champions.forEach((champ) => {
      displayOneCard(champ);
    });
  });

addChampionBtn.onclick = () => {
  fetch("https://6893186bc49d24bce8696873.mockapi.io/champions/champions", {
    method: "POST",
    body: JSON.stringify({
      // id: "" + (new Date().getTime() + Math.random()),
      name: newChampionsName.value.trim(),
      yearsOfChampions: newChampionsYears.value.trim(),
      photoUrl: newChampionsPhoto.value.trim(),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((champ) => {
      displayOneCard(champ);
    });
};

const displayOneCard = (champ) => {
  championsDiv.innerHTML += `
    <div class="champion-card">
     <p><strong>Datum: </strong> ${champ.yearsOfChampions}</p>
     <p><strong>Name:</strong> ${champ.name}</p>
     <img src="${champ.photoUrl}" alt="Champion"/>
    </div>`;
    newChampionsName.value = newChampionsPhoto.value = newChampionsYears.value = "";
};
