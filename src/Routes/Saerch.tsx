import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResults, ISearch } from "../api";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  padding: 0px 50px;
  margin-top: 25vh;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  row-gap: 60px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  position: absolute;
  bottom: 0;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  opacity: 0;
  h4 {
    color: white;
    text-align: center;
  }
`;

const Box = styled(motion.div)<{ imagepath: string }>`
  border-radius: 5px;
  color: white;
  height: 150px;
  background-image: url(${(props) => props.imagepath});
  background-position: center center;
  background-size: cover;
  cursor: pointer;
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
`;

const BigSearch = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  color: ${(props) => props.theme.white.lighter};
  border-radius: 5px;
`;

const BigCover = styled.div<{ imagepath: string }>`
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  /* background-image: url(${(props) => props.imagepath}); */
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 50%;
`;
const BigTitle = styled.h2``;
const BigOverview = styled.p``;

const boxVariants = {
  init: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
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
      duration: 0.3,
      delay: 0.5,
      type: "tween",
    },
  },
};

const bigSearchVariants = {};

function Search() {
  const { scrollY } = useScroll();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetSearchResults>(
    ["search", keyword],
    () => getSearch(keyword!)
  );

  const [boxClicked, setBoxClicked] = useState(false);
  const [clickedSearch, setClickedSearch] = useState<ISearch>();
  const onBoxClicked = (id: number) => {
    if (data) {
      const findClickedSearch = data.results.find((movie) => movie.id === id);
      setClickedSearch(findClickedSearch);
    }
    setBoxClicked(true);
  };
  const onOverlayClicked = () => {
    setBoxClicked(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Grid>
            {data?.results.map((search) =>
              search.poster_path && search.title ? (
                <Box
                  onClick={() => onBoxClicked(search.id)}
                  layoutId={search.id + ""}
                  whileHover="hover"
                  initial="init"
                  transition={{ type: "tween" }}
                  variants={boxVariants}
                  imagepath={makeImagePath(search.poster_path, "w500")}
                  key={search.id}
                >
                  <Info variants={infoVariants}>
                    <h4>{search.title}</h4>
                  </Info>
                </Box>
              ) : null
            )}
          </Grid>
          <AnimatePresence>
            {boxClicked && clickedSearch ? (
              <>
                <Overlay onClick={onOverlayClicked} />
                <BigSearch
                  layoutId={clickedSearch.id + ""}
                  variants={bigSearchVariants}
                  style={{ top: scrollY.get() + 100 }}
                >
                  <BigCover
                    imagepath={makeImagePath(clickedSearch.poster_path, "w500")}
                    style={{
                      backgroundImage: `linear-gradient(to top, #181818, transparent),url(${makeImagePath(
                        clickedSearch.poster_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedSearch.title}</BigTitle>
                  <BigOverview>{clickedSearch.overview}</BigOverview>
                </BigSearch>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default Search;
