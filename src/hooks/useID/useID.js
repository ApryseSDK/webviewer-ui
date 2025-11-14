import { useMemo } from 'react';
import getStringId from 'helpers/getStringId';

/**
 * @ignore
 * If an ID is not given, will generate and memoize an ID to use for a11y
 * or any other purpose.
 * @param id The optional ID provided by props.
 */
const useID = (id) => {
  return useMemo(() => id || getStringId('label'), [id]);
};

export default useID;