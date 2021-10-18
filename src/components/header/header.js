import styled from "styled-components";

const Header = () => {
  return <Containheader>Your Consultation App</Containheader>;
};

export default Header;

const Containheader = styled.div`
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #40376e;
  color: #fff;
  margin-bottom: 30px;
  font-size: 30px;
  font-family: Lato;
`;
