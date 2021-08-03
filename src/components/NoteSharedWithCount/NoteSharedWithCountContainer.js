import React from "react";
import PropTypes from 'prop-types';
import NoteSharedWithCount from "./NoteSharedWithCount";

const propTypes = {
  annotation: PropTypes.object,
};

function NoteSharedWithCountContainer(props) {
  return (
    <NoteSharedWithCount {...props}/>
  );
}

NoteSharedWithCountContainer.propTypes = propTypes;

export default NoteSharedWithCountContainer;