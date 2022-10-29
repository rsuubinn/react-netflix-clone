import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResults,
} from "../apis/movieApis";
import { makeImagePath, MovieTypes } from "../utils";
import MovieSlider from "../Components/Movies/MovieSlider";
import InfoIcon from "@mui/icons-material/Info";
import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import MovieDetail from "../Components/Movies/MovieDetail";

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
  font-size: 26px;
  width: 50%;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 12px;
`;

const Detail = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: rgba(124, 124, 124, 0.4);
  font-weight: 600;
  width: 10vw;
  svg {
    margin-right: 8px;
  }
  &:hover {
    background-color: rgba(124, 124, 124, 0.2);
  }
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
  const movieMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  function onDetailBtnClick(movieId: number) {
    navigate(`/movies/${movieId}`);
  }
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
            <Detail
              onClick={() =>
                onDetailBtnClick(nowPlayingMovieData?.results[0].id!)
              }
            >
              <InfoIcon /> 상세 정보
            </Detail>
          </Banner>

          <MovieSlider
            type={MovieTypes.now_playing}
            data={nowPlayingMovieData!}
          />
          <MovieSlider type={MovieTypes.popular} data={popularMovieData!} />
          <MovieSlider type={MovieTypes.top_rated} data={topRatedMovieData!} />
          <MovieSlider type={MovieTypes.upcoming} data={upComingMovieData!} />
        </>
      )}

      <AnimatePresence>
        {movieMatch ? (
          <MovieDetail
            movieId={movieMatch.params.movieId!}
            type={MovieTypes.now_playing}
          />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Home;
