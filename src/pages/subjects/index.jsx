import { makeStyles } from '@material-ui/core/styles';
import {
  Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Fab, Box, Collapse, Chip
} from '@material-ui/core';
import { prop, pick } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SubjectEdit from './subjectEdit';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    padding: theme.spacing(1),
  },
  childrenContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  children: {
    margin: theme.spacing(0.5),
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
  showCreateDialog,
  showEditingDialog,
  changeProperty,
  loadSubjects,
  delSubject
}) {

  const classes = useStyles();

  const columns = [
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
                changeProperty({ key: "parentId", val: subject.id });
                changeProperty({ key: "parentName", val: subject.name });
                showCreateDialog();
              }}
            >添加子类</Button>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              onClick={() => {
                changeProperty({ key: "parentId", val: undefined });
                changeProperty({ key: "parentName", val: undefined });
                changeProperty({ key: "id", val: subject.id });
                changeProperty({ key: "name", val: subject.name });
                changeProperty({ key: "description", val: subject.name });
                showEditingDialog();
              }}
            >修改大类</Button>
            <Button
              className={classes.opt}
              size="small"
              startIcon={<DeleteIcon />}
              variant="contained"
              color="secondary"
              onClick={async () => {
                delSubject(subject.id).then(ret => {
                  console.log(ret);
                  loadSubjects();
                }).catch(err => {
                  console.log(err);
                });
              }}
            >删除大类</Button>
          </Box>
        </TableCell>;
      },
    },
  ];

  function Row({
    subject,
    rowNumber
  }) {
    return <>
      <TableRow key={subject.id}>
        {
          columns.map((col, colNumber) => {
            if (col.render) {
              return col.render({ subject, rowNumber, colNumber });
            }
            return <TableCell key={`${col.prop}-${rowNumber}-${colNumber}`}>
              {prop(col.prop)(subject)}
            </TableCell>;
          })
        }
      </TableRow>
      <TableRow key={`children-${subject.id}`}>
        <TableCell colSpan={3}>
          <Collapse in={true} timeout="auto" unmountOnExit>
            <Box className={classes.childrenContainer}>
              {
                subject.children.map(
                  child => <Chip
                    className={classes.children}
                    key={`children-chip-${child.id}`}
                    label={child.name}
                    onDelete={() => {
                      delSubject(child.id).then(ret => {
                        console.log(ret);
                        loadSubjects();
                      }).catch(err => {
                        console.log(err);
                      });
                    }}
                    onClick={() => {
                      changeProperty({ key: "parentId", val: child.parentId });
                      changeProperty({ key: "parentName", val: child.parent });
                      changeProperty({ key: "id", val: child.id });
                      changeProperty({ key: "name", val: child.name });
                      changeProperty({ key: "description", val: child.description });
                      showEditingDialog();
                    }}
                  ></Chip>
                )
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>;
  }

  return (
    <React.Fragment>
      <TableContainer className={classes.container} component={Paper}>
        <Table size="small" stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(prop('label')).map((label) => {
                return <TableCell key={`table-header-${label}`}>{label}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.subjectTree.map((subject, rowNumber) => <Row
              subject={subject}
              rowNumber={rowNumber}
            ></Row>)}
          </TableBody>
        </Table>
      </TableContainer>
      <SubjectEdit onSave={loadSubjects} />
      <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={() => {
        changeProperty({ key: "parentId", val: undefined });
        changeProperty({ key: "parentName", val: undefined });
        showCreateDialog();
      }}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

const mapState = pick(["subjects"]);

const mapDispatch = dispatch => ({
  loadSubjects: dispatch.subjects.load,
  delSubject: dispatch.subjects.del,
  showCreateDialog: dispatch.subjects.showCreateDialog,
  showEditingDialog: dispatch.subjects.showEditingDialog,
  hideDialog: dispatch.subjects.hideDialog,
  changeProperty: dispatch.subjects.changeProperty,
  setForm: dispatch.subjects.setForm,
});

export default connect(mapState, mapDispatch)(Subjects);