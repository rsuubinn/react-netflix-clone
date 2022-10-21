import { AnimatePresence, motion, useScroll } from "framer-motion";
import styled from "styled-components";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import { IGetMoviesResults } from "../api";

const Wrapper = styled.div`
  margin-bottom: 45vh;
`;

const SliderRow = styled.div``;

const SliderTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  padding: 5px 60px;
  font-size: 30px;
  font-weight: 600;
`;

const LeftButton = styled(motion.div)`
  z-index: 2;
  cursor: pointer;
  position: absolute;
  opacity: 0;
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
  z-index: 2;
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
  z-index: 1;
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
  z-index: 3;
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
  z-index: 3;
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
  hidden: (reverse: boolean) => ({
    // x: -window.innerWidth - 5,
    x: window.innerHeight + 5,
    // x: reverse ? -window.innerWidth - 5 : window.innerWidth + 5
  }),
  visible: {
    x: 0,
  },
  exit: (reverse: boolean) => ({
    // x: window.innerHeight + 5,
    x: -window.innerWidth - 5,
    // x: reverse ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
};

const arrowBtnVaraints = {
  normal: { opacity: 0 },
  hover: { opacity: 1 },
};

const offset = 6;

interface ISlider {
  data: IGetMoviesResults;
  type: string;
}

function Slider({ type, data }: ISlider) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => +bigMovieMatch.params.movieId! === movie.id);

  const increaseIndex = () => {
    setReverse(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setReverse(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
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
      <SliderRow>
        <SliderTitle>{type}</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <LeftButton
            variants={arrowBtnVaraints}
            initial="normal"
            whileHover="hover"
            onClick={decreaseIndex}
            custom={reverse}
          >
            <NavigateBeforeIcon />
          </LeftButton>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={type + index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  onClick={() => {
                    onBoxClicked(movie.id);
                  }}
                  layoutId={type + movie.id + ""}
                  initial="normal"
                  whileHover="hover"
                  variants={boxTransition}
                  transition={{ type: "tween" }}
                  bgPhoto={makeImagePath(movie.poster_path, "w500")}
                  key={type + movie.id}
                >
                  <Info variants={infoVariants}>
                    <h2 style={{ color: "white" }}>{type + movie.id}</h2>
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
            custom={reverse}
          >
            <NavigateNextIcon />
          </RightButton>
        </AnimatePresence>
      </SliderRow>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOverlayClicked}
            />
            <BigMovie
              layoutId={type + bigMovieMatch.params.movieId}
              style={{
                top: scrollY.get() + 100,
              }}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(clickedMovie.backdrop_path, "w500")}
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <h2 style={{ color: "white" }}>
                    {type + bigMovieMatch.params.movieId}
                  </h2>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Slider;
