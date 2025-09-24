import { useEffect, useState } from "react";
import ShimmerUI from "./ShimmerUI";
import { Categories, Areas, ingradient } from "../utils/Data";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
import { FaYoutube } from "react-icons/fa";
Modal.setAppElement("#root");

const Body = () => {
  const [searchinput, setsearchinput] = useState("");
  const [category, setcategory] = useState();
  const [area, setarea] = useState();
  const [displayrecipes, setdisplayrecipes] = useState([]);
  const [allrecipes, setallrecipes] = useState([]);
  const [loading, setloading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalrecipe, setmodalrecipe] = useState([]);
  const[colors,setcolors]=useState("red");

  useEffect(() => {
    fetchdata();}, [searchinput]);
  const fetchdata = async () => {
    const data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + `${searchinput}`);
   
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
 useEffect(() => {
    const intervalId = setInterval(() => {
      colors==="red"?setcolors("black"):setcolors("red")
    }, 1000); // Updates count every 1 second

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  },[colors] );
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
      <p style={{ textAlign: "center" }}>
        Click following ingradient to find recipes
      </p>

      <div id="search-btn-body">
        {ingradient.map((ingrad, index) => {
          const Icon = ingrad.icon;
          return (
            <div key={index}>
              <Icon
                onClick={() => setsearchinput(ingrad.name)}
                style={{
                  width: "40px",
                  height: "40px",
                  color: ingrad.color,
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              />
            </div>
          );
        })}
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
          </select>
        </div>
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
      {displayrecipes.length === 0 && loading === true ? (
        <ShimmerUI />
      ) : displayrecipes.length === 0 && loading === false ? (
       <p  style={{backgroundColor:{colors},width:"20px"}}>No Recipe Found 🍽️</p>
                         
      ) : (
        <div>
          <p style={{ textAlign: "center", fontWeight: "bolder" }}>
            Recipes Found : {displayrecipes.length}
          </p>
          <div id="display-body">
            {displayrecipes.map((recipe, index) => (
              <div id="recipe-card" key={index}>
                <p id="recipe-name">{recipe.strMeal}</p>
                <img id="recipe-image"alt="recipeimage" src={recipe.strMealThumb}></img>
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
                <a href={recipe.strYoutube}target="_blank">
                  <FaYoutube color="#ff0000" size={30} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal isOpen={modalIsOpen}>
        <div id="modal-body">
          <RxCross2
            id="close-btn"
            onClick={() => setModalIsOpen(false)}
            style={{
              width: "20px",
              height: "20px",
              color: "red",
              cursor: "pointer",
              border: "1px solid red",
              borderRadius: "10px",
            }}
          />

          <br></br>
          <img id="modal-img" alt="modalimage" src={modalrecipe.strMealThumb}></img>
          <p id="modal-name">{modalrecipe.strMeal}</p>
          <p>
            <strong>Category :</strong> {modalrecipe.strCategory}
          </p>
          <p>
            {" "}
            <strong>Country of Origin :</strong> {modalrecipe.strArea}
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
