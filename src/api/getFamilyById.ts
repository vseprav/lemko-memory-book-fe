import {PersonItem} from "./search";

export const getFamilyById = async (id: string) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/family/${id}`);
  return await res.json() as PersonItem[];
}