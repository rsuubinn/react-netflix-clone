import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: wait;
`;

const Text = styled.div`
  color: ${(props) => props.theme.white.lighter};
`;

function Loader() {
  return (
    <Wrapper>
      <Text>Loading...</Text>
    </Wrapper>
  );
}

export default Loader;
