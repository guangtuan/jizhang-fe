import { makeStyles } from '@material-ui/core/styles';
import {
  Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Fab, Box
} from '@material-ui/core';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import JizhangSelector from '../../comp/jizhangSelector';
import SubjectEdit from './subjectEdit';

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
  opt: {
    margin: theme.spacing(1),
  },
}));

function Subjects({
  subjects,
  loadSubjects,
  showCreateDialog,
  changeProperty,
  clearForm
}) {

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const classes = useStyles();
  const [level, setLevel] = useState(LEVEL_1);
  const [parentId, setParentId] = useState(undefined);
  const [firstLevel, setFirstLevel] = useState([]);

  const load = async () => {
    loadSubjects({ level, parentId });
  }

  const initFirstLevel = async () => {
    const firstLevel = await loadSubjects({ level: 1 });
    setFirstLevel(firstLevel);
  }

  useEffect(() => {
    if (level === LEVEL_1) {
      setParentId(undefined);
    }
  }, [level]);

  useEffect(() => {
    initFirstLevel();
  }, []);

  useEffect(() => {
    load();
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
      render: ({ subject, colIndex, rowIndex }) => {
        const key = `subject-opt-${rowIndex}-${colIndex}`;
        return <TableCell key={key}>
          <Box>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={() => {
                changeProperty({ key: 'parentId', val: subject.id });
                changeProperty({ key: 'level', val: 2 });
                showCreateDialog();
              }}
            >添加子类</Button>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<VisibilityIcon />}
              variant="contained"
              onClick={() => {
                setLevel(LEVEL_2);
                setParentId(subject.id);
                load();
              }}
            >查看子类</Button>
          </Box>
        </TableCell>;
      },
    },
  ];

  const level2Columns = [
    {
      label: '序号',
      render: (subject, rowNumber, colNumber) => {
        return <TableCell key={`${subject.id}-${rowNumber}-${colNumber}`}>{rowNumber}</TableCell>;
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
      render: ({ subject, rowNumber, colNumber }) => {
        return <TableCell key={`${subject.id}-${rowNumber}-${colNumber}`}>
          <Box>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              onClick={() => {
              }}
            >编辑</Button>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<DeleteIcon />}
              variant="contained"
              color="secondary"
              onClick={async () => {
              }}
            >删除</Button>
          </Box>
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
        state={[
          { name: '大类', id: LEVEL_1, },
          { name: '子类', id: LEVEL_2, }
        ]}
        title={'请选择类别等级'}
        onChange={setLevel}
        value={level}
        multiple={false}
      />
      {
        (() => {
          if (level == LEVEL_2) {
            return <JizhangSelector
              clearable={true}
              state={firstLevel}
              title={'请选择大类'}
              onChange={setParentId}
              value={parentId}
              multiple={false}
            />
          }
        })(level)
      }
      <TableContainer className={classes.container} component={Paper}>
        <Table size="small" stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              {columns(level).map(R.prop('label')).map((label) => {
                return <TableCell key={`table-header-${label}`}>{label}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.display.map((subject, rowNumber) => {
              return <TableRow key={subject.id}>
                {
                  columns(level).map((col, colNumber) => {
                    if (col.render) {
                      return col.render({ subject, rowNumber, colNumber });
                    }
                    return <TableCell key={`${col.prop}-${rowNumber}-${colNumber}`}>
                      {R.prop(col.prop)(subject)}
                    </TableCell>;
                  })
                }
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <SubjectEdit
        firstLevel={firstLevel}
        onSubjcetCreate={load} />
      <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={() => {
        changeProperty({ key: "parentId", val: parentId });
        showCreateDialog();
      }}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

const mapState = R.pick(["subjects"]);

const mapDispatch = dispatch => ({
  loadSubjects: dispatch.subjects.loadByLevel,
  showCreateDialog: dispatch.subjects.showDialog,
  changeProperty: dispatch.subjects.changeProperty,
  setForm: dispatch.subjects.setForm,
  clearForm: dispatch.subjects.clearForm,
});

export default connect(mapState, mapDispatch)(Subjects);