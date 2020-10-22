import React from 'react';
import {connect} from 'react-redux';
import * as R from 'ramda';
import {prop} from 'ramda';

import {makeStyles} from '@material-ui/core/styles';

import {Autocomplete} from '@material-ui/lab';
import {TextField} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
    maxWidth: 240,
  },
}));

const SubjectSelector = ({
                           subjects,
                           title,
                           onChange,
                           value,
                           multiple = false,
                         }) => {
  const classes = useStyles();
  const convert = (subjects) => subjects.reduce((acc, curr) => R.concat(acc, curr.children.map(child => {
    child.parent = curr.name;
    return child;
  })), []);
  return (
    <FormControl className={classes.formControl}>
      <Autocomplete
        disableCloseOnSelect
        multiple={multiple}
        id="tags-standard"
        groupBy={(option) => option.parent}
        options={convert(subjects.list)}
        getOptionLabel={prop('name')}
        onChange={(event, newValue) => {
          onChange(R.map(R.prop('id'))(newValue));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={title}
            placeholder={title}
          />
        )}
      />
    </FormControl>
  );
};

const mapState = R.pick(['subjects']);

export default connect(mapState)(SubjectSelector);
