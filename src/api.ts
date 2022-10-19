const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResults {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ISearch {
  backdrop_path: string;
  id: number;
  media_type: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
}

export interface IGetSearchResults {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false}`
  ).then((response) => response.json());
}
