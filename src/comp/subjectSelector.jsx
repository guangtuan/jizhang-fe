import React from 'react';
import { connect } from 'react-redux';
import { propSatisfies, ifElse, map, defaultTo, prop, pick, compose, nthArg, find, propEq } from 'ramda';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

const display = subject => `${subject.name}(${subject.description})`;

const SubjectSelector = ({
  subjects,
  title,
  onChange,
  onClear = () => {},
  value,
  multiple = false
}) => {
  const getDefaultValue = ifElse(
    () => multiple,
    find(propSatisfies(prop('id'), id => value.contains(id))),
    find(propEq('id', value))
  );
  return (
    <Autocomplete
      disableCloseOnSelect={multiple}
      multiple={multiple}
      groupBy={prop('parent')}
      options={subjects.flatedChildren}
      getOptionLabel={display}
      onChange={
        multiple ?
          compose(onChange, map(prop('id')), defaultTo([]), nthArg(1)) :
          compose(onChange, prop('id'), defaultTo({ id: -1 }), nthArg(1))
      }
      defaultValue={getDefaultValue(subjects.flatedChildren)}
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
