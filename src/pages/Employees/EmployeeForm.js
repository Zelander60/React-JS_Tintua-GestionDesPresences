import React, { useState, useEffect } from 'react'
import { FormControl, FormLabel, Grid, } from '@material-ui/core';
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

const genderItems = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' },
    { id: 'other', title: 'Other' },
]


const initialFValues = {
    // id: 0,
    ordre: (parseInt(localStorage.getItem('Tordre')) + 1).toString(),
    nom: '',
    email: 'vide',
    fonction: '',
    lieu: 'Fada',
    password: '',
    projet: ['Aucun'],
    n1: { ordre: 0, nom: "" },
    // departmentId: '',
    // hireDate: new Date(),
    // isPermanent: false,
}

export default function EmployeeForm(props) {
    const { addOrEdit, recordForEdit, refresh, type, dataEdit, id, close } = props

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
    } = useForm(type == 'add' ? initialFValues : dataEdit, true, validate);

    const { isLoading, error, refetchPost , Fragment} = usePost(refresh,type)

    const handleSubmit = e => {
        e.preventDefault()
        // console.log()
        if (validate()) {
            // addOrEdit(values, resetForm);
            // console.log(id)
            type == 'add' ? refetchPost('employers/store','POST',values) :
            type == 'edit' ? refetchPost(`employers/update/${id}`,'POST',values) :
                            refetchPost(`employers/delete/${id}`,'GET');
            close(false);
        }else{
            type == 'delete' ? refetchPost(`employers/delete/${id}`,'GET') : '';
            close(false);
        }
    }

    const [urlImg, setUrlImg] = useState('');

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    useEffect(() => {
     const generateCode = async () => {
        try {
            const result = await QRCode.toDataURL(`${id ?? 0}+${values?.ordre ?? 0}+${values?.nom ?? 'erreur'}+${values?.fonction ?? 'erreur'}`);
            setUrlImg(result);
        } catch (e) {
            setUrlImg(redZone);
        }
     }
     generateCode();
    }, [values])
    
    const { currentColor, AllDatas } = useStateContext();

    const componentRef = React.useRef();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    // const renderEmp = () => ([
    //     { id: 'RRH', title: 'RRH' },
    //     { id: 'Comptabilité', title: 'Comptabilité' },
    //     { id: 'Coordo SAME', title: 'Coordo SAME' },
    //     { id: 'Assistant RH', title: 'Assistant RH' },
    //     { id: 'Assistant Comptabilité', title: 'Assistant Comptabilité' },
    //     { id: 'Assistant Coordo SAME', title: 'Assistant Coordo SAME' },
    //     { id: 'Assistant CC&SE', title: 'Assistant CC&SE' },
    //     { id: 'Stagiaire RH', title: 'Stagiaire RH' },
    //     { id: 'Stagiaire Comptabilité', title: 'Stagiaire Comptabilité' },
    //     { id: 'Employé', title: 'Employé' },
    // ])

    const optionsEmp = AllDatas.employers.map((option) => {
        const firstLetter = option?.nom[0].toUpperCase();
        // console.warn(option.title)
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      });
    // const optionsEmp = AllDatas.employers.map((option) => option.name);

    const options = ['Aucun', 'SignPost', 'Surare-Sanu'];

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container className='grid grid-cols-3'>
                { type == 'delete' ? '' : <Grid className=' inline-grid' >
                    <Controls.Input
                        label="Ordre"
                        name="ordre"
                        value={values.ordre}
                        onChange={handleInputChange}
                        error={errors.ordre}
                    />

                    <Controls.Input
                        name="nom"
                        label="Nom Complet"
                        value={values.nom}
                        onChange={handleInputChange}
                        error={errors.nom}
                    />

                    <Controls.Input
                        name="password"
                        label="Mot de Passe"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />

                    <Controls.Input
                        label="Ville"
                        name="lieu"
                        value={values.lieu}
                        onChange={handleInputChange}
                        error={errors.lieu}
                    />

                </Grid> }

                <Grid className='inline-grid'>
                    { type == 'delete' ? '' : 
                    <>
                        <Controls.Input
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        />

                        <Autocomplete
                        //   id="grouped-demo"
                          value={values.n1}
                          onChange={(event, newValue) => {
                            handleAutoComplete('n1', newValue);
                            console.log(values)
                          }}
                          options={optionsEmp.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        //   options={optionsEmp}
                          groupBy={(opt) => opt.firstLetter}
                          getOptionLabel={(opt) => opt.nom}
                        //   sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="N+1" />}
                        />
                    </>
                    }
                </Grid>
                
                <Grid className='inline-grid'>
                    {/* <Controls.RadioGroup
                        name="gender"
                        label="Gender"
                        value={values.gender}
                        onChange={handleInputChange}
                        items={genderItems}
                    /> */}
                    { type == 'delete' ? '' : 
                    <>
                        <Controls.Select
                            name="fonction"
                            label="Fonction"
                            value={values.fonction}
                            onChange={handleInputChange}
                            options={employeeService.getDepartmentCollection()}
                            error={errors.fonction}
                        />
                        <Controls.Input
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        />

                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      value={values.projet ?? ['Aucun']}
                      options={options}
                      onChange={(e, value)=> handleAutoComplete('projet', value)}
                    //   disableCloseOnSelect
                      getOptionLabel={(option) => option}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            // icon={check}
                            // checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option}
                        </li>
                      )}
                    //   style={{ width: 500 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Services/Projets" placeholder="Projets" />
                      )}
                    />
                    </>
                    }

                        { type == 'edit' ? 
                         <div className='flex flex-row gap-2 w-1/2 items-center ml-2'>
                           <a href={urlImg} download>
                            <QrImg ref={componentRef} src={urlImg} nom={`${values?.ordre ?? '0'} ${values?.nom}` ?? 'erreur'}/>
                           </a>
                            <button
                             onClick={handlePrint}
                             type='button'
                             style={{ background: currentColor }}
                             className='text-white flex self-end items-center justify-center mb-3 w-10 h-10 rounded-md text-md transition ease-in-out delay-15 hover:scale-110'
                            >
                                <BsPrinterFill size={20} />
                            </button>
                         </div> : ''
                        }

                    {/* <Controls.DatePicker
                        name="hireDate"
                        label="Hire Date"
                        value={values.hireDate}
                        onChange={handleInputChange}
                    /> */}
                    {/* <Controls.Checkbox
                        name="isPermanent"
                        label="Permanent Employee"
                        value={values.isPermanent}
                        onChange={handleInputChange}
                    /> */}

                    <div className='flex item-center flex-row'>
                        <Controls.Button
                            type="submit"
                            text={type == 'add' ? "Ajouter" : type == 'edit' ? "Mettre à Jour" : "OUI"}
                            // onClick={()=>close(false)}
                        />
                        <Controls.Button
                            text={type == 'delete' ? "NON" : "Raffraichir"}
                            color="default"
                            onClick={type == 'delete' ? ()=>close(false) : resetForm}
                        />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
