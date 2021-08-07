import React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import zhCN from 'date-fns/locale/zh-CN'

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'

export default function JizhangDateSelector ({
    label,
    value,
    setValue,
}) {
    return <MuiPickersUtilsProvider locale={zhCN} utils={DateFnsUtils}>
        <KeyboardDatePicker
            label={label}
            onChange={setValue}
            value={value}
        />
    </MuiPickersUtilsProvider>
}
