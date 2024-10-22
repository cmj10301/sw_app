import { Recipe } from "@/interface/api.type";
import { API_URI } from "./constant";
import Link from "next/link";

async function getRecipe() {
  const response = await fetch(API_URI);
  return (await response.json()).COOKRCP01.row as Recipe[];
}

export default async function Home() {
  const recipes = await getRecipe();
  console.log(recipes);
  return (
    <div>
      {
        recipes.map( (recipe)=> 
          <div key={recipe.RCP_SEQ}>
            <Link href={`recipe/${recipe.RCP_SEQ}`}>{recipe.RCP_NM}</Link>
          </div>  
        )
      }
    </div>
  )
}