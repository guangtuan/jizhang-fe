import {Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as R from 'ramda';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import JizhangSelector from '../../comp/jizhangSelector';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 600,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  opt: {
    margin: theme.spacing(1),
  },
}));

function Subjects({
                    subjects,
                    loadSubjects
                  }) {

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const classes = useStyles();
  const [level, setLevel] = useState(LEVEL_2);
  const [parentId, setParentId] = useState(undefined);

  useEffect(() => {
    loadSubjects({level, parentId});
  }, [level, parentId]);

  const level1Columns = [
    {
      label: '',
      arrow: true,
    },
    {
      label: '名字',
      prop: 'name',
    },
    {
      label: '描述',
      prop: 'description',
    },
    {
      label: '操作',
      render: () => {
        return <TableCell>
          <Button>
            添加子类
          </Button>
        </TableCell>;
      },
    },
  ];

  const level2Columns = [
    {
      label: '序号',
      render: (subject, rowNumber, colNumber) => {
        return <TableCell key={`${rowNumber}-${colNumber}`}>{rowNumber}</TableCell>;
      },
    },
    {
      label: '名字',
      prop: 'name',
    },
    {
      label: '描述',
      prop: 'description',
    },
    {
      label: '操作',
      render: (subject, rowNumber, colNumber) => {
        return <TableCell key={`${rowNumber}-${colNumber}`}>
          <div>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<EditIcon/>}
              variant="contained"
              color="primary"
              onClick={() => {
              }}
            >编辑</Button>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<DeleteIcon/>}
              variant="contained"
              color="secondary"
              onClick={async () => {
              }}
            >删除</Button>
          </div>
        </TableCell>;
      },
    },
  ];

  const columns = (level) => {
    if (level === 1) {
      return level1Columns;
    } else {
      return level2Columns;
    }
  };

  return (
    <React.Fragment>
      <JizhangSelector
        clearable={false}
        state={[{
          name: LEVEL_1,
          id: LEVEL_1,
        }, {
          name: LEVEL_2,
          id: LEVEL_2,
        }]}
        title={'请选择等级'}
        onChange={setLevel}
        value={level}
        multiple={false}
      />
      <TableContainer className={classes.container} component={Paper}>
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              {columns(level).map(R.prop('label')).map((label) => {
                return <TableCell key={label}>{label}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.display.map((subject, rowNumber) => {
              return <TableRow className={classes.root} key={subject.id}>
                {
                  columns(level).map((col, colNumber) => {
                    if (col.render) {
                      return col.render(subject, rowNumber + 1, colNumber);
                    }
                    return <TableCell key={col.prop + colNumber}>
                      {R.prop(col.prop)(subject)}
                    </TableCell>;
                  })
                }
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

const mapState = R.pick(["subjects"]);

const mapDispatch = dispatch => ({
  loadSubjects: dispatch.subjects.loadByLevel,
});

export default connect(mapState, mapDispatch)(Subjects);