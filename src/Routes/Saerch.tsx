import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResults } from "../apis/movieApis";
import {
  getMovieSearch,
  getSearch,
  getTvSearch,
  IGetSearchResults,
} from "../apis/searchApis";
import { IGetTvResults } from "../apis/tvApis";
import MovieSlider from "../Components/Movies/MovieSlider";
import TvSlider from "../Components/Tv/TvSlider";
import { MovieTypes, TvTypes } from "../utils";

const Loader = styled.div``;

const Sliders = styled.div`
  margin: 25vh 0;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: searchData, isLoading: searchLoading } =
    useQuery<IGetSearchResults>(["search"], () => getSearch(keyword!));
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResults>(["movies", "search"], () =>
      getMovieSearch(keyword!)
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResults>(
    ["tv", "search"],
    () => getTvSearch(keyword!)
  );
  console.log(movieData);
  return (
    <>
      {searchLoading && movieLoading && tvLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <Sliders>
          <MovieSlider type={MovieTypes.search} data={movieData!} />
          <TvSlider type={TvTypes.search} data={tvData!} />
        </Sliders>
      )}
    </>
  );
}

export default Search;
