import React from 'react';
import styled from 'styled-components';
// import DiscordIcon from '../icons/Discord.svg';
import LoadingVideo from '../icons/loading.webm';
import colors from '../utils/colors';

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


// const LoadingIcon = styled(DiscordIcon)`
//   color: ${colors.primary};
//   width: 30%;
//   height: 30%;
//   max-width: 160px;
//   max-height: 160px;
//   min-width: 80px;
//   min-height: 80px;
// `;


class Loading extends React.Component<any, any> {
  
  contentSequence = ['少女祈祷中', '少女祈祷中.', '少女祈祷中..', '少女祈祷中...', '少女祈祷中....']
  interval: any;
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
    };

    this.interval = setInterval(() => {
      this.setState({ value: this.state.value === this.contentSequence.length - 1 ? 0 : this.state.value + 1 })
    }, 250);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
    <StyledLoading>
      <video loop autoPlay playsInline >
        <source src={LoadingVideo} />
        {/* <source src={'../icons/Discord.svg'} /> */}
      </video>
      <StyledLoadingContent>
        {this.contentSequence[this.state.value]}
      </StyledLoadingContent>
    </StyledLoading>
    )
  }
}

export default Loading;
