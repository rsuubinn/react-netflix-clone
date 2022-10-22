import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { Navigate, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMoviesResults, IMovie } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  opacity: 0;
`;

const Wrapper = styled.div``;

const MovieBox = styled(motion.div)`
  /* z-index: 3; */
  width: 40vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

const Poster = styled.div<{ imagepath: string }>`
  width: 100%;
  height: 50%;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.imagepath});
`;

const Title = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
  font-size: 30px;
  padding: 20px;
`;

const Overview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
  padding: 20px;
  font-size: 20px;
`;

const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
  },
};

const movieBoxVariants = {};

interface IMovieDetail {
  type: string;
  movieId: string;
}

function MovieDetail({ type, movieId }: IMovieDetail) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { data: movieData, isLoading } = useQuery<IMovie>(
    ["movies", `${type}`],
    () => getMovieDetail(movieId)
  );
  const movieMatch = useMatch("/movies/:movieId");
  console.log(movieData?.backdrop_path);
  // const clickedMovie =
  //   movieMatch?.params.movieId &&
  //   data?.results.find((movie) => +movieMatch.params.movieId! === movie.id);
  const onOverlayClicked = () => {
    navigate("/");
  };
  return (
    <AnimatePresence>
      <Overlay
        onClick={onOverlayClicked}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      {movieData ? (
        <Wrapper key={type + movieData.id}>
          <MovieBox
            style={{ top: scrollY.get() + 30 }}
            variants={movieBoxVariants}
          >
            <Poster
              imagepath={makeImagePath(
                movieData.backdrop_path
                  ? movieData.backdrop_path
                  : movieData.poster_path
              )}
            />
            <Title>{movieData.title}</Title>
            <Overview>{movieData.overview}</Overview>
          </MovieBox>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
}

export default MovieDetail;
