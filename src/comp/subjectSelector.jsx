import React from 'react';
import { connect } from 'react-redux';
import {
  flip,
  includes,
  ifElse,
  map,
  prop,
  pick,
  compose,
  nthArg,
  find,
  propEq,
  defaultTo,
  filter
} from 'ramda';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { subjectLevel } from '../core/def';

const display = subject => `${subject.name}(${subject.description})`;

const SubjectSelector = ({
  level = subjectLevel.SMALL,
  subjects,
  title,
  onChange,
  value,
  multiple = false
}) => {

  const range = {
    [subjectLevel.SMALL]: subjects.flatedChildren,
    [subjectLevel.BIG]: subjects.justParents
  };

  const getDefaultValue = ifElse(
    () => multiple,
    filter(compose(flip(includes)(value), prop('id'))),
    find(propEq('id', value))
  );
  return (
    <Autocomplete
      multiple={multiple}
      disableCloseOnSelect={multiple}
      defaultValue={getDefaultValue(range[level])}
      options={range[level]}
      groupBy={prop('parent')}
      getOptionLabel={display}
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
  );
};

const mapState = pick(['subjects']);

export default connect(mapState)(SubjectSelector);
