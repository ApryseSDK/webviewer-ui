import React from 'react';
import ListSeparator from './ListSeparator';


export default {
  title: 'Components/ListSeparator',
  component: ListSeparator,
};

export function Basic() {
  function renderContent() {
    return 'Separator with renderContent';
  }
  return (
    <div>
      <h4>Separator with children</h4>
      <ListSeparator>
        <div>I&apos;m separator</div>
      </ListSeparator>
      <h4>Separator with renderContent()</h4>
      <ListSeparator renderContent={renderContent}/>
    </div>

  );
}
