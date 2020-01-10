import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import AuthStore from 'store/AuthStore';
import colors from '../utils/colors';
import LoginPage from './Login';
import App from './App';
import Loading from './Loading';


const StyledHermes = styled.div`
  background-color: ${colors.grayLight};
  border-color: ${colors.grayLight};
  display: flex;
  height: 100%;
  min-height: 100%;
  width: 100%;
`;

@observer
class Hermes extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    if (AuthStore.initialize) {
      return (
        <StyledHermes>
          <Loading />
        </StyledHermes>
      )
    }

    if (!AuthStore.isAuthenticated) {
      return (
        <LoginPage/>
      );  
    }

    return <App />
  }
}

export default Hermes;
