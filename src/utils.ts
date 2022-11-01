export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export function makteTrailerPath(key?: string) {
  return `https://www.youtube.com/embed/${key}?showinfo=0&enablejsapi=1&origin=https://localhost:3000`;
}

export function makeRuntime(runtime: number) {
  if (runtime / 60 === 0) {
    return `${runtime}분}`;
  } else {
    return `${Math.floor(runtime / 60)}시간 ${Math.floor(runtime % 60)}분`;
  }
}

export enum MovieTypes {
  "now_playing" = "now_playing",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "upcoming" = "upcoming",
  "search" = "search",
}

export enum TvTypes {
  "on_the_air" = "on_the_air",
  "top_rated" = "top_rated",
  "popular" = "popular",
  "search" = "search",
}
