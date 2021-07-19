import React from "react";
import PropTypes from 'prop-types';
import NoteAccessState from "./NoteAccessState";

const propTypes = {
  annotation: PropTypes.object,
};

function NoteAccessStateContainer(props) {
  return (
    <NoteAccessState {...props}/>
  );
}

NoteAccessStateContainer.propTypes = propTypes;

export default NoteAccessStateContainer;