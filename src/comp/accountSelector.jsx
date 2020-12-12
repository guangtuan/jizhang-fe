import React from 'react';
import { connect } from 'react-redux';
import {
  prop,
  find,
  propEq,
  map,
  defaultTo,
  pick,
  compose,
  nthArg
} from 'ramda';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

function AccountSelector({
  accounts,
  title,
  onChange,
  value,
  multiple
}) {

  return <Autocomplete
    multiple={multiple}
    disableCloseOnSelect={multiple}
    defaultValue={find(propEq('id', value))(accounts)}
    options={accounts}
    getOptionLabel={prop('name')}
    onChange={
      multiple ?
        compose(onChange, map(prop('id')), defaultTo([]), nthArg(1)) :
        compose(onChange, prop('id'), nthArg(1))
    }
    renderInput={(params) => (
      <TextField
        {...params}
        variant="standard"
        label={title}
        placeholder={title}
      />
    )}
  />
}

const mapState = pick(['accounts']);

export default connect(mapState)(AccountSelector);
