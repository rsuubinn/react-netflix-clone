import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath, makeRuntime } from "../../utils";
import StarIcon from "@mui/icons-material/Star";
import { getTvDetail, ITvDetail } from "../../apis/tvApi";

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  opacity: 0;
`;

const Loader = styled.div``;

const Wrapper = styled.div``;

const TvBox = styled(motion.div)`
  width: 50vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;

const Poster = styled.div<{ imagepath: string }>`
  width: 100%;
  height: 50%;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), #181818),
    url(${(props) => props.imagepath});
`;

const Detail = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 0px 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 40px;
`;

const Overview = styled.p`
  margin-bottom: 20px;
  line-height: 1.3;
`;

const Runtime = styled.div``;

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
    navigate("/tv");
  };
  return (
    <AnimatePresence>
      {tvLoading ? (
        <Loader />
      ) : (
        <>
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
                  <Title>{tvData.name}</Title>
                  <FlexBox>
                    <div>
                      <ReleaseDate>
                        {tvData.first_air_date.split("-", 1)}
                      </ReleaseDate>
                    </div>
                    <div>
                      <Vote>
                        <StarIcon></StarIcon>
                        {tvData.vote_average.toFixed(1)}
                      </Vote>
                    </div>
                  </FlexBox>
                  <Overview>
                    {tvData.overview ? tvData.overview : "정보 없음"}
                  </Overview>

                  <Genres>
                    <span>장르: </span>
                    {tvData.genres.map((genre) => (
                      <Genre key={type + genre.id}>
                        {genre.name ? genre.name : "정보 없음"}
                      </Genre>
                    ))}
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
