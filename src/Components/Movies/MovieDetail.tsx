import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IMovieDetail } from "../../apis/movieApis";
import { makeImagePath, makeRuntime } from "../../utils";
import StarIcon from "@mui/icons-material/Star";

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

const MovieBox = styled(motion.div)`
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

const movieBoxVariants = {};

interface IMovieDetailProps {
  type: string;
  movieId: string;
}

function MovieDetail({ type, movieId }: IMovieDetailProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  const { data: movieData, isLoading: movieLoading } = useQuery<IMovieDetail>(
    ["movies", `${type}_detail`],
    () => getMovieDetail(movieId)
  );

  const onOverlayClicked = () => {
    navigate("/");
  };
  return (
    <AnimatePresence>
      {movieLoading ? (
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
          {movieData ? (
            <Wrapper key={type + movieData.id}>
              <MovieBox
                style={{ top: scrollY.get() + 100 }}
                variants={movieBoxVariants}
              >
                <Poster
                  imagepath={makeImagePath(
                    movieData.backdrop_path
                      ? movieData.backdrop_path
                      : movieData.poster_path
                  )}
                />
                <Detail>
                  <Title>{movieData.title}</Title>
                  <FlexBox>
                    <div>
                      <ReleaseDate>
                        {movieData.release_date.split("-", 1)}
                      </ReleaseDate>
                      {movieData.runtime ? (
                        <Runtime>{makeRuntime(movieData.runtime)}</Runtime>
                      ) : (
                        <span>정보 없음</span>
                      )}
                    </div>
                    <div>
                      <Vote>
                        <StarIcon></StarIcon>
                        {movieData.vote_average === 0
                          ? "정보 없음"
                          : movieData.vote_average.toFixed(1)}
                      </Vote>
                    </div>
                  </FlexBox>
                  <Overview>
                    {movieData.overview ? movieData.overview : "정보 없음"}
                  </Overview>

                  <Genres>
                    <span>장르: </span>
                    {movieData.genres.map((genre) => (
                      <Genre key={type + genre.id}>{genre.name}</Genre>
                    ))}
                  </Genres>
                </Detail>
              </MovieBox>
            </Wrapper>
          ) : null}
        </>
      )}
    </AnimatePresence>
  );
}

export default MovieDetail;
