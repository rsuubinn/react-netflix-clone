import { useQuery } from "react-query";
import styled from "styled-components";
import { getOnTheAirTvPrograms, IGetTvResults } from "../apis/tvApi";
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
  font-size: 36px;
  width: 50%;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 12px;
`;

function Tv() {
  const { data, isLoading } = useQuery<IGetTvResults>(
    ["tv", "onTheAir"],
    getOnTheAirTvPrograms
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner imagepath={makeImagePath(data?.results[0].backdrop_path!)}>
            <Title></Title>
            <Overview></Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
