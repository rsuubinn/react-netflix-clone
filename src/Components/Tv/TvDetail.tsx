import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import StarIcon from "@mui/icons-material/Star";
import ClearIcon from "@mui/icons-material/Clear";
import { getTvDetail, ITvDetail } from "../../apis/tvApis";
import Loader from "../Loader";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  opacity: 0;
  z-index: 1;
`;

const Wrapper = styled.div``;

const TvBox = styled(motion.div)`
  z-index: 1;
  width: 50vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.black.darker};
`;

const Poster = styled.div<{ imagepath: string }>`
  position: relative;
  width: 100%;
  height: 40%;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), #181818),
    url(${(props) => props.imagepath});
`;

const Detail = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 0px 20px;
`;

const DeleteBtn = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: rgba(50, 50, 50, 0.8);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    cursor: pointer;
    font-size: 30px;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 40px;
`;

const Overview = styled.p`
  margin-bottom: 20px;
  line-height: 1.5;
`;

const Seasons = styled.div`
  margin-right: 10px;
  span {
    margin-right: 5px;
  }
`;
const Episode = styled.div`
  span {
    margin-right: 5px;
  }
`;

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
  span {
    color: gray;
    margin-right: 5px;
  }
`;

const Genre = styled.li`
  margin-right: 6px;
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

const tvBoxVariants = {};

interface ITvDetailProps {
  type: string;
  tvId: string;
}

function TvDetail({ type, tvId }: ITvDetailProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  const { data: tvData, isLoading: tvLoading } = useQuery<ITvDetail>(
    ["tv", `${type}_detail`],
    () => getTvDetail(tvId)
  );

  const onOverlayClicked = () => {
    navigate(-1);
  };
  return (
    <AnimatePresence>
      {tvLoading ? (
        <Loader />
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>{tvData?.name} - 넷플릭스</title>
            </Helmet>
          </HelmetProvider>
          <Overlay
            onClick={onOverlayClicked}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          {tvData ? (
            <Wrapper key={type + tvData.id}>
              <TvBox
                style={{ top: scrollY.get() + 100 }}
                variants={tvBoxVariants}
              >
                <Poster
                  imagepath={makeImagePath(
                    tvData.backdrop_path
                      ? tvData.backdrop_path
                      : tvData.poster_path
                  )}
                />
                <Detail>
                  <DeleteBtn onClick={onOverlayClicked}>
                    <ClearIcon />
                  </DeleteBtn>
                  <Title>{tvData.name}</Title>
                  <FlexBox>
                    <div>
                      <ReleaseDate>
                        {tvData.first_air_date.split("-", 1)}
                      </ReleaseDate>
                      <Seasons>
                        <span>시즌</span>
                        {tvData.number_of_seasons}개
                      </Seasons>
                      <Episode>
                        <span>에피소드</span>
                        {tvData.number_of_episodes}개
                      </Episode>
                    </div>
                    <div>
                      <Vote>
                        <StarIcon></StarIcon>
                        {tvData.vote_average === 0
                          ? "정보 없음"
                          : tvData.vote_average.toFixed(1)}
                      </Vote>
                    </div>
                  </FlexBox>
                  <Overview>
                    {tvData.overview ? tvData.overview : "정보 없음"}
                  </Overview>

                  <Genres>
                    <span>장르: </span>
                    {tvData.genres ? (
                      tvData.genres.map((genre) => (
                        <Genre key={type + genre.id}>{genre.name}</Genre>
                      ))
                    ) : (
                      <span>정보 없음</span>
                    )}
                  </Genres>
                </Detail>
              </TvBox>
            </Wrapper>
          ) : null}
        </>
      )}
    </AnimatePresence>
  );
}

export default TvDetail;
