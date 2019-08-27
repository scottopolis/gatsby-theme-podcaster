import React from "react";
import PropTypes from "prop-types";
import { FaPlay, FaPause } from "react-icons/fa";
import formatTime from "./lib/formatTime";
import VolumeBars from "./VolumeBars";
// import "./player-styles.css"

export default class Player extends React.Component {
  static propTypes = {
    show: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    let lastPlayed = 0;
    let lastVolumePref = 1;
    let lastPlaybackRate = 1;

    // for Server Side Rendering
    if (typeof window !== "undefined") {
      const { show } = this.props;
      const lp = localStorage.getItem(`lastPlayed${show.number}`);
      const lastVolume = localStorage.getItem(`lastVolumeSetting`);
      const lastPlayback = localStorage.getItem(`lastPlaybackSetting`);

      if (lp) lastPlayed = JSON.parse(lp).lastPlayed;
      if (lastVolume) lastVolumePref = JSON.parse(lastVolume).lastVolumePref;
      if (lastPlayback)
        lastPlaybackRate = JSON.parse(lastPlayback).lastPlaybackRate;
    }

    this.state = {
      progressTime: 50,
      playing: false,
      duration: 0,
      currentTime: lastPlayed,
      currentVolume: lastVolumePref,
      playbackRate: lastPlaybackRate,
      timeWasLoaded: lastPlayed !== 0,
      showTooltip: false,
      tooltipPosition: 0,
      tooltipTime: "0:00"
    };
  } // END Constructor

  componentWillUpdate(nextProps, nextState) {
    this.audio.playbackRate = nextState.playbackRate;
  }

