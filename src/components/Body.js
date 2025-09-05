import { useEffect, useState } from "react";
import ShimmerUI from "./ShimmerUI";
import { Categories, Areas, Youtubelogo } from "../utils/Data";
import Modal from "react-modal";

Modal.setAppElement("#root");
const Body = () => {
  const [searchinput, setsearchinput] = useState("");
  const [category, setcategory] = useState();
  const [area, setarea] = useState();
  const [displayrecipes, setdisplayrecipes] = useState([]);
  const [allrecipes, setallrecipes] = useState([]);
  const [loading, setloading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [recipeid, setrecipeid] = useState();
  const [modalrecipe, setmodalrecipe] = useState([]);
  useEffect(() => {
    fetchdata();
  }, [searchinput]);
  const fetchdata = async () => {
    const data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + `${searchinput}`
    );
    const json = await data.json();
    if (json.meals == null) {
      setdisplayrecipes([]);
      setallrecipes([]);
      setloading(false);
    } else {
      setdisplayrecipes(json.meals);
      setallrecipes(json.meals);
      setloading(false);
    }
  };
  function filter(e) {
    let fltcat, fltarea;
    fltarea = area;
    fltcat = category;
    Categories.includes(e.target.value)
      ? (fltcat = e.target.value)
      : (fltarea = e.target.value);
    setcategory(fltcat);
    setarea(fltarea);
    const filteredRecipes = allrecipes.filter(
      (recipe) =>
        (fltcat && fltcat !== "Select Categories"
          ? recipe.strCategory === fltcat
          : true) &&
        (fltarea && fltarea !== "Select Country"
          ? recipe.strArea === fltarea
          : true)
    );
    setdisplayrecipes(filteredRecipes);
  }
  function modelrecipefn(recipe) {
    setmodalrecipe(recipe);
  }
  return (
    <div id="body">
      <div id="search-body">
        <input
          id="search-input"
          type="text"
          value={searchinput}
          onChange={(e) => setsearchinput(e.target.value)}
          placeholder="Enter Ingredient"
        ></input>
      </div>
      <div id="search-btn-body">
        <p>Click following ingradients to find recipes</p>
        <button id="search-btn" onClick={() => setsearchinput("chicken")}>
          chicken
        </button>
        <button id="search-btn" onClick={() => setsearchinput("fish")}>
          fish
        </button>
        <button id="search-btn" onClick={() => setsearchinput("prawns")}>
          prawns
        </button>
        <button id="search-btn" onClick={() => setsearchinput("tomato")}>
          tomato
        </button>
        <button id="search-btn" onClick={() => setsearchinput("onion")}>
          onion
        </button>
      </div>
      <div id="filter-body">
        <div>
        <label>Filter By Category: </label>
        <select className="filterdropdown" onChange={(e) => filter(e)}>
          {Categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select></div>
        <div>
        <label> Filter By Country: </label>
        <select className="filterdropdown" onChange={(e) => filter(e)}>
          {Areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>
        </div>
      </div>
      {displayrecipes.length == 0 && loading == true ? (
        <ShimmerUI />
      ) : displayrecipes.length == 0 && loading == false ? (
        <p id="norecipe">No Recipe Found 🍽️</p>
      ) : (
        <div>
          <p style={{textAlign:"center", fontWeight:"bolder"}}>Recipes Found : {displayrecipes.length}</p>
          <div id="display-body">
            {displayrecipes.map((recipe, index) => (
              <div id="recipe-card" key={index}>
                <p id="recipe-name">{recipe.strMeal}</p>
                <img id="recipe-image" src={recipe.strMealThumb}></img>
                <div id="recipe-details">
                  <p id="recipe-area">{recipe.strArea}</p>
                  <p id="recipe-category">{recipe.strCategory}</p>
                </div>
               
                <button
                  id="details-btn"
                  onClick={() => {
                    setModalIsOpen(true);
                    modelrecipefn(recipe);
                  }}
                >
                  See Complete Recipe
                </button>
                <button id="recipe-youtube">
                  <a href={recipe.strYoutube} target="_blank">
                    <img
                      src="https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-06-512.png"
                      style={{ height: "30px" }}
                    ></img>
                  </a>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal isOpen={modalIsOpen}>
        <div id="modal-body">
          <button id="close-btn" onClick={() => setModalIsOpen(false)}>
            Close
          </button>
          <br></br>
          <img id="modal-img" src={modalrecipe.strMealThumb}></img>
          <p id="modal-name">{modalrecipe.strMeal}</p>
          <p>
            <strong>Category :</strong> {modalrecipe.strCategory}
          </p>
          <p>
            {" "}
            <strong>Country :</strong> {modalrecipe.strArea}
          </p>
          <table id="table">
            <thead>
              <tr>
                <th>Ingradient</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => {
                const ingredient = modalrecipe[`strIngredient${i + 1}`];
                const measure = modalrecipe[`strMeasure${i + 1}`];
                if (ingredient) {
                  return (
                    <tr key={i}>
                      <td>{ingredient}</td>
                      <td>{measure}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <p>
            {" "}
            <strong>Instructions :</strong>
            {modalrecipe.strInstructions}
          </p>
        </div>
      </Modal>
    </div>
  );
};
export default Body;