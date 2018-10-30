import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import selectors from 'selectors';

class CustomElement extends React.PureComponent {
  static propTypes = {
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

  isDOMElement = element => element instanceof Element;

  isReactElement = element => React.isValidElement(element);
  
  render() {
    const { isDisabled, dataElement, display } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div 
        className={dataElement}
        ref={this.elementWrapper} 
        style={{ display: display || 'flex' }} 
        data-element={dataElement}
      >
        {this.state.isRenderingReactComponent &&
          this.props.render()
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
});

export default connect(mapStateToProps)(CustomElement);