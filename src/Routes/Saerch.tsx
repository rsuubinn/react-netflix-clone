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
import Loader from "../Components/Loader";
import MovieSlider from "../Components/Movies/MovieSlider";
import TvSlider from "../Components/Tv/TvSlider";
import { MovieTypes, TvTypes } from "../utils";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

const RelatedContents = styled.div`
  margin: 15vh 60px 0px 60px;
  display: flex;
  align-items: flex-start;

  h4 {
    color: gray;
    font-weight: 600;
    width: 13%;
    padding-top: 9px;
  }
`;
const Contents = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
`;

const Content = styled.div`
  color: white;
  display: flex;
  align-items: center;
  span {
    display: block;
    color: gray;
    font-size: 30px;
    margin: 0px 10px;
  }
`;

const Sliders = styled.div`
  margin: 5vh 0;
  z-index: 0;
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
  useEffect(() => {
    console.log(keyword);
  }, [keyword]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>넷플릭스</title>
        </Helmet>
      </HelmetProvider>
      {searchLoading && movieLoading && tvLoading ? (
        <Loader />
      ) : (
        <>
          <RelatedContents>
            <h4>다음과 관련된 콘텐츠: </h4>
            <Contents>
              {searchData?.results.map((data) => (
                <Content key={data.id}>
                  {data.title ? data.title : data.name}
                  <span>|</span>
                </Content>
              ))}
            </Contents>
          </RelatedContents>
          <Sliders>
            <MovieSlider type={MovieTypes.search} data={movieData!} />
            <TvSlider type={TvTypes.search} data={tvData!} />
          </Sliders>
        </>
      )}
    </>
  );
}

export default Search;
