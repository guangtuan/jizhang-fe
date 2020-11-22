import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const emptyItem = () => ({
  id: undefined,
  name: '清空',
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function UserSelector({
  users,
  title,
  onChange,
  value,
  multiple
}) {
  const toSelect = R.concat([emptyItem()], users.content);
  const toSelectItem = (user) => <MenuItem key={title + user.id} value={user.id}>{user.nickname}</MenuItem>;
  return (
    <React.Fragment>
      <InputLabel>{title}</InputLabel>
      <Select
        multiple={!!multiple}
        MenuProps={MenuProps}
        value={value}
        onChange={(event) => {
          const val = event.target.value;
          if (!multiple) {
            onChange(val);
            return;
          }
          if (val.some((id) => id === undefined)) {
            onChange([]);
            return;
          }
          onChange(val);
        }}>
        {toSelect.map(toSelectItem)}
      </Select>
    </React.Fragment>
  );
}

const mapState = R.pick(['users']);

export default connect(mapState)(UserSelector);
