import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';

import './Outline.scss';

class Outline extends React.PureComponent {
  static propTypes = {
    outline: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired
  }

  state = {
    isExpanded: false
  }

  onClickExpand = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  onClickOutline = () => {
    const { outline, closeElement } = this.props;

    core.goToOutline(outline);
    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  render() {
    const { outline, isVisible, closeElement } = this.props;
    const { isExpanded } = this.state;
    
    return (
      <div className={`Outline ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="padding">
          {(outline.children.length > 0) &&
            <div className={`arrow ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={this.onClickExpand}>
              <Icon glyph="ic_chevron_right_black_24px" />
            </div>
          }
        </div>
        <div className="content">
          <div className="title" onClick={this.onClickOutline}>
            {outline.name}
          </div>
          {outline.children.map((outline, i) => (
            <Outline outline={outline} key={i} isVisible={isExpanded} closeElement={closeElement} />
          ))}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(null, mapDispatchToProps)(Outline);