import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getOnTheAirTvPrograms,
  getPopularTvPrograms,
  getTopRatedTvPrograms,
  IGetTvResults,
} from "../apis/tvApis";
import TvSlider from "../Components/Tv/TvSlider";
import { makeImagePath, TvTypes } from "../utils";
import InfoIcon from "@mui/icons-material/Info";
import { AnimatePresence } from "framer-motion";
import TvDetail from "../Components/Tv/TvDetail";

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
  font-size: 26px;
  width: 50%;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 12px;
`;

const Detail = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: rgba(124, 124, 124, 0.4);
  font-weight: 600;
  width: 10vw;
  svg {
    margin-right: 8px;
  }
  &:hover {
    background-color: rgba(124, 124, 124, 0.2);
  }
`;

function Tv() {
  const { data: onTheAirTvData, isLoading: onTheAirLoading } =
    useQuery<IGetTvResults>(["tv", "onTheAir"], getOnTheAirTvPrograms);
  const { data: topRatedTvData, isLoading: topRatedLoading } =
    useQuery<IGetTvResults>(["tv", "topRated"], getTopRatedTvPrograms);
  const { data: popularTvData, isLoading: popularLoading } =
    useQuery<IGetTvResults>(["tv", "popular"], getPopularTvPrograms);
  const navigate = useNavigate();
  function onDetailBtnClick(tvId: number) {
    navigate(`/tv/${tvId}`);
  }
  const tvMatch = useMatch("/tv/:tvId");
  return (
    <Wrapper>
      {onTheAirLoading && topRatedLoading && popularLoading ? (
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
            <Detail
              onClick={() => onDetailBtnClick(onTheAirTvData?.results[0].id!)}
            >
              <InfoIcon /> 상세 정보
            </Detail>
          </Banner>

          <TvSlider data={onTheAirTvData!} type={TvTypes.on_the_air} />
          <TvSlider data={topRatedTvData!} type={TvTypes.top_rated} />
          <TvSlider data={popularTvData!} type={TvTypes.popular} />
        </>
      )}
      <AnimatePresence>
        {tvMatch ? (
          <TvDetail tvId={tvMatch.params.tvId!} type={TvTypes.on_the_air} />
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Tv;
