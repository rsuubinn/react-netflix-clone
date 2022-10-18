import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResults } from "../api";
import { makeImagePath } from "../utils";

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

const Row = styled(motion.div)<{ arrayLength: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.arrayLength}, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 10,
  },
};
function Home() {
  const [click, setClick] = useState(0);
  const onClick = () => {
    setClick((prev) => prev + 1);
  };
  const { data, isLoading } = useQuery<IGetMoviesResults>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={onClick}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row
                arrayLength={data?.results.length!}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={click}
              >
                {data?.results.map((i) => (
                  <Box key={i.id}>{i.id}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
