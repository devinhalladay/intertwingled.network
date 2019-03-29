import React, { Component } from 'react';

import Diptych from './components/Diptych';
import RandomButton from './components/RandomButton';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      allChannels: null,
      versoChannel: null,
      rectoChannel: null,
      versoBlock: null,
      rectoBlock: null,
      loading: true,
    })

    this.getNewChannels = this.getNewChannels.bind(this);
    this.getChannel = this.getChannel.bind(this);
    this.submitVersoForm = this.submitVersoForm.bind(this);
    this.submitRectoForm = this.submitRectoForm.bind(this);
    this.getRandomVersoChannel = this.getRandomVersoChannel.bind(this);
    this.getRandomRectoChannel = this.getRandomRectoChannel.bind(this);
    this.getRandomBothChannels = this.getRandomBothChannels.bind(this);
    this.refreshVersoSheet = this.refreshVersoSheet.bind(this);
  }

  componentWillMount() {
    this.getNewChannels(() => {
      this.setState({
        versoChannel: this.state.allChannels.slice(1, 2)[0],
        rectoChannel: this.state.allChannels.slice(0, 1)[0]
      }, () => {
        this.setState({
          versoBlock: this.state.versoChannel.contents[0],
          rectoBlock: this.state.rectoChannel.contents[0]
        }, () => {
          this.setState({
            loading: false
          })
        })
      })
    });
  }

  getNewChannels(callback) {
    let totalPages;
    let channels;

    fetch('http://api.are.na/v2/channels?per=100')
      .then(response => {
        return response.json();
      }).then(data => {
        totalPages = data.total_pages;

        fetch(`http://api.are.na/v2/channels?page=${Math.floor(Math.random() * Math.floor(totalPages))}&amp;per=100`).then(response => {
          return response.json();
        }).then(data => {
          channels = data.channels.filter(obj => obj.length > 2);

          this.setState({
            allChannels: channels
          })
        }).then(data => {
          if (callback) {
            callback();
          }
        })
      });
  }

  refreshVersoSheet(e) {
    e.preventDefault();

    fetch(`http://api.are.na/v2/channels/${this.state.versoChannel.slug}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          versoBlock: data.contents[Math.floor(Math.random() * data.contents.length)]
        }, () => {
          console.log(this.state.versoBlock)
        })
      })
  }

  refreshRectoSheet(e) {
    e.preventDefault();

    fetch(`http://api.are.na/v2/channels/${this.state.rectoChannel.slug}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          rectoBlock: data.contents[Math.floor(Math.random() * data.contents.length)]
        })
      })
  }

  submitVersoForm(e) {
    e.preventDefault();

    let chanParts = this.versoInput.value.split('/');
    let chan = chanParts.pop() || chanParts.pop();

    fetch(`http://api.are.na/v2/channels/${chan}`)
      .then(res => { return res.json(); })
      .then(data => {
        this.setState({
          versoChannel: data,
          versoBlock: data.contents[0]
        })
      })
  }

  submitRectoForm(e) {
    e.preventDefault();

    let chanParts = this.rectoInput.value.split('/');
    let chan = chanParts.pop() || chanParts.pop();

    fetch(`http://api.are.na/v2/channels/${chan}`)
      .then(res => { return res.json(); })
      .then(data => {
        this.setState({
          rectoChannel: data,
          rectoBlock: data.contents[0]
        })
      })
  }

  getRandomVersoChannel() {
    this.getNewChannels(() => {
      let versoChannel = this.state.allChannels[Math.floor(Math.random() * this.state.allChannels.length)];

      this.setState({
        versoChannel: versoChannel,
        versoBlock: versoChannel.contents[0]
      }, () => {
        this.versoInput.value = `http://are.na/${this.state.versoChannel.user.slug}/${this.state.versoChannel.slug}`
      })
    })
  }

  getRandomRectoChannel() {
    this.getNewChannels(() => {
      let rectoChannel = this.state.allChannels[Math.floor(Math.random() * this.state.allChannels.length)];

      this.setState({
        rectoChannel: rectoChannel,
        rectoBlock: rectoChannel.contents[0]
      }, () => {
        this.rectoInput.value = `http://are.na/${this.state.rectoChannel.user.slug}/${this.state.rectoChannel.slug}`
      })
    })
  }

  getRandomBothChannels() {
    this.getNewChannels(() => {
      let versoChannel = this.state.allChannels[Math.floor(Math.random() * this.state.allChannels.length)];
      let rectoChannel = this.state.allChannels[Math.floor(Math.random() * this.state.allChannels.length)];
      
      this.setState({
        versoChannel: versoChannel,
        versoBlock: versoChannel.contents[0],
        rectoChannel: rectoChannel,
        rectoBlock: rectoChannel.contents[0]
      }, () => {
        this.versoInput.value = `http://are.na/${this.state.versoChannel.user.slug}/${this.state.versoChannel.slug}`;
        this.rectoInput.value = `http://are.na/${this.state.rectoChannel.user.slug}/${this.state.rectoChannel.slug}`;
      })
    })
  }

  getChannel(channel) {
    return fetch(`http://api.are.na/v2/channels/${channel}`)
      .then(res => { return res.data })
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div className="App">
          <p>Loading…</p>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="form-container">
            <form onSubmit={this.submitVersoForm}>
              <button className="button-white button-refresh" onClick={this.refreshVersoSheet}>
                <svg width="22px" height="22px" viewBox="0 0 22 22">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="check-circle" transform="translate(11.000000, 11.000000) rotate(-315.000000) translate(-11.000000, -11.000000) translate(-3.000000, -3.000000)">
                      <path d="M24,13.08 L24,14 C23.9974678,18.4286859 21.082294,22.328213 16.8353524,23.583901 C12.5884109,24.839589 8.02139355,23.1523121 5.61095509,19.4370663 C3.20051662,15.7218205 3.52086345,10.863639 6.39827419,7.49707214 C9.27568494,4.13050531 14.0247126,3.05752528 18.07,4.86" id="Path" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(13.999972, 13.994426) rotate(-30.000000) translate(-13.999972, -13.994426) "></path>
                      <path d="M18.2402873,4.43412157 L12.7480695,7.57253173 C12.5083107,7.70953672 12.2028834,7.62623835 12.0658784,7.38647963 C12.0227077,7.31093078 12,7.22542363 12,7.13841016 L12,0.861589839 C12,0.585447464 12.2238576,0.361589839 12.5,0.361589839 C12.5870135,0.361589839 12.6725206,0.384297498 12.7480695,0.427468268 L18.2402873,3.56587843 C18.480046,3.70288341 18.5633443,4.00831075 18.4263394,4.24806947 C18.3820447,4.32558511 18.3178029,4.38982692 18.2402873,4.43412157 Z" id="Triangle" fill="#000000" fillRule="nonzero"></path>
                    </g>
                  </g>
                </svg>
              </button>
              <input
                type="text"
                name="versoChannel"
                id="versoChannel"
                defaultValue={`http://are.na/${this.state.versoChannel.user.slug}/${this.state.versoChannel.slug}`}
                ref={(input) => this.versoInput = input}
              />
              <input type="submit" name="versoSubmit" value="GO" />
              <RandomButton clickHandler={this.getRandomVersoChannel} />
            </form>
            <RandomButton center clickHandler={this.getRandomBothChannels} />
            <form onSubmit={this.submitRectoForm}>
              <button className="button-white button-refresh" onClick={this.refreshRectoSheet.bind(this)}>
                <svg width="22px" height="22px" viewBox="0 0 22 22">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="check-circle" transform="translate(11.000000, 11.000000) rotate(-315.000000) translate(-11.000000, -11.000000) translate(-3.000000, -3.000000)">
                      <path d="M24,13.08 L24,14 C23.9974678,18.4286859 21.082294,22.328213 16.8353524,23.583901 C12.5884109,24.839589 8.02139355,23.1523121 5.61095509,19.4370663 C3.20051662,15.7218205 3.52086345,10.863639 6.39827419,7.49707214 C9.27568494,4.13050531 14.0247126,3.05752528 18.07,4.86" id="Path" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(13.999972, 13.994426) rotate(-30.000000) translate(-13.999972, -13.994426) "></path>
                      <path d="M18.2402873,4.43412157 L12.7480695,7.57253173 C12.5083107,7.70953672 12.2028834,7.62623835 12.0658784,7.38647963 C12.0227077,7.31093078 12,7.22542363 12,7.13841016 L12,0.861589839 C12,0.585447464 12.2238576,0.361589839 12.5,0.361589839 C12.5870135,0.361589839 12.6725206,0.384297498 12.7480695,0.427468268 L18.2402873,3.56587843 C18.480046,3.70288341 18.5633443,4.00831075 18.4263394,4.24806947 C18.3820447,4.32558511 18.3178029,4.38982692 18.2402873,4.43412157 Z" id="Triangle" fill="#000000" fillRule="nonzero"></path>
                    </g>
                  </g>
                </svg>
              </button>
              <input
                type="text"
                name="rectoChannel"
                id="rectoChannel"
                defaultValue={`http://are.na/${this.state.rectoChannel.user.slug}/${this.state.rectoChannel.slug}`}
                ref={(input) => this.rectoInput = input}
              />
              <input type="submit" name="rectoSubmit" value="GO" />
              <RandomButton clickHandler={this.getRandomRectoChannel} />
            </form>
          </div>

          <Diptych 
            rectoChannel={this.state.rectoChannel}
            rectoBlock={this.state.rectoBlock}
            versoChannel={this.state.versoChannel}
            versoBlock={this.state.versoBlock}
          />
        </div>
      )
    }
  }
}

export default App;
