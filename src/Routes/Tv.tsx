import { useQuery } from "react-query";
import styled from "styled-components";
import { getOnTheAirTvPrograms, IGetTvResults } from "../apis/tvApi";
import TvSlider from "../Components/Tv/TvSlider";
import { makeImagePath, TvTypes } from "../utils";

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
  width: 60%;
`;

function Tv() {
  const { data: onTheAirTvData, isLoading: onTheAirLoading } =
    useQuery<IGetTvResults>(["tv", "onTheAir"], getOnTheAirTvPrograms);

  return (
    <Wrapper>
      {onTheAirLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            imagepath={makeImagePath(
              onTheAirTvData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{onTheAirTvData?.results[0].name}</Title>
            <Overview>{onTheAirTvData?.results[0].overview}</Overview>
          </Banner>

          <TvSlider data={onTheAirTvData!} type={TvTypes.on_the_air} />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
