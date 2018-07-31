import React from 'react';
import styled from 'styled-components';
import logo from './logo.svg';
import './Home.css';

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
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
      </Homecontainer>
    );
  }
}

export default Home;
