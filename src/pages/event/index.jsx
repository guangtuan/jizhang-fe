import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import AddIcon from '@material-ui/icons/Add';
import dayjs from 'dayjs';
import { clone, prop, pick } from 'ramda';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DynamicFormDialog from '../../comp/dynamicFormDialog';

const defaultForm = () => {
    return {}
};

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    container: {
        maxHeight: 700,
    },
    opt: {
        margin: theme.spacing(1),
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Event({
    loadEvent,
    createEvent,
    event
}) {
    const classes = useStyles();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [form, setForm] = useState(defaultForm());

    const init = async () => {
        loadEvent();
    }

    const columns = [
        {
            label: '名称',
            render: function ({ name }) {
                return (<TableCell>{name}</TableCell>);
            },
        },
        {
            label: '创建时间',
            render: ({ createdAt }) => {
                if (!createdAt) {
                    return <TableCell />;
                }
                return (<TableCell>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>);
            },
        }
    ];

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <Paper>
                <TableContainer className={classes.container} component={Paper}>
                    <Table stickyHeader className={classes.table} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                {columns.map(prop('label')).map((item) => {
                                    return (<TableCell key={item}>{item}</TableCell>);
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (event.content || []).map((account) => {
                                    return <TableRow>{
                                        columns.map((col) => {
                                            if (col.render) {
                                                return col.render(account);
                                            } else {
                                                return <TableCell>{prop(col.prop)(account)}</TableCell>;
                                            }
                                        })
                                    }</TableRow>;
                                },
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={
                () => setShowCreateDialog(true)
            }>
                <AddIcon />
            </Fab>

            <DynamicFormDialog
                title={"添加事件"}
                ifOpen={showCreateDialog}
                forms={[
                    {
                        type: DynamicFormDialog.FORM_TYPE.TEXT,
                        key: 'name',
                        label: '名称',
                    }
                ]}
                formData={form}
                onClickCancel={() => { setShowCreateDialog(false) }}
                onClickOK={async () => {
                    setShowCreateDialog(false);
                    const data = clone(form)
                    await createEvent(data);
                    setForm(defaultForm());
                    await init();
                }}
            ></DynamicFormDialog>
        </div>
    );
};

const mapState = pick([
    'event'
]);

const mapDispatch = (dispatch) => ({
    createEvent: dispatch.event.create,
    loadEvent: dispatch.event.load,
});

export default connect(mapState, mapDispatch)(Event);
