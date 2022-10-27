const API_KEY = "9c9934e5f1d2067a566e93eede75e49e";
const BASE_URL = "https://api.themoviedb.org/3";

export interface ITvDetail {
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

export interface IGetTvResults {
  page: number;
  results: ITvDetail[];
  total_pages: number;
  total_results: number;
}

export async function getOnTheAirTvPrograms() {
  return await (
    await fetch(
      `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=ko&page=1`
    )
  ).json();
}
