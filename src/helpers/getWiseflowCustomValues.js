// CUSTOM WISEFLOW VALUES
import getCustomData from 'src/apis/getCustomData';
import ShareTypes from 'src/constants/shareTypes';

/**
 * @returns {{
 *  defaultShareType: string,
 * }}
 */
const getWiseflowCustomValues = () => {
  return {
    // Defaults
    defaultShareType: ShareTypes.NONE,
    ...JSON.parse(getCustomData())
  };
};

export default getWiseflowCustomValues;
