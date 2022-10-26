import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getPopularMovies,
  IGetMoviesResults,
  IGetPopularMoviesResults,
} from "../api";
import { makeImagePath, Types } from "../utils";
import MovieSlider from "../Components/MovieSlider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 12px;
`;

function Home() {
  const { data: nowPlayingMovieData, isLoading } = useQuery<IGetMoviesResults>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );
  const { data: popularMovieData } = useQuery<IGetPopularMoviesResults>(
    ["movies", "popular"],
    getPopularMovies
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingMovieData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMovieData?.results[0].title}</Title>
            <Overview>{nowPlayingMovieData?.results[0].overview}</Overview>
          </Banner>
          {nowPlayingMovieData ? (
            <MovieSlider type={Types.now_playing} data={nowPlayingMovieData} />
          ) : null}
          {popularMovieData ? (
            <MovieSlider type={Types.popular} data={popularMovieData} />
          ) : null}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
