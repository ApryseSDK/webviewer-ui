// CUSTOM WISEFLOW sharetype types.
const ShareTypes = {
  ALL: 'ALL',
  ASSESSORS: 'ASSESSORS',
  PARTICIPANTS: 'PARTICIPANTS',
  NONE: 'NONE',
};

// CUSTOM WISEFLOW sharetype order for sorting strategy.
export const ShareTypeOrder = {
  ALL: 0,
  ASSESSORS: 1,
  PARTICIPANTS: 2,
  NONE: 3,
};

// this colors are taken from flow-ui-react secondry light colors
export const ShareTypeColors = {
  [ShareTypes.ALL]: '#7ec171',
  [ShareTypes.ASSESSORS]: '#b49b88',
  [ShareTypes.PARTICIPANTS]: '#719ec1',
  [ShareTypes.NONE]: '#b2b3b3',
};

export default ShareTypes;
