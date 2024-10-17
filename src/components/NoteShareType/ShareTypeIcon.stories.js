import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import ShareTypes from 'src/constants/shareTypes';
import ShareTypeIcon from './ShareTypeIcon';

export default {
  title: 'WISEflow/ShareTypeIcon',
  component: ShareTypeIcon,
  argTypes: {
    shareType: {
      control: 'select',
      options: [undefined, ShareTypes.PARTICIPANTS, ShareTypes.NONE, ShareTypes.ASSESSORS, ShareTypes.ALL],
    },
  },
};

export function Basic({ shareType }) {
  return (
    <div>
      <p>Use controls below to change the share type</p>
      <ReduxProvider store={createStore((state = {}) => state)}>
        <ShareTypeIcon shareType={shareType} />
      </ReduxProvider>
    </div>
  );
}
