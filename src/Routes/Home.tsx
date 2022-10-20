import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResults } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
const Slider = styled.div`
  position: relative;
`;

const SliderTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  padding: 5px 60px;
  font-size: 30px;
  font-weight: 600;
`;

const LeftButton = styled(motion.div)`
  /* background-color: orange; */
  z-index: -99;
  cursor: pointer;
  position: absolute;
  width: 60px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    color: white;
    font-size: 60px;
  }
`;

const RightButton = styled(motion.div)`
  right: 0;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  width: 60px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    color: white;
    font-size: 60px;
  }
`;

const Row = styled(motion.div)`
  padding: 0px 60px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  border-radius: 5px;
  cursor: pointer;
  height: 300px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  opacity: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  h4 {
    color: white;
    text-align: center;
  }
`;

const BigMovie = styled(motion.div)`
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

const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 50%;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
  font-size: 30px;
  padding: 20px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
  padding: 20px;
  font-size: 20px;
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  opacity: 0;
`;
const boxTransition = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      duration: 0.3,
      delay: 0.5,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.1,
      delay: 0.5,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const arrowBtnVaraints = {
  normal: { opacity: 0 },
  hover: { opacity: 1 },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useQuery<IGetMoviesResults>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => +bigMovieMatch.params.movieId! === movie.id);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => {
    navigate("/");
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>Now Playing</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <LeftButton
                variants={arrowBtnVaraints}
                initial="normal"
                whileHover="hover"
              >
                <NavigateBeforeIcon />
              </LeftButton>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      onClick={() => {
                        onBoxClicked(movie.id);
                      }}
                      layoutId={movie.id + ""}
                      initial="normal"
                      whileHover="hover"
                      variants={boxTransition}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.poster_path, "w500")}
                      key={movie.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <RightButton
                variants={arrowBtnVaraints}
                initial="normal"
                whileHover="hover"
                onClick={increaseIndex}
              >
                <NavigateNextIcon />
              </RightButton>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClicked}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{
                    top: scrollY.get() + 100,
                  }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgPhoto={makeImagePath(
                          clickedMovie.backdrop_path,
                          "w500"
                        )}
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
