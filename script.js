const ul = document.getElementById("champions");
const btnChampions = document.getElementById("btnChampions");
console.log(btnChampions);

btnChampions.onclick = async () => {
  try {
    const champions = await fetchChampions();
    champions.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c.name;
      ul.appendChild(li);
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
