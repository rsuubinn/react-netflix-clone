import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IMovieDetail } from "../api";
import { makeImagePath, makeRuntime } from "../utils";
import StarIcon from "@mui/icons-material/Star";

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
  width: 50vw;
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
  background-image: linear-gradient(rgba(0, 0, 0, 0), #181818),
    url(${(props) => props.imagepath});
`;

const Detail = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 0px 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 40px;
`;

const Overview = styled.p`
  margin-bottom: 20px;
  line-height: 1.3;
`;

const Runtime = styled.div``;

const FlexBox = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  div:first-child {
    display: flex;
    align-items: center;
    margin-right: 8px;
    div:first-child {
      margin-right: 8px;
    }
  }
`;

const Vote = styled.div`
  display: flex;
  align-items: center;
  svg {
    color: ${(props) => props.theme.red};
    margin-right: 3px;
  }
`;

const ReleaseDate = styled.div``;

const Genres = styled.ul`
  display: flex;
  span:last-child {
    display: none;
  }
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
  console.log(movieData);
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
            style={{ top: scrollY.get() + 100 }}
            variants={movieBoxVariants}
          >
            <Poster
              imagepath={makeImagePath(
                movieData.backdrop_path
                  ? movieData.backdrop_path
                  : movieData.poster_path
              )}
            />
            <Detail>
              <Title>{movieData.title}</Title>
              <FlexBox>
                <div>
                  <ReleaseDate>
                    {/* {movieData.release_date.split("-", 1)} */}
                  </ReleaseDate>
                  {movieData.runtime && (
                    <Runtime>{makeRuntime(movieData.runtime)}</Runtime>
                  )}
                </div>
                <div>
                  <Vote>
                    <StarIcon></StarIcon>
                    {/* {movieData.vote_average.toFixed(1)} */}
                  </Vote>
                </div>
              </FlexBox>
              <Overview>{movieData.overview}</Overview>

              <Genres>
                {/* {movieData.genres.map((genre) => (
                  <>
                    <li key={genre.id}>{genre.name}</li>
                    <span> • </span>
                  </>
                ))} */}
              </Genres>
            </Detail>
          </MovieBox>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
}

export default MovieDetail;
