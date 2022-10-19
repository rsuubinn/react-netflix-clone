import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResults } from "../api";
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
  background-color: ${(props) => props.theme.black.darker};
  width: 100%;
  height: 30px;
  opacity: 0;
  bottom: 0;
  h4 {
    color: white;
    text-align: center;
  }
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  color: white;
  width: 250px;
  height: 150px;
  border-radius: 5px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center center;
  background-size: cover;
  cursor: pointer;
`;

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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetSearchResults>(
    ["search", keyword],
    () => getSearch(keyword!)
  );
  const [boxClicked, setBoxClicked] = useState(false);

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Grid>
          {data?.results.map((search) =>
            search.poster_path ? (
              <Box
                whileHover="hover"
                initial="init"
                transition={{ type: "tween" }}
                variants={boxVariants}
                bgPhoto={makeImagePath(search.poster_path, "w500")}
                key={search.id}
              >
                <Info variants={infoVariants}>
                  <h4>{search.title}</h4>
                </Info>
              </Box>
            ) : null
          )}
        </Grid>
      )}
    </>
  );
}

export default Search;
