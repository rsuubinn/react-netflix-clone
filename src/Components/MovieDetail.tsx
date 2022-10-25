import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IMovieDetail } from "../api";
import { makeImagePath, makeRuntime } from "../utils";

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

const Runtime = styled.div`
  color: ${(props) => props.theme.white.lighter};
`;

const Vote = styled.div`
  color: ${(props) => props.theme.white.lighter};
`;

const ReleaseDate = styled.div`
  color: ${(props) => props.theme.white.lighter};
`;

const Genres = styled.div`
  color: ${(props) => props.theme.white.lighter};
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

interface IMovieDetailProps {
  type: string;
  movieId: string;
}

function MovieDetail({ type, movieId }: IMovieDetailProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { data: movieData, isLoading } = useQuery<IMovieDetail>(
    ["movies", `${type}`],
    () => getMovieDetail(movieId)
  );
  const movieMatch = useMatch("/movies/:movieId");
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
            {movieData.runtime && (
              <Runtime>{makeRuntime(movieData.runtime)}</Runtime>
            )}
            <Vote>{movieData.vote_average}</Vote>
            <ReleaseDate>{movieData.release_date}</ReleaseDate>
            <Genres>
              {movieData.genres.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </Genres>
          </MovieBox>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
}

export default MovieDetail;
