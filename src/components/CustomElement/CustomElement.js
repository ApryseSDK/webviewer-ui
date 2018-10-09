import React from 'react';
import PropTypes from 'prop-types';

class CustomElement extends React.PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired
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
    return (
      <div ref={this.elementWrapper}>
        {this.state.isRenderingReactComponent &&
          this.props.render()
        }
      </div>
    );
  }
}

export default CustomElement;