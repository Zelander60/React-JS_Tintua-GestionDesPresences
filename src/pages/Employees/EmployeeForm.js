import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
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


const genderItems = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' },
    { id: 'other', title: 'Other' },
]


const initialFValues = {
    // id: 0,
    ordre: (parseInt(localStorage.getItem('Tordre')) + 1).toString(),
    nom: '',
    fonction: '',
    lieu: 'Fada',
    // gender: 'male',
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
        if ('lieu' in fieldValues)
            temp.lieu = fieldValues.lieu ? "" : "Ce champ est requis ."
        // if ('email' in fieldValues)
        //     temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('ordre' in fieldValues)
            temp.ordre = fieldValues.ordre.length < 5 && fieldValues.ordre.length !== 0 ? "" : "Ce champ est requis et 4 chiffres max !"
        if ('fonction' in fieldValues)
            temp.fonction = fieldValues.fonction.length != 0 ? "" : "Ce champ est requis ."
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
        resetForm
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
                            refetchPost(`employers/delete/${id}`,'DELETE')
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
    
    const { currentColor } = useStateContext();

    const componentRef = React.useRef();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container className=' inline-grid grid-cols-2'>
                { type == 'delete' ? '' : <Grid className='inline-grid grid-cols-1' >
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
                        label="Ville"
                        name="lieu"
                        value={values.lieu}
                        onChange={handleInputChange}
                        error={errors.lieu}
                    />

                </Grid> }
                <Grid  className='flex flex-col justify-between'>
                    {/* <Controls.RadioGroup
                        name="gender"
                        label="Gender"
                        value={values.gender}
                        onChange={handleInputChange}
                        items={genderItems}
                    /> */}
                    { type == 'delete' ? '' : <Controls.Select
                        name="fonction"
                        label="Fonction"
                        value={values.fonction}
                        onChange={handleInputChange}
                        options={employeeService.getDepartmentCollection()}
                        error={errors.fonction}
                    />}

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
                            onClick={()=>close(false)}
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
