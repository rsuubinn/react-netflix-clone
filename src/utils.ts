export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export enum Types {
  "now_playing" = "Now Playing",
  "popular" = "Popular",
  "top_rated" = "Top Rated",
  "upcoming" = "Upcoming",
}
