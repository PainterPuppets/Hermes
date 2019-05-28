import React, { Component } from 'react';
import AgoraRTC, { Client, Stream } from 'agora-rtc-sdk'
import { Button } from 'antd';

class HomePageContainer extends Component {
  client: Client;
  uid: number = 0;
  stream: Stream | undefined = undefined;
  constructor(props: any) {
    super(props);
    this.client = AgoraRTC.createClient({ mode: 'live', codec: "h264" });
  }

  componentDidMount() {
    this.client.init("d361ecebc9a740aa90674d92041ba675", function () {
      console.log("AgoraRTC client initialized");
    }, function (err: any) {
      console.log("AgoraRTC client init failed", err);
    });
  }

  onJoin = () => {
    this.client.join("", "test-channel", 0, (uid) => {
      this.uid = uid;
      console.log("User " + uid + " join channel successfully");
    }, (err) => {
      console.log("Join channel failed", err);
    });
  }
  
  onCreateStream = () => {
    this.stream = AgoraRTC.createStream({
      streamID: this.uid,
      audio: true,
      video: false,
      screen: false
    });

    this.stream.init(() => {
      if (!this.stream) {
        return;
      }
      console.log("getUserMedia successfully");
      this.stream.play('agora_local');
    
    }, function (err) {
      console.log("getUserMedia failed", err);
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.onJoin} type="primary">加入频道</Button>
      </div>
    );
  }
}
export default HomePageContainer;