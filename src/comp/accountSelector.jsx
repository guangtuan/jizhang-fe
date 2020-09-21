import createSelector from './SelectorCreator';
import * as R from 'ramda';

export default createSelector({
    display: R.prop('name'),
    id: R.prop('id'),
    clearable: true,
    stateKey: "accounts"
});