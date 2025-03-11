import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";

export function useForm2(initialFValues, validateOnChange = false, validate) {


    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target
        console.log(value)
        console.log(name)
        setValues({
            ...values,
            [name]: value
        })
        if (validateOnChange)
            validate({ [name]: value })
    }

    const handleAutoComplete = (nom, value) => {
        
        if (nom == 'colones') {
            const tValue = value.filter((v)=> v != 'Aucun');
            setValues({
                ...values,
                [nom]: tValue.length > 0 ? tValue : ['Aucun']
            })
        }else if (nom == 'n1') {
            setValues({
                ...values,
                [nom]: value != null && value != '' && value.nom != null ? value : {nom: '', ordre: 0}
            })
            // console.warn(value)
        }else if (nom == 'emailRecept') {
            setValues({
                ...values,
                [nom]: value == true ? 'oui' : 'non'
            })
            // console.warn(value)
        }else{
            setValues({
                ...values,
                [nom]: value
            });
        }
        
        // if (validateOnChange)
        //     validate({ ['projet']: value })
    }

    const val = ()=>{
       return (parseInt(localStorage.getItem('Tordre')) + 1).toString()
    }

    const resetForm = () => {
        // console.log(initialFValues)
        setValues({
            ...values,
            ['ordre']: val()
        })
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
        handleAutoComplete
    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form2(props) {

    const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form className={classes.root} autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}

