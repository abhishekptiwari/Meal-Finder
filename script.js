const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('cancel-btn'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');



// Search meal and fetch from api
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = '';

    // Get search term (Search keyword)
    const serachTerm = search.value;
    console.log(serachTerm);

    // Check for empty
    if (serachTerm.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${serachTerm}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for ${serachTerm}:</h2>`;
                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There are no search results for ${serachTerm}, Try again!</p>`;
                }else{
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `
                    ).join('');
                }

            });
            // Clear search text
            search.value = "";
    } else {
        alert('Please enter a search term!!');
    }

}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];
  
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
    console.log(ingredients);
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>

        </div>
    `

}


// Fetch meal by ID
function getMealByID(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data); // JSON DATA
        const meal = data.meals[0];
        // console.log(meal);
        addMealToDOM(meal);
    });
}

// Fetch random meal from api
function getRandomMeal(){
    // Clears meals and heading
    mealsEl.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// Event listners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });
    // console.log(mealInfo);
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        // Returns the id of the meal we clicked.
        console.log(mealID);
        getMealByID(mealID);
    }
});