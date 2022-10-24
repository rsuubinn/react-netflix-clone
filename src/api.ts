const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IMovieDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  genres: [{ id: number; name: string }];
  runtime?: number;
  release_date: string;
}
export interface IGetPopularMoviesResults {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesResults {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISearch {
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

export async function getMovieDetail(id: string) {
  return await (
    await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`)
  ).json();
}

export function getNowPlayingMovies() {
  return fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getTvProgrames() {
  return fetch(
    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false}`
  ).then((response) => response.json());
}
