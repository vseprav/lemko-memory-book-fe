const searchApi = async (query: string) => {
  const res = await fetch(`${process.env.API_URL}/search/evicted_persons?query=${query}`);
  return await res.json();
}

export default searchApi;
