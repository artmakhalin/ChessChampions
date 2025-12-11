const ul = document.getElementById("champions");
const btnChampions = document.getElementById("btnChampions");
console.log(btnChampions);

btnChampions.onclick = async () => {
  try {
    const champions = await fetchChampions();
    champions.forEach((c) => {
      const div = document.createElement("div");
      div.id = `${c.id}div`;
      ul.appendChild(div);

      const li = document.createElement("li");
      li.textContent = c.name;
      div.appendChild(li);

      const btnDelete = document.createElement("button");
      btnDelete.textContent = "X";
      btnDelete.classList.add("deleteChamp");
      btnDelete.id = `${c.id}del`;
      div.appendChild(btnDelete);
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchChampions = async () => {
  try {
    const response = await fetch(
      "https://6893186bc49d24bce8696873.mockapi.io/champions/champions"
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log("Error: " + error);
  }
};

ul.onclick = (event) => {
  if (event.target && event.target.matches("button.deleteChamp")) {
    const divToRemove = document.getElementById(`${parseInt(event.target.id, 10)}div`);
    divToRemove.remove();
  }
};
