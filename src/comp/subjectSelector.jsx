import React from 'react';
import { connect } from 'react-redux';
import { propSatisfies, concat, map, defaultTo, prop, pick, compose, nthArg, find, propEq } from 'ramda';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

const SubjectSelector = ({
  subjects,
  title,
  onChange,
  value,
  multiple = false
}) => {
  const convert = (subjects) => subjects.reduce((acc, curr) => concat(acc, curr.children.map(child => {
    child.parent = curr.name;
    return child;
  })), []);
  return (
    <Autocomplete
      disableCloseOnSelect
      multiple={multiple}
      groupBy={(option) => option.parent}
      options={convert(subjects.list)}
      getOptionLabel={prop('name')}
      onChange={
        multiple ?
          compose(onChange, map(prop('id')), defaultTo([]), nthArg(1)) :
          compose(onChange, prop('id'), defaultTo({ id: -1 }), nthArg(1))
      }
      defaultValue={
        multiple ?
          find(propEq('id', value))(subjects) :
          find(propSatisfies('id', id => value.contains(id)))(subjects)
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
