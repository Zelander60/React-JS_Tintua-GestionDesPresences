import React, { useState, useEffect } from 'react'
import { FormControl, FormControlLabel, FormLabel, Grid, Switch, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import * as employeeService from "../../services/employeeService";
import usePost from '../../hooks/usePost';
import QRCode from 'qrcode';
import redZone from '../../data/redZone.png';
import { useReactToPrint } from 'react-to-print';
import { BsPrinterFill } from "react-icons/bs";
import { useStateContext } from '../../contexts/ContextProvider';
import { QrImg } from './QrImg';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { loadCldr} from '@syncfusion/ej2-base';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';


const initialFValues = {
    email: 'vide@gmail.com',
    password: '',
    // projet: ['Aucun'],
    // n1: { ordre: 0, nom: "" },
    // departement: 'Pas de département',
    contrat_deb: "",
    contrat_fin: "",
    // hireDate: new Date(),
}

export default function UserParamsForm(props) {
    const { dataEdit, recordForEdit, id, close } = props

    loadCldr(
        require('cldr-data/supplemental/numberingSystems.json'),
        require('cldr-data/main/fr-CH/ca-gregorian.json'),
        require('cldr-data/main/fr-CH/numbers.json'),
        require('cldr-data/main/fr-CH/timeZoneNames.json')
    );

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('nom' in fieldValues)
            temp.nom = fieldValues.nom ? "" : "Ce champ est requis ."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length > 3 ? "" : "Minimum 4 lettres ."
        if ('lieu' in fieldValues)
            temp.lieu = fieldValues.lieu ? "" : "Ce champ est requis ."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email non valide ."
        if ('ordre' in fieldValues)
            temp.ordre = fieldValues.ordre.length < 5 && fieldValues.ordre.length !== 0 ? "" : "Ce champ est requis et 4 chiffres max !"
        if ('fonction' in fieldValues)
            temp.fonction = fieldValues.fonction.length != 0 ? "" : "Ce champ est requis ."
        // if ('projet' in fieldValues)
        //     let check = fieldValues.projet.find((val)=> val == 'Aucun')
        //     temp.projet = fieldValues.projet.length != 0 ? "" : "Ce champ est requis ."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
        handleAutoComplete
    } = useForm( dataEdit, true, validate);

    const { isLoading, error, refetchPost } = usePost()

    const handleSubmit = e => {
        e.preventDefault()
        // console.log()
        if (validate()) {
            // addOrEdit(values, resetForm);
            // console.log(id)
            refetchPost(`employers/updateParam/${id}`,'POST',values)
            // close(false);
        }
    }

    const change = (args, dName) => {
        /* eslint-disable no-console */
        // let fresh2 = "";
        let fresh = (args.value).toLocaleDateString();
        // fresh2 = (args.value).toString();
        // let take = fresh2.split(" ");
        let date = fresh.replace(/\//gi, '-');
        // let ba = `${take[1]}${take[3]}`
        // let base = ba.toLowerCase();
        console.log(date);
        // handleAutoComplete(dName, date);
    };

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])
    
    const { API } = useStateContext();

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container className='grid grid-cols-2'>
               <Grid className='inline-grid' >

                    <div className=''>
                        <div className='flex mr-4 mb-4 bg-gray-100 p-4 rounded-2xl'>
                            <img 
                                src={`${API.Local_Host_Name}/../storage/app/${values?.image ?? "public/uploads/profiles/default.png"}`}
                                width={100}
                                height={100}
                                className='items-center justify-center rounded-2xl'
                            /> 
                        </div>
                    </div>

                </Grid>
                
                <Grid className='inline-grid'>

                    <Controls.Input
                        name="nom"
                        label="Nom Complet"
                        disabled
                        value={values.nom}
                        onChange={handleInputChange}
                        error={errors.nom}
                    />

                    <Controls.Input
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />

                    <Controls.Input
                        name="password"
                        label="Mot de Passe"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />

                    <FormControl>
                    <div className='flex border-2 border-gray-200 rounded-md p-2 my-1 min-w-fit'>
                        <DatePickerComponent
                            value={values.contrat_deb}
                            showClearButton={false}
                            placeholder="Debut de contrat"
                            floatLabelType="Always"
                            // disabled
                            // change={ args => change(args, 'contrat_deb')}
                            locale='fr-CH'
                        />
                    </div>
                    <div className='flex border-2 border-gray-200 rounded-md p-2 my-2 min-w-fit'>
                        <DatePickerComponent
                            value={values.contrat_fin}
                            showClearButton={false}
                            placeholder="Fin de contrat"
                            floatLabelType="Always"
                            // disabled
                            // change={ args => change(args, 'contrat_fin')}
                            locale='fr-CH'
                        />
                    </div>
                    </FormControl>
                    
                    <FormControlLabel
                     control={
                        <Switch
                            checked={values?.emailRecept == 'non' ? false : true}
                            onChange={(e)=>{handleAutoComplete("emailRecept", e.target.checked)}}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                     } 
                     label="Recevoir des mails relatifs aux présences ?" 
                    />

                        
                    <div className='flex item-center flex-row self-end justify-end'>
                        <Controls.Button
                            type="submit"
                            text={"Enregistrer"}
                            // onClick={()=>close(false)}
                        />
                        <Controls.Button
                            text={"OK"}
                            color="default"
                            onClick={()=>close(false)}
                        />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
