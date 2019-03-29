import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

export default class Sheet extends Component {
  render() {
    let channel = this.props.channel;
    let block = this.props.block;

    let blockRepresentation;

    if (block.class === 'Image' && block.image) {
      blockRepresentation = (
        <div className="block block--image">
          <img src={block.image.original.url} alt="" />
        </div>
      )
    } else if (block.class === 'Text') {
      blockRepresentation = (
        <div className="block block--text">
          {ReactHtmlParser(block.content_html)}
        </div>
      )
    } else if (block.class === 'Link' && block.source) {
      blockRepresentation = (
        <div className="block block--link">
          <a href={block.source.url} target="_blank" rel="noopener noreferrer">
            <div className="block--link__thumbnail">
              <img src={block.image.display.url} alt="" />
              <p>{block.generated_title}</p>
            </div>
          </a>
        </div>
      )
    } else if (block.class === 'Attachment' && block.attachment) {
      blockRepresentation = (
        <div className="block block--attachment">
          <a href={block.attachment.url} target="_blank" rel="noopener noreferrer">
            <div className="block--attachment__thumnbail">
              <img src={block.image ? block.image.display.url : ''} alt="" />
              <p>{block.generated_title}</p>
            </div>
          </a>
        </div>
      )
    } else if (block.class === 'Media' && block.embed) {
      blockRepresentation = (
        <div className="block block--media">
          {ReactHtmlParser(block.embed.html)}
        </div>
      )
    } else if (block.class === 'Channel') {
      blockRepresentation = (
        <div className={`block block--channel ${block.open ? 'open' : ''}`}>
          <a target="_blank" rel="noopener noreferrer" href={`http://are.na/${block.user_id}/${block.slug}`}>
            <p>{block.title}</p>
            {/* <small>{block.user.full_name}</small> */}
            <small>{block.length} Blocks</small>
          </a>
        </div>
      )
    }

    return (
      <React.Fragment>
        <div className={this.props.side}>
          {blockRepresentation}
        </div>

        <div className={this.props.side === "verso" ? "utility-button-container left" : "utility-button-container right"}>
          <a className="visit-button button-white" target="_blank" rel="noopener noreferrer" href={`http://are.na/${channel.slug}/${channel.slug}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            Visit Channel
          </a>
        </div>
      </React.Fragment>
    )
  }
}