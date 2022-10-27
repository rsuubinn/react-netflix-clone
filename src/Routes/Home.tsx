import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResults,
} from "../apis/movieApis";
import { makeImagePath, Types } from "../utils";
import MovieSlider from "../Components/Movies/MovieSlider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ imagepath: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.imagepath});
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
  const { data: nowPlayingMovieData, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResults>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data: popularMovieData, isLoading: popularLoading } =
    useQuery<IGetMoviesResults>(["movies", "popular"], getPopularMovies);
  const { data: topRatedMovieData, isLoading: topRatedLoading } =
    useQuery<IGetMoviesResults>(["movies", "topRated"], getTopRatedMovies);
  const { data: upComingMovieData, isLoading: upComingLoading } =
    useQuery<IGetMoviesResults>(["movies", "upComing"], getUpcomingMovies);
  return (
    <Wrapper>
      {nowPlayingLoading &&
      popularLoading &&
      topRatedLoading &&
      upComingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            imagepath={makeImagePath(
              nowPlayingMovieData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMovieData?.results[0].title}</Title>
            <Overview>{nowPlayingMovieData?.results[0].overview}</Overview>
          </Banner>

          <MovieSlider type={Types.now_playing} data={nowPlayingMovieData!} />
          <MovieSlider type={Types.popular} data={popularMovieData!} />
          <MovieSlider type={Types.top_rated} data={topRatedMovieData!} />
          <MovieSlider type={Types.upcoming} data={upComingMovieData!} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
