import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography } from '@material-ui/core';
import Controls from "./controls/Controls";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        // position: 'absolute',
        // top: theme.spacing(5),
        borderRadius: 20
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup, param} = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" className={`${param ? "conT" : ''} m-2 md:m-10 mt-24 p-2 md:p-10 rounded-2xl`} classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Controls.ActionButton
                        color="primary"
                        onClick={()=>{setOpenPopup(false)}}
                    >
                        <CloseIcon color='primary' />
                    </Controls.ActionButton>
                </div>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
