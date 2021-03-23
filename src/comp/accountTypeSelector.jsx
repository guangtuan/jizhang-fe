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

function AccountTypeSelector({
    accountTypeDefine,
    title,
    onChange,
    value,
    multiple
}) {

    return <Autocomplete
        multiple={multiple}
        disableCloseOnSelect={multiple}
        defaultValue={find(propEq('value', value))(accountTypeDefine)}
        options={accountTypeDefine}
        getOptionLabel={prop('name')}
        onChange={
            multiple ?
                compose(onChange, map(prop('value')), defaultTo([]), nthArg(1)) :
                compose(onChange, prop('value'), nthArg(1))
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

const mapState = pick(['accountTypeDefine']);

export default connect(mapState)(AccountTypeSelector);