import React from 'react';

import {
    Dialog,
    Slide,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

import DetailTable from './detailTable';
import { KEY_MAP, OPT } from './detailDefine';

import { prop, sortWith, descend } from 'ramda';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Today({
    dateStr,
    show,
    details,
    onClickClose = () => { },
}) {

    return <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        TransitionComponent={Transition}
        open={show}
    >
        <DialogTitle id="today-dialog-title">{dateStr}</DialogTitle>
        <DialogContent>
            <DetailTable
                opts={[OPT.COPY, OPT.EDIT]}
                details={sortWith([descend(prop('amount'))])(details)}
                properties={[KEY_MAP.USERNAME, KEY_MAP.SUBJECT, KEY_MAP.SRC_ACCOUNT, KEY_MAP.DEST_ACCOUNT, KEY_MAP.REMARK, KEY_MAP.AMOUNT]}
            ></DetailTable>
        </DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={onClickClose}>关闭</Button>
        </DialogActions>
    </Dialog>

}