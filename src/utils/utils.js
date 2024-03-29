import { axiosReq } from "../api/axiosDefaults";
import jwtDecode from "jwt-decode";

const typeColors = {
    normal: "#ACA498",
    water: "#418DC6",
    grass: "#82CE51",
    fire: "#F17F2D",
    flying: "#A1BBEC",
    rock: "#B7B1A2",
    ground: "#A26B2E",
    ghost: "#71599A",
    psychic: "#E36887",
    dark: "#503E2C",
    fairy: "#FFC4DF",
    dragon: "#634BB4",
    poison: "#A233AA",
    steel: "#87b1bb",
    ice: "#98D6D5",
    fighting: "#BC4E41",
    bug: "#B7CE46",
    electric: "#ebc921",
  };

  export const pokeTypes = [
    "normal",
    "water",
    "grass",
    "fire",
    "flying",
    "rock",
    "ground",
    "ghost",
    "psychic",
    "dark",
    "fairy",
    "dragon",
    "poison",
    "steel",
    "ice",
    "fighting",
    "bug",
    "electric",
  ];
  
  
  export function getGradientForTypes(types) {
    if (types.length === 1) {
      return typeColors[types[0]];
    } else {
      const [type1, type2] = types;
      const gradient = `linear-gradient(to bottom right, ${typeColors[type1]}, ${typeColors[type2]})`;
      return gradient;
    }
  };
  
  export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  /* Data fetching */

  export const fetchMoreData = async (resource, setResource) => {
    try {
      const { data } = await axiosReq.get(resource.next);
      const uniqueResults = data.results.filter((result) => {
        return !resource.results.some(
          (prevResult) => prevResult.id === result.id
        );
      });
      setResource((prevResource) => ({
        ...prevResource,
        next: data.next,
        results: [...prevResource.results, ...uniqueResults],
      }));
    } catch (err) {}
  };

  export const fetchAllData = async (url) => {
    let allData = [];
    let nextPage = url;
  
    while (nextPage) {
      const response = await axiosReq.get(nextPage);
      allData = allData.concat(response.data.results);
      nextPage = response.data.next;
    }
    return allData;
  };

  export const fetchGameFilterChoices = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axiosReq.options("/posts/post/");
        const choices = response.data.actions.POST.game_filter.choices;
        localStorage.setItem("gameFilterChoices", JSON.stringify(choices));
        resolve(choices);
      } catch (error) {
        reject(error);
      }
    });
  };

  export const fetchBuildSelectData = async () => {
	try {
    const natureUrl = "/api/natures/";
    const heldItemsUrl = "/api/held-items/";
	  const [natureData, heldItemsData] = await Promise.all([
        fetchAllData(natureUrl),
        fetchAllData(heldItemsUrl),
      ]);
	
	    localStorage.setItem("natureData", JSON.stringify(natureData));
      localStorage.setItem("heldItemsData", JSON.stringify(heldItemsData));

      return { natureData, heldItemsData };
    } catch (err) {
      console.log(err);
    }
 };

 export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};