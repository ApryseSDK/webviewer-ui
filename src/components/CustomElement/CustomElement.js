import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import selectors from 'selectors';

import './CustomElement.scss';

class CustomElement extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isDisabled: PropTypes.bool, 
    dataElement: PropTypes.string,
    display: PropTypes.string,
    render: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.elementWrapper = React.createRef();
    this.state = {
      isRenderingReactComponent: null
    };
  }

  componentDidMount() {
    const element = this.props.render();

    if (this.isDOMElement(element)) {
      this.elementWrapper.current.appendChild(element);
    } else if (this.isReactElement(element)) {
      this.setState({ isRenderingReactComponent: true });    
    } else {
      console.warn('The object returned by the render function does not seem to be either a DOM element or a React Component');
    }
  }

  // currently UI is running in an iframe, and there are two ways a user can add a CustomElement component to the header using setHeaderItems. 
  // one way is in a config file. This way the element created by document.createElement() is an instanceof window.Element but not window.parent.Element since 
  // code inside the config is running inside the iframe and window.parent is the iframe
  // the other way is calling setHeaderItems and creating elements outside the iframe. This way the element is an instanceof window.parent.Element, not window.Element
  isDOMElement = element => element instanceof window.Element || element instanceof window.parent.Element;

  isReactElement = element => React.isValidElement(element);
  
  render() {
    const { 
      className = 'CustomElement', 
      isDisabled, 
      dataElement, 
      display,
      render,
      mediaQueryClassName
    } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div 
        className={[className, mediaQueryClassName].join(' ').trim()}
        ref={this.elementWrapper} 
        data-element={dataElement}
      >
        {this.state.isRenderingReactComponent &&
          render()
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
});

export default connect(mapStateToProps)(CustomElement);