
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";

// document.addEventListener("DOMContentLoaded", (e) => {
  const meal = document.querySelector("#meal");
  const buttonSubmit = document.querySelector("#button-submit");
  const result = document.querySelector(".result");
  const mealList = document.querySelector(".meal-list");
  let genJedlo = document.querySelector("#gen-jedlo");
  // const source = document.querySelector("#sourceLink");
  // const importJSON = document.querySelector("#import-button");
  const exportJSON = document.querySelector("#export-button");
  const recipeCount = document.querySelector("#recipe-count-btn");
  const allRecipeCountBtn = document.querySelector("#recipe-count-btn-master");
  const addRecipeBtn = document.querySelector(".add-recipe-btn")

  // const modal = document.getElementById("openModalBtn");
  // let recipe;
  let recipeHistory = [];
  let recipes = [];

  addRecipeBtn.addEventListener('click', ()=>{
    document.querySelector("#pridaj-jedlo-form").classList.toggle("hide")
  })

  // List of meal on load
  loadRecipesFromLocalStorage();


  function showRandomRecipe() {
    if (recipes.length === 0) {
      result.textContent = "Nemate ziaden recept";
      return;
    }
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min); // Round up to the nearest integer
      max = Math.floor(max); // Round down to the nearest integer
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let randomInt;
    do {
      randomInt = getRandomIntInclusive(0, recipes.length - 1);
    } while (
      recipeHistory.slice(0, 7).includes(randomInt) &&
      recipes.length > 7
    );

    // Now randomInt is not among the last 3 numbers
    result.textContent = recipes[randomInt].title;

    // Add the new randomInt to the beginning of the history
    recipeHistory.unshift(randomInt);

    // Optionally, keep the history at 3 items max
    if (recipeHistory.length > 7) {
      recipeHistory.length = 7;
    }

    console.log(randomInt, recipeHistory);
  }

  // Adding recipe on click----------------- + Enter
  function addRecipe() {
    // Adding recipe to the recipe object
    const newRecipe = {
      id: Date.now(),
      typ: "",
      title: meal.value.trim(),
      ingredients: [],
      how: [],
      link: "",
      image: "",
    };
    recipes.push(newRecipe);
    mealList.innerHTML = "";
  }

  // Updating recipe list ---------------------------------------
  function updateRecipeList() {
    mealList.innerHTML = "";

    // Creating list of recipes - - - - - - - - - - - - -
    recipes.forEach((recipe) => {
      const mealListSingleItem = document.createElement("div");
      mealListSingleItem.classList.add("meal-list-item");
      mealListSingleItem.textContent = recipe.title;

      // const addIngredientButton = document.createElement("button");
      // addIngredientButton.textContent = "+";

      // const recipeLink = document.createElement("a");
      // recipeLink.href = recipe.link;
      // recipeLink.classList.add("recipe-link");
      // recipeLink.textContent = "»";
      // Open recipe moddal for edit
      // addIngredientButton.addEventListener("click", () => {
      //   openModal(recipe.id);
      // });

      // if (recipe.link) {
      //   mealListSingleItem.appendChild(recipeLink);
      // }
      // mealListSingleItem.appendChild(recipeLink);
      // mealListSingleItem.appendChild(addIngredientButton);
      mealList.appendChild(mealListSingleItem);

      // * Opening modal with recipe details

      mealListSingleItem.addEventListener("click", () => {
        viewRecipe(recipe.id);
        console.log(`Opening modal for recipe ID: ${recipe.id}`);
      });
    });
    // Show all recipes count

    recipeCount.innerHTML = `${recipes.length}`;
    recipeCount.addEventListener("click", () => {
      // mealList.style.opacity = 1;
    });
  } // End of Update recipe list ----------------------------------------

  // * Open recipe preview --------------------------------------------------
  function viewRecipe(recipeId) {
    const recipe = recipes.find((r) => r.id === recipeId);

    // Generate HTML for each ingredient
    const ingredientsHtml = recipe.ingredients
      .map((ingredient) => {
        return `
        <li>
          ${ingredient.name} - ${ingredient.amount} ${ingredient.unit}
        </li>`;
      })
      .join(""); // Join all list items into a single string

    // Generate HTML for each step, or show a message if there are no steps
    const stepsHtml = recipe.how.length
      ? recipe.how
          .sort((a, b) => a.order - b.order) // Sort by order to ensure correct sequence
          .map((step, index) => `<li>${step.description}</li>`)
          .join("")
      : "<p>Ziaden postup pre tento recept.</p>";

    let overlay = document.createElement("div");
    overlay.id = "modalOverlay";

    let modal = document.createElement("div");
    modal.id = "modalWindow";
    modal.innerHTML = `<img class="recipe-image" src="${
      recipe.image ||
      "https://fakeimg.pl/600x200/1f1f1f/909090?text=fotka+receptu+ni+je+k+dispozicii&font=bebas&font_size=16"
    }" alt="${recipe.title}">
        <h2>${recipe.title}</h2>
        <ul class="ingredient-list-recipe-view">${ingredientsHtml}</ul>
        <p>Postup:</p>
        <ol class="step-list-recipe-view">${stepsHtml}</ol>
        <p class="recipe-source-link">${
          recipe.link
            ? `<a href="${recipe.link}" target="_blank">Original recept</a>`
            : ""
        }</p>
        <div class="button-container">
        <button id="closeModalBtn">Zavri</button>
        <button id="upravitButton">Upravit</button>
        <button id="copyIngredientsBtn">Kopírovať ingrediencie</button>
        <p id="copyMessage" style="margin: 10px 0 10px 0;"></p>
        </div>`;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.style.display = "block";

    // Buttons ---------------------------------------------------------------
    // Select the button from the `modal` and add event listeners
    const addIngredientButton = modal.querySelector("#upravitButton");
    addIngredientButton.addEventListener("click", () => {
      overlay.remove();
      openModal(recipe.id);
    });
    document
      .getElementById("closeModalBtn")
      .addEventListener("click", function () {
        overlay.remove();
      });

    // Kopirovanie ingredienciji do schranky
    modal.querySelector("#copyIngredientsBtn").addEventListener("click", () => {
      copyIngredientsToClipboard(recipe.id);
    });
  } //End of viewRecipe

  //  Adding recipe on click----------------- + Button
  buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    addRecipe();
    saveRecipesToLocalStorage();
    loadRecipesFromLocalStorage();
    document.querySelector("#pridaj-jedlo-form").classList.add("hide")
    // updateRecipeList();
    console.log(recipes);
  });

  // Show random recipe on button click
  genJedlo.addEventListener("click", (e) => {
    //   console.log("click");
    showRandomRecipe();
  });

  meal.addEventListener("focus", (e) => {
    meal.value = "";
  });
  // show / hide all recipe list
  // allRecipeCountBtn.addEventListener("click", (e) => {
  //   mealList.classList.toggle("hide");
  //   console.log("clicked");
  // });

  // * Function to open the modal window with recipe EDIT form

  function openModal(recipeId) {
    const recipe = recipes.find((r) => r.id === recipeId);

    let overlay = document.createElement("div");
    overlay.id = "modalOverlay";

    let modal = document.createElement("div");
    modal.id = "modalWindow";
    modal.innerHTML = `
      <h2>${recipe.title}</h2>
      <p>Pridaj viacej info k jedlu:</p>
      <form id="editRecipeForm">
        <label>Typ:</label>
        <label><input type="radio" name="typ" value="Ranajky" ${
          recipe.typ === "Ranajky" ? "checked" : ""
        }> Ranajky</label>
        <label><input type="radio" name="typ" value="Obed" ${
          recipe.typ === "Obed" ? "checked" : ""
        }> Obed</label>
        <label><input type="radio" name="typ" value="Vecera" ${
          recipe.typ === "Vecera" ? "checked" : ""
        }> Vecera</label>

        <label for="recipeImageLink">Obrázok (URL):</label>
        <input type="text" id="recipeImageLink" placeholder="Pridajte odkaz na obrazok receptu (nie je povinne)" value="${
          recipe.image
        }">
        
        <label for="ingredientInput">Ingrediencie:</label>
        <div id="ingredientsContainer"></div>
        <button type="button" id="addIngredientBtn">Pridaj ingredienciu</button>
        <br>
        <label for="modal-how-textarea">Postup na pripravu:</label><br>
        <small>Postup na pripravu po krokoch. Popiste co a ako postupovat v kazdom kroku. NIe je povinne.</small>
        <div id="stepsContainer"></div>
        <button type="button" id="addStepBtn">Pridaj krok</button>
        
        <label for="sourceLink">Link:</label>
        <input type="text" id="sourceLink" value="${recipe.link}">
        <small>Mozte pridat link na original recept. Moze to byt stranka, youtube video ...alebo nemusi byt nic. <br>Ziadne pole, nie je povinne.</small>
      </form>
      <div class="button-container">
        <button id="saveRecipeBtn">Uloz</button>
        <button id="closeModalBtn">Zavri</button>
        <button id="deleteRecipeBtn">Vymaz</button>
      </div>
    `;

    // ^ Populate initial ingredients -----------------------------
    const ingredientsContainer = modal.querySelector("#ingredientsContainer");
    recipe.ingredients.forEach((ingredient) =>
      addIngredientRow(ingredientsContainer, ingredient)
    );

    // ^ Populate initial steps
    const stepsContainer = modal.querySelector("#stepsContainer");
    recipe.how.forEach((step) => addStepRow(stepsContainer, step));

    // ^ Add Ingredient Button Event Listener ------------------------
    modal
      .querySelector("#addIngredientBtn")
      .addEventListener("click", () => addIngredientRow(ingredientsContainer));
    modal
      .querySelector("#addStepBtn")
      .addEventListener("click", () => addStepRow(stepsContainer));

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.style.display = "block";
    // * Buttons ------------------------
    document
      .getElementById("closeModalBtn")
      .addEventListener("click", function () {
        overlay.remove();
      });
    // ^ Save button (edit recipe modal)
    document
      .getElementById("saveRecipeBtn")
      .addEventListener("click", function () {
        saveRecipe(recipeId, ingredientsContainer, stepsContainer);
        saveRecipesToLocalStorage(); //saving to local storage
        loadRecipesFromLocalStorage(); //updejting recipe list from local storage
        overlay.remove();
      });
    // Delete recipe
    document
      .getElementById("deleteRecipeBtn")
      .addEventListener("click", function () {
        deleteRecipe(recipeId);
        overlay.remove();
      });
  }

  // * Function to add a new ingredient row

  function addIngredientRow(
    container,
    ingredient = { name: "", amount: "", unit: "" }
  ) {
    const row = document.createElement("div");
    row.classList.add("ingredient-row");

    row.innerHTML = `
    <input type="text" class="ingredient-name" placeholder="Nazov ingrediencie" value="${ingredient.name}">
    <input type="text" class="ingredient-amount" placeholder="Mnoztvo" value="${ingredient.amount}">
    <input type="text" class="ingredient-unit" placeholder="Mierka (g, l, ks, PL, ...)" value="${ingredient.unit}">
    <button type="button" class="remove-ingredient">X</button>
  `;

    // Event listener for delete button
    row
      .querySelector(".remove-ingredient")
      .addEventListener("click", () => row.remove());

    container.appendChild(row);
  }

  // * Add steps function

  function addStepRow(container, step = { description: "" }) {
    const row = document.createElement("div");
    row.classList.add("step-row");

    row.innerHTML = `
<textarea class="step-description" placeholder="Popis kroku" rows="4" style="width: 100%; resize: true;">${step.description}</textarea>
    <button type="button" class="remove-step">X</button>
  `;

    // Event listener for delete button
    row
      .querySelector(".remove-step")
      .addEventListener("click", () => row.remove());

    container.appendChild(row);
  }

  // * Export JSON

  exportJSON.addEventListener("click", () => {
    exportRecipes();
  });
  //save recipe to local storage function
  function saveRecipesToLocalStorage() {
    const recipesJSON = JSON.stringify(recipes);
    localStorage.setItem("recipes", recipesJSON);
    console.log("Recipes saved to local storage.");
  }
  // * Load recipe from local storage function

  function loadRecipesFromLocalStorage() {
    const recipesJSON = localStorage.getItem("recipes");
    if (recipesJSON) {
      recipes = JSON.parse(recipesJSON).map((recipe) => {
        // Ensure `how` is an array for each recipe
        if (!Array.isArray(recipe.how)) {
          recipe.how =
            typeof recipe.how === "string" ? [{ description: recipe.how }] : [];
        }
        return recipe;
      });
      console.log("Recipes loaded from local storage.");
      updateRecipeList();
    } else {
      console.log("No recipes found in local storage.");
    }
  }

  // * Save recipe function used on save button while editing recipe modal

  function saveRecipe(recipeId, ingredientsContainer, stepsContainer) {
    const recipe = recipes.find((r) => r.id === recipeId);

    // Update recipe type and link
    recipe.typ =
      document.querySelector('input[name="typ"]:checked')?.value || recipe.typ;
    recipe.link = document.getElementById("sourceLink")?.value || recipe.link;

    // Save the image link
    recipe.image =
      document.getElementById("recipeImageLink")?.value.trim() || "";

    // Update ingredients
    recipe.ingredients = Array.from(
      ingredientsContainer.querySelectorAll(".ingredient-row")
    ).map((row) => {
      const name = row.querySelector(".ingredient-name")?.value.trim() || "";
      const amount =
        parseFloat(row.querySelector(".ingredient-amount")?.value) || 0;
      const unit = row.querySelector(".ingredient-unit")?.value.trim() || "";
      return { name, amount, unit };
    });

    // Update steps
    recipe.how = Array.from(stepsContainer.querySelectorAll(".step-row")).map(
      (row, index) => {
        const description =
          row.querySelector(".step-description")?.value.trim() || "";
        return { description, step: index + 1 }; // optional order
      }
    );

    updateRecipeList(); // Refresh the recipe list
  }

  function exportRecipes() {
    const dataStr = JSON.stringify(recipes, null, 2); // Pretty-print with indentation
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement("a");
    a.href = url;
    a.download = "recipes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importRecipes(event) {
    console.log("importRecipes function called.");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedRecipes = JSON.parse(e.target.result);
          // Validate the structure if necessary
          if (Array.isArray(importedRecipes)) {
            recipes = importedRecipes;
            saveRecipesToLocalStorage(); // Optionally save to local storage
            updateRecipeList(); //update recipe list after JSON is imported
            console.log("Recipes imported successfully.");
          } else {
            console.error("Invalid data format.");
            alert(
              "Invalid file format. Please select a valid recipes JSON file."
            );
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error reading file. Please ensure it is a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  }

  function deleteRecipe(recipeId) {
    // Confirm deletion with the user
    const confirmation = confirm(
      "Ste si istý, že chcete odstrániť tento recept? Táto akcia je nevratná."
    );
    if (confirmation) {
      // Find the index of the recipe to delete
      const index = recipes.findIndex((r) => r.id === recipeId);
      if (index !== -1) {
        // Remove the recipe from the array
        recipes.splice(index, 1);

        // Update local storage
        saveRecipesToLocalStorage();

        // Update the UI
        updateRecipeList();

        // Remove the recipe from the history if present
        recipeHistory = recipeHistory.filter((i) => i !== index);

        // Adjust indices in recipeHistory
        recipeHistory = recipeHistory.map((i) => (i > index ? i - 1 : i));

        // Provide feedback to the user
        alert("Recept bol úspešne odstránený.");
      } else {
        alert("Recept nebol nájdený.");
      }
    }
  }

  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", importRecipes);

  // google keep
  function copyIngredientsToClipboard(recipeId) {
    const recipe = recipes.find((r) => r.id === recipeId);

    // Generovať textový zoznam ingrediencií
    const ingredientsList = recipe.ingredients
      .map(
        (ingredient) =>
          `- ${ingredient.name} (${ingredient.amount} ${ingredient.unit})`
      )
      .join("\n");

    // Skopírovať do schránky
    navigator.clipboard
      .writeText(ingredientsList)
      .then(() => {
        // Zobraziť inline správu o úspechu
        const messageContainer = document.getElementById("copyMessage");
        messageContainer.textContent = "Ingrediencie boli skopírované!";
        messageContainer.style.color = "green";

        // Skryť správu po 3 sekundách
        setTimeout(() => {
          messageContainer.textContent = "";
        }, 3000);
      })
      .catch((err) => {
        console.error("Chyba pri kopírovaní do schránky:", err);
      });
  }

  // ASearch recipes ------------------------------------------------------------------
  // Adding a function to handle the search
  function filterRecipeList(searchQuery = "") {
    // const mealList = document.querySelector(".meal-list");

    // Clear the current list
    mealList.innerHTML = "";

    // Filter recipes based on the search query
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Display filtered recipes
    filteredRecipes.forEach((recipe) => {
      const mealListSingleItem = document.createElement("div");
      mealListSingleItem.classList.add("meal-list-item");
      mealListSingleItem.textContent = recipe.title;

      // Add event listener to view the recipe details
      mealListSingleItem.addEventListener("click", () => {
        viewRecipe(recipe.id);
      });

      mealList.appendChild(mealListSingleItem);
    });

    // Show a message if no recipes match
    if (filteredRecipes.length === 0) {
      mealList.innerHTML = "<p>Žiadne recepty nevyhovujú hľadaniu.</p>";
    }
  }

  // Updating button click logic to include the search bar
  allRecipeCountBtn.addEventListener("click", (e) => {
    const mealList = document.querySelector(".meal-list");
    const searchContainer = document.getElementById("searchContainer");

    // Toggle visibility of the meal list
    mealList.classList.toggle("hide");
    searchByIngredientsBtn.classList.toggle("hide");
    if (ingredientSearchContainer.style.display === "block") {
      ingredientSearchContainer.style.display = "none";
    }

    if (mealList.classList.contains("hide")) {
      // If the list is hidden, remove the search bar
      if (searchContainer) {
        searchContainer.remove();
      }
    } else {
      // If the list is shown, add the search bar
      if (!document.getElementById("searchInput")) {
        const searchContainer = document.createElement("div");
        searchContainer.id = "searchContainer";
        searchContainer.style.marginBottom = "10px";

        searchContainer.innerHTML = `
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Hľadajte recepty..." 
            style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;"
          />
        `;

        mealList.parentElement.insertBefore(searchContainer, mealList);

        // Add an event listener for real-time search
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", (event) => {
          filterRecipeList(event.target.value);
        });
      }

      // Reset the search input and show all recipes
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.value = "";
      }
      filterRecipeList();
    }
  });

  // Event listener for the "Hladaj podla ingrediencii" button
  const searchByIngredientsBtn = document.getElementById(
    "searchByIngredientsBtn"
  );
  const ingredientSearchContainer = document.getElementById(
    "ingredientSearchContainer"
  );

  searchByIngredientsBtn.addEventListener("click", () => {
    // Toggle visibility of the ingredient search container
    ingredientSearchContainer.style.display =
      ingredientSearchContainer.style.display === "none" ? "block" : "none";

    // Populate the ingredient interface if it's shown
    if (ingredientSearchContainer.style.display === "block") {
      populateIngredientInterface();
    }
  });

  // Function to populate the ingredient search interface
  function populateIngredientInterface() {
    ingredientSearchContainer.innerHTML = ""; // Clear previous content

    // Get a list of unique ingredients and counts, sorted by count
    const ingredientCounts = {};
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const name = ingredient.name ? ingredient.name.toLowerCase() : null;
        if (name) {
          if (ingredientCounts[name]) {
            ingredientCounts[name]++;
          } else {
            ingredientCounts[name] = 1;
          }
        }
      });
    });

    const sortedIngredients = Object.entries(ingredientCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([name, count]) => ({ name, count }));

    // Create a flexbox container
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("ingredient-flex-container");

    // Populate the flexbox with ingredients
    sortedIngredients.forEach(({ name, count }) => {
      const ingredientItem = document.createElement("div");
      ingredientItem.classList.add("ingredient-flex-item");

      // Shorten the ingredient name if it's too long
      const truncatedName = name.length > 15 ? name.slice(0, 15) + "..." : name;

      ingredientItem.innerHTML = `
        <input type="checkbox" class="ingredient-checkbox" value="${name}" id="checkbox-${name}" />
        <label for="checkbox-${name}" title="${name}">${truncatedName} ${count}</label>
      `;

      flexContainer.appendChild(ingredientItem);
    });

    ingredientSearchContainer.appendChild(flexContainer);

    // Add event listener for checkboxes
    const checkboxes = document.querySelectorAll(".ingredient-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", filterRecipesByIngredients);
    });
  }

  // Function to filter recipes based on selected ingredients
  function filterRecipesByIngredients() {
    const selectedIngredients = Array.from(
      document.querySelectorAll(".ingredient-checkbox:checked")
    ).map((checkbox) => checkbox.value);

    // Filter recipes based on selected ingredients
    const filteredRecipes = recipes.filter((recipe) =>
      selectedIngredients.every((ingredient) =>
        recipe.ingredients.some(
          (ing) =>
            ing.name && ing.name.toLowerCase() === ingredient.toLowerCase()
        )
      )
    );

    // Update the recipe list with filtered results
    const mealList = document.querySelector(".meal-list");
    mealList.innerHTML = ""; // Clear the current list

    if (filteredRecipes.length > 0) {
      filteredRecipes.forEach((recipe) => {
        const mealListSingleItem = document.createElement("div");
        mealListSingleItem.classList.add("meal-list-item");
        mealListSingleItem.textContent = recipe.title;

        // Add event listener to view the recipe details
        mealListSingleItem.addEventListener("click", () => {
          viewRecipe(recipe.id);
        });

        mealList.appendChild(mealListSingleItem);
      });
    } else {
      mealList.innerHTML =
        "<p>Žiadne recepty nevyhovujú zvoleným ingredienciám.</p>";
    }
  }

  // const driver = window.driver.js.driver;
  // Initialize the Driver instance using the global Driver class
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#pridaj-jedlo-form",
        popover: {
          title: "Pridajte jedlo",
          description:
            "Na začiatok tu pridáme názov jedla, ktoré chceme pridať do zoznamu.",
          position: "left",
        },
      },
      {
        element: "#gen-jedlo",
        popover: {
          title: "Generovať jedlo",
          description:
            "Kliknutím na toto tlačidlo náhodne vyberiete jedlo zo zoznamu.",
          position: "right",
        },
      },
      {
        element: ".meal-list",
        popover: {
          title: "Zoznam jedál",
          description: "Tu sa zobrazuje zoznam všetkých pridaných jedál.",
          position: "top",
        },
      },
      // Add more steps as needed...
    ],
  });

  // Start the guided tour
  driverObj.drive();

  // driverObj.drive();
// }); 
//DOM content load end-------------------------
