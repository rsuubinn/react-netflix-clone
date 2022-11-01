const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

export interface ITvDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: number;
  genres?: [{ id: number; name: string }];
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
}

export interface IGetTvResults {
  page: number;
  results: ITvDetail[];
  total_pages: number;
  total_results: number;
}

export interface ITvTrailerDetail {
  key: string;
}
export interface IGetTrailerTvResults {
  id: number;
  results: ITvTrailerDetail[];
}
export async function getTvDetail(tvId: string) {
  return await (
    await fetch(`
    ${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko`)
  ).json();
}

export async function getOnTheAirTvPrograms() {
  return await (
    await fetch(
      `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getPopularTvPrograms() {
  return await (
    await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getTopRatedTvPrograms() {
  return await (
    await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
    )
  ).json();
}

export async function getTrailerTv(tvId: string) {
  return await (
    await fetch(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`)
  ).json();
}
