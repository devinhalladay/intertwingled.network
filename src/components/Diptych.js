import React, { Component } from 'react';

import Sheet from './Sheet';

export default class Diptych extends Component {
  render() {
    return (
      <div className="container">
        <Sheet 
          side="verso"
          channel={this.props.versoChannel} 
          block={this.props.versoBlock}
          loading={this.props.versoLoading}
        />
        <Sheet 
          side="recto"
          channel={this.props.rectoChannel} 
          block={this.props.rectoBlock} 
          loading={this.props.rectoLoading}
        />
      </div>
    )
  }
}