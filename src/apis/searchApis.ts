const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

export interface ISearch {
  backdrop_path: string;
  id: number;
  media_type: string;
  original_name: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  genres_ids: [{ id: number; name: string }];
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
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false}`
    )
  ).json();
}

export async function getMovieSearch(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
    )
  ).json();
}

export async function getTvSearch(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
    )
  ).json();
}
