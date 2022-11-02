const BASE_URL = "https://api.themoviedb.org/3";

export interface ISearch {
  id: number;
  title?: string;
  name?: string;
}

export interface IGetSearchResults {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export async function getSearch(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false}`
    )
  ).json();
}

export async function getMovieSearch(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
    )
  ).json();
}

export async function getTvSearch(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
    )
  ).json();
}
