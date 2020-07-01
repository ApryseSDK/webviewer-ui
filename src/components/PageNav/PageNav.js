import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import selectors from 'selectors';
import { isIOS } from 'helpers/device';
import ActionButton from 'components/ActionButton';

import './PageNav.scss';

class PageNav extends React.PureComponent {
  static propTypes = {
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageLabels: PropTypes.array.isRequired,
    allowPageNavigation: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: '',
      isCustomPageLabels: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pageLabels !== this.props.pageLabels) {
      const isCustomPageLabels = this.props.pageLabels.some((label, index) => label !== `${index + 1}`);
      this.setState({ isCustomPageLabels });
    }

    if (prevProps.currentPage !== this.props.currentPage || prevProps.pageLabels !== this.props.pageLabels) {
      this.setState({ input: this.props.pageLabels[this.props.currentPage - 1] });
    }

    if (prevProps.totalPages !== this.props.totalPages) {
      this.setInputWidth();
    }
  }

  setInputWidth = () => {
    this.textInput.current.style.width = `${this.props.totalPages.toString().length * 11.5}px`;
  }

  onClick = () => {
    if (isIOS) {
      setTimeout(() => {
        this.textInput.current.setSelectionRange(0, 9999);
      }, 0);
    } else {
      this.textInput.current.select();
    }
  }

  onChange = e => {
    if (e.target.value.length > this.props.totalPages.toString().length) {
      return;
    }

    this.setState({ input: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const { input } = this.state;
    const isValidInput = input === '' || this.props.pageLabels.includes(input);

    if (isValidInput) {
      const pageToGo = this.props.pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      this.textInput.current.blur();
    }
  }

  onBlur = () => {
    const { currentPage, pageLabels } = this.props;

    this.setState({ input: pageLabels[currentPage - 1] });
  }

  render() {
    const { currentPage, totalPages, allowPageNavigation } = this.props;

    const className = getClassName(`PageNav`, this.props);

    return (
      <div className={className} data-element="pageNav" onClick={this.onClick}>
        <ActionButton
          dataElement="prevPageButton"
          title="action.prevPage"
          img="ic_chevron_left_black_24px"
          onClick={() =>
            core.setCurrentPage(
              Math.max(currentPage - 1, 1),
            )}
        />
        <form onSubmit={this.onSubmit} onBlur={this.onBlur}>
          <input ref={this.textInput} disabled={!allowPageNavigation} type="text" value={this.state.input} onChange={this.onChange} tabIndex={-1} />
          {this.state.isCustomPageLabels
            ? ` (${currentPage}/${totalPages})`
            : ` / ${totalPages}`
          }
        </form>
        <ActionButton
          dataElement="nextPageButton"
          title="action.nextPage"
          img="ic_chevron_right_black_24px"
          onClick={() =>
            core.setCurrentPage(
              Math.min(
                currentPage + 1,
                totalPages,
              ),
            )
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  totalPages: selectors.getTotalPages(state),
  pageLabels: selectors.getPageLabels(state),
  allowPageNavigation: selectors.getAllowPageNavigation(state),
});

export default connect(mapStateToProps)(PageNav);