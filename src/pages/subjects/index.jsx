import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import * as R from 'ramda';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';

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
  }
}));

function Subjects({
                    subjects,
                    loadSubjects
                  }) {

  const classes = useStyles();

  useEffect(() => {
    loadSubjects();
  }, []);

  const columns = [
    {
      label: '',
      arrow: true
    },
    {
      label: '名字',
      prop: 'name',
    },
    {
      label: '描述',
      prop: 'description',
    }
  ];

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  const Row = ({subject}) => {
    const innerColumns = [
      {
        label: '名字',
        prop: 'name',
      },
      {
        label: '描述',
        prop: 'description',
      }
    ];
    const classes = useRowStyles();
    const [open, setOpen] = React.useState(false);
    const renderArrow = () => {
      return <TableCell key={subject.id}>
        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
      </TableCell>
    };
    return <React.Fragment>
      <TableRow className={classes.root}>
        {
          columns.map((col, index) => {
            if (col.arrow) {
              return renderArrow();
            }
            if (col.render) {
              return col.render(subject)
            }
            return <TableCell key={col.prop + index}>{R.prop(col.prop)(subject)}</TableCell>
          })
        }
      </TableRow>
      <TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                子类
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {
                      innerColumns.map((innerColumn, index) => {
                        return <TableCell key={innerColumn.label}>{innerColumn.label}</TableCell>
                      })
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subject.children.map((child) => (
                    <TableRow key={child.id}>
                      {
                        innerColumns.map((innerColumn, index) => {
                          let display = R.prop(innerColumn.prop)(child);
                          return <TableCell key={child.id + display}>{display}</TableCell>
                        })
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  }

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table stickyHeader className={classes.table}>
        <TableHead>
          <TableRow>
            {columns.map(R.prop('label')).map((label) => {
              return <TableCell key={label}>{label}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.list.map(subject => {
            return <Row subject={subject} key={subject.id}/>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

};

const mapState = R.pick(["subjects", "subjectCreation"]);

const mapDispatch = dispatch => ({
  loadSubjects: dispatch.subjects.load
});

export default connect(mapState, mapDispatch)(Subjects);