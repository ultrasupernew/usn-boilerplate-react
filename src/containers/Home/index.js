import React from 'react';
import styled from 'styled-components';
import logo from 'public/logo.svg';

const Homecontainer = styled.div`
  text-align: center;
`;

const HomeHeader = styled.div`
  background-color: #222;
  padding: 20px;
  color: white;
  img {
    width: 180px;
  }
`;

class Home extends React.Component {
  render() {
    return (
      <Homecontainer>
        <HomeHeader className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to USN Boilerplate for React</h2>
        </HomeHeader>
        <p className="Home-intro">
          Hello
        </p>
      </Homecontainer>
    );
  }
}

export default Home;