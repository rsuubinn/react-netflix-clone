const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

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
  homepage: string;
}

export interface IGetMoviesResults {
  page: number;
  results: IMovieDetail[];
  total_pages: number;
  total_results: number;
}

export interface IMovieTrailerDetail {
  key: string;
}
export interface IGetTrailerMoviesResults {
  id: number;
  results: IMovieTrailerDetail[];
}

export async function getMovieDetail(id: string) {
  return await (
    await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko`)
  ).json();
}

export async function getNowPlayingMovies() {
  return await (
    await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getPopularMovies() {
  return await (
    await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getTopRatedMovies() {
  return await (
    await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getUpcomingMovies() {
  return await (
    await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getTrailerMovies(movieId: string) {
  return await (
    await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
  ).json();
}
