import React from 'react';
import styled from 'styled-components';
import DiscordIcon from '../icons/Discord';
import colors from '../utils/colors';
import { AnyARecord } from 'dns';

const StyledLoading = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1rem;
`;

const StyledLoadingContent = styled.span`
  width: 100px;
  margin-left: 10px;
`;



const LoadingIcon = styled(DiscordIcon)`
  color: ${colors.primary};
  width: 30%;
  height: 30%;
  max-width: 160px;
  max-height: 160px;
  min-width: 80px;
  min-height: 80px;
`;


class Loading extends React.Component<any, any> {
  
  contentSequence = ['少女祈祷中', '少女祈祷中.', '少女祈祷中..', '少女祈祷中...', '少女祈祷中....']
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ value: this.state.value === this.contentSequence.length - 1 ? 0 : this.state.value + 1 })
    }, 250);
  }

  render() {
    return (
    <StyledLoading>
      <LoadingIcon />
      <StyledLoadingContent>
        {this.contentSequence[this.state.value]}
      </StyledLoadingContent>
    </StyledLoading>
    )
  }
}

export default Loading;