  componentDidMount() {
    // Add a hashchange listener
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", this.testAudioSeek);
    }
  }

  componentWillUnmount() {
    // Add a hashchange listener
    if (typeof window !== "undefined") {
      window.removeEventListener("hashchange", this.testAudioSeek);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { show } = this.props;
    const { currentTime, currentVolume, playbackRate } = this.state;
    if (show.number !== prevProps.show.number) {
      const lp = localStorage.getItem(`lastPlayed${show.number}`);
      if (lp) {
        const lastVolume = localStorage.getItem(`lastVolumeSetting`);
        const lastPlayback = localStorage.getItem(`lastPlaybackSetting`);
        const data = JSON.parse(lp);
        const data2 = JSON.parse(lastVolume);
        const data3 = JSON.parse(lastPlayback);

        this.setState({
          currentTime: data.lastPlayed,
          currentVolume: data2.lastVolumePref,
          playbackRate: data3.lastPlaybackRate
        });
        this.audio.currentTime = data.lastPlayed;
        this.audio.volume = data2.lastVolumePref;
        this.audio.playbackRate = data3.lastPlaybackRate;
      }
      this.audio.play();
    } else {
      localStorage.setItem(
        `lastPlayed${show.number}`,
        JSON.stringify({ lastPlayed: currentTime })
      );
      localStorage.setItem(
        `lastVolumeSetting`,
        JSON.stringify({ lastVolumePref: currentVolume })
      );
      localStorage.setItem(
        `lastPlaybackSetting`,
        JSON.stringify({ lastPlaybackRate: playbackRate })
      );
    }
  }

  timeUpdate = e => {
    // console.log('Updating Time');
    const { show } = this.props;
    const { timeWasLoaded } = this.state;
    // Check if the user already had a curent time
    if (timeWasLoaded) {
      const lp = localStorage.getItem(`lastPlayed${show.number}`);

      if (lp) {
        e.currentTarget.currentTime = JSON.parse(lp).lastPlayed;
      }
      this.setState({ timeWasLoaded: false });
    } else {
      const { currentTime = 0, duration = 0 } = e.currentTarget;

      const progressTime = (currentTime / duration) * 100;
      if (Number.isNaN(progressTime)) return;
      this.setState({ progressTime, currentTime, duration });
    }
  };

  volumeUpdate = e => {
    const { timeWasLoaded } = this.state;
    // Check if the user already had a curent volume
    if (timeWasLoaded) {
      const lastVolume = localStorage.getItem(`lastVolumeSetting`);
      if (lastVolume) {
        e.currentTarget.volume = JSON.parse(lastVolume).lastVolumePref;
      }
      this.setState({ timeWasLoaded: false });
    }
  };

  groupUpdates = e => {
    this.timeUpdate(e);
    this.volumeUpdate(e);
  };

  togglePlay = () => {
    const { playing } = this.state;
    const method = playing ? "pause" : "play";
    this.audio[method]();
  };

  scrubTime = eventData =>
    (eventData.nativeEvent.offsetX / this.progress.offsetWidth) *
    this.audio.duration;

  scrub = e => {
    this.audio.currentTime = this.scrubTime(e);
  };

  seekTime = e => {
    this.setState({
      tooltipPosition: e.nativeEvent.offsetX,
      tooltipTime: formatTime(this.scrubTime(e))
    });
  };

  playPause = () => {
    this.setState({ playing: !this.audio.paused });
    // const method = this.audio.paused ? "add" : "remove";
    // This controls the active episode indicator
    // document.querySelector('.bars').classList[method]('bars--paused'); // 💩
  };

  volume = e => {
    this.audio.volume = e.currentTarget.value;
    this.setState({
      currentVolume: `${e.currentTarget.value}`
    });
  };

  speedUp = () => {
    this.speed(0.25);
  };

  speedDown = e => {
    e.preventDefault();
    this.speed(-0.25);
  };

  speed = change => {
    const playbackRateMax = 2.5;
    const playbackRateMin = 0.75;

    let playbackRate = this.state.playbackRate + change;

    if (playbackRate > playbackRateMax) {
      playbackRate = playbackRateMin;
    }

    if (playbackRate < playbackRateMin) {
      playbackRate = playbackRateMax;
    }

    this.setState({ playbackRate });
  };

  testAudioSeek = event => {
    // TODO get the new hash from the event, prevent hash from actually changing

    // this looks for a URL hash using this format:
    // #playFrom=<number of seconds> (e.g. #playFrom=120)
    if (typeof window !== "undefined") {
      const url = new URL(window.location);
      const time = url.hash.slice(10);

      if (time) {
        this.audio.currentTime = time;
      }
    }
  };

  render() {
    const { show } = this.props;
    const {
      playing,
      playbackRate,
      progressTime,
      currentTime,
      duration,
      showTooltip,
      tooltipPosition,
      tooltipTime
    } = this.state;

    return (
      <div className="player m-0 flex flex-no-wrap items-center w-auto bg-gray-900 text-gray-200 text-sm overflow-hidden h-20 border-t border-gray-700">
        <div className="player__section player__section--left p-1 pl-4 flex-1 text-center">
          <button
            onClick={this.togglePlay}
            aria-label={playing ? "pause" : "play"}
            type="button"
            className="text-xl mt-1"
          >
            <p className="player__icon">{playing ? <FaPause /> : <FaPlay />}</p>
          </button>
        </div>

        <div className="player__section player__section--middle w-2/3 sm:w-5/6 p-1">
        <h3 className="player__title truncate">Playing: {show.title}</h3>
          <div
            className="progress bg-gray-700 rounded h-2 block mt-1 mb-1"
            onClick={this.scrub}
            onMouseMove={this.seekTime}
            onMouseEnter={() => {
              this.setState({ showTooltip: true });
            }}
            onMouseLeave={() => {
              this.setState({ showTooltip: false });
            }}
            ref={x => (this.progress = x)}
          >
            {/* eslint-enable */}

            <div
              className="progress__time h-full rounded bg-gray-500"
              style={{ width: `${progressTime}%` }}
            />
          </div>

          <span className="float-left text-xs">{formatTime(currentTime)} </span> 
          <span className="float-right text-xs">{formatTime(duration)}</span>
          
          <div
            className="player__tooltip text-gray-600 text-xs text-center w-full"
            style={{
              left: `${tooltipPosition}px`,
              opacity: `${showTooltip ? "1" : "0"}`
            }}
          >
            {tooltipTime}
          </div>
        </div>

        <div className="player__section player__section--right text-center p-1 pr-4 flex-1">
          <button
            onClick={this.speedUp}
            onContextMenu={this.speedDown}
            className="player__speed text-xs border rounded pl-1 pr-1 w-12 m-auto opacity-50"
            type="button"
          >
            <span className="player__speeddisplay">{playbackRate}&times;</span>
          </button>
          {/* <div className="player__volume">
            <p>Volume</p>
            <div className="player__inputs">
              <VolumeBars volume={this.volume} />
            </div>
          </div> */}
        </div>
        <audio
          ref={audio => (this.audio = audio)}
          onPlay={this.playPause}
          onPause={this.playPause}
          onTimeUpdate={this.timeUpdate}
          onVolumeChange={this.volumeUpdate}
          onLoadedMetadata={this.groupUpdates}
          src={show.url}
        />
        {/* <button onClick={this.testAudioSeek}>Test Seeking</button> */}
      </div>
    );
  }
}
