import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath, TvTypes } from "../../utils";
import { IGetTvResults } from "../../apis/tvApis";
import TvDetail from "./TvDetail";

const Slider = styled.div`
  margin-bottom: 45vh;
  position: relative;
`;

const SliderTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  padding: 5px 60px;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const LeftButton = styled(motion.div)`
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

const SliderRow = styled(motion.div)`
  padding: 0px 60px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ imagepath: string }>`
  border-radius: 5px;
  cursor: pointer;
  height: 300px;
  background-image: url(${(props) => props.imagepath});
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
  display: block;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  h4 {
    color: white;
    text-align: center;
  }
`;

const boxVariants = {
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
  hidden: ({ reverse }: ICustomProps) => ({
    x: reverse ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: ({ reverse }: ICustomProps) => ({
    x: reverse ? window.innerWidth : -window.innerWidth,
  }),
};

const arrowBtnVaraints = {
  normal: { opacity: 0 },
  hover: { opacity: 1 },
};

const offset = 6;

interface ISlider {
  data: IGetTvResults;
  type: TvTypes;
}

interface ICustomProps {
  reverse: boolean;
}

function TvSlider({ data, type }: ISlider) {
  const navigate = useNavigate();
  const tvMatch = useMatch("/tv/:tvId");
  const tvSearchMatch = useMatch("/search/tv/:tvId");
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [sliderTitle, setSliderTitle] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const totalTv = data?.results.length - 1;
  const maxIndex = Math.floor(totalTv / offset) - 1;

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        setReverse(false);
        toggleLeaving();
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        setReverse(true);
        toggleLeaving();
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (tvId: number) => {
    if (isSearch) {
      navigate(`/search/tv/${tvId}`);
    } else {
      navigate(`/tv/${tvId}`);
    }
  };
  useEffect(() => {
    switch (type) {
      case "on_the_air":
        setSliderTitle("방영중인 티비 프로그램");
        break;
      case "top_rated":
        setSliderTitle("평점높은 티비 프로그램");
        break;
      case "popular":
        setSliderTitle("인기있는 티비 프로그램");
        break;
      case "search":
        setSliderTitle("티비 프로그램");
        setIsSearch(true);
        break;
    }
  }, [type]);
  return (
    <>
      {data ? (
        <>
          <Slider>
            <SliderTitle>{sliderTitle}</SliderTitle>
            <AnimatePresence
              custom={{ reverse }}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <SliderRow
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                custom={{ reverse }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      onClick={() => {
                        onBoxClicked(tv.id);
                      }}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      imagepath={makeImagePath(tv.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </SliderRow>
            </AnimatePresence>
            <LeftButton
              variants={arrowBtnVaraints}
              initial="normal"
              whileHover="hover"
              onClick={decreaseIndex}
              custom={{ reverse }}
            >
              <NavigateBeforeIcon />
            </LeftButton>
            <RightButton
              variants={arrowBtnVaraints}
              initial="normal"
              whileHover="hover"
              onClick={increaseIndex}
              custom={{ reverse }}
            >
              <NavigateNextIcon />
            </RightButton>
          </Slider>

          <AnimatePresence>
            {tvMatch ? (
              <TvDetail tvId={tvMatch.params.tvId!} type={type} />
            ) : null}
            {tvSearchMatch ? (
              <TvDetail tvId={tvSearchMatch.params.tvId!} type={type} />
            ) : null}
          </AnimatePresence>
        </>
      ) : null}
    </>
  );
}

export default TvSlider;
