import React, { useEffect, useState } from 'react'
import { Form2, useForm2 } from '../components/useForm2'
import Controls from '../components/controls/Controls'
import Papa from 'papaparse';
import avatar from '../data/tintua_trans.png';
import QRCode from 'qrcode';
import { useReactToPrint } from 'react-to-print';


function Qrpage() {

  const initialFValues = {
    code: 'Aucun',
    projet: 'Aucun',
    commune: 'Aucun',
    npb: 'Aucun',
    tb: 'Aucun',
    npm: 'Aucun',
    tm: 'Aucun',
  }

  const options = [
    { id: 'Aucun', title: 'Aucun'},
    { id: 'Aucun', title: 'Aucun'},
  ]

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    // if ('lieu' in fieldValues)
    //     temp.lieu = fieldValues.lieu ? "" : "Ce champ est requis ."
    if ('colones' in fieldValues){
        temp.colones = fieldValues.colones != '' ? "" : "Ce champ est requis ."
    }
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
} = useForm2(initialFValues, true, validate);

const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true, // Skip empty rows
        complete: (result) => {
          setJsonData(result.data); // Convert CSV rows to JSON
        },
      });
    }
  };

  const data = [
    { code: '#111', projet: 'resa', commune: 'kadiogo' },
  ];

  const TabsRows = ({ title, content }) => {{
    return (
      <div className='flex flex-row'>
        <p className='flex-[1] text-xs bg-gray-200 text-gray-700 border-1 border-gray-500 text-center line-clamp-2'>{title}</p>
        <p className='flex-[1.8] text-xs bg-white border-1 border-gray-500 text-center justify-center align-middle'>{content}</p>
      </div>
    )
  }}

  const [key, setKey] = useState(options);
 
 useEffect(() => {
  console.log('values :: ',values)
 }, [values])
 
 useEffect(()=>{
  if (jsonData) {
    const _keys = Object.keys(jsonData[0]);
    const _fKeys = _keys.map((v, index)=> (
      {id: v, title: v}
    ))
    console.warn('keys :', _fKeys)
    setKey(_fKeys)
  }
 }, [jsonData])

  const cRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => cRef.current,
  });

  const Card_Att = ({ value, index }) => {

    const [urlImg, setUrlImg] = useState('');

    const generateCode = async (code) => {
      try {
          const result = await QRCode.toDataURL(code);
          setUrlImg(result);
      } catch (e) {
        console.log(e)
      }
   }

   useEffect(() => {
    generateCode(value[values.code])
   }, [])
  
    return (
      <div className='flex flex-col m-3 w-[400px] h-[200px] no-break'>
            <div className='flex flex-row border-1 border-gray-500'>
              <div className='flex-[1.5] flex-col'>
                <div className='flex bg-blue-500 p-1 justify-center'>
                  <p className='text-white text-center underline'>Association Tin Tua/ Resan</p>
                </div>
                <TabsRows title={'Code'} content={value[values.code]}/>
                <TabsRows title={'Projet'} content={value[values.projet]}/>
                <TabsRows title={'Commune'} content={value[values.commune]}/>
                <TabsRows title={'Nom et Prénom'} content={value[values.npb]}/>
                <TabsRows title={'N° Téléphone'} content={value[values.tb]}/>
                <TabsRows title={'Nom et Prénom mandataire'} content={value[values.npm]}/>
                <TabsRows title={'N° Téléphone'} content={value[values.tm]}/>
              </div>
              <div className='flex-[0.7] flex-col'>
                <div className='flex items-center justify-center border-b-1 border-gray-500'>
                  <img 
                    src={avatar}
                    className='self-center'
                    height={75}
                    width={75}
                  />
                </div>
                <div className='overflow-hidden items-center justify-center'>
                  <img 
                    src={urlImg}
                    className='self-center ml-5 mt-5'
                    height={75}
                    width={75}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col bg-blue-500 p-1 items-center justify-center'>
                <p className='text-white text-[8px] text-center'>
                  Cette carte est conçue pour les bénéficiaires du projet, elle ne saurait être utilisée à d’autres fins.
                </p>
                <p className='text-white text-[8px] text-center'>
                  Pour toutes questions ou feedbacks, veuillez contacter le 62 76 20 20/ 07 91 73 73.
                </p>
            </div>
        </div>
    )
  } 
  

  return (
    <div>
      <h1 className='bg-slate-800 text-white p-8 text-center text-2xl'>
        Aide de Distribution Tintua 
      </h1>

      <div className='p-8 justify-center'>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        {jsonData && (
          <>
            <pre>{JSON.stringify(jsonData[0], null, 2)}</pre>

            

            <div>
              <Form2>
                <Controls.Select
                  name="code"
                  label="Colone des codes"
                  value={values.code ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="projet"
                  label="Colone Projet"
                  value={values.projet ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="commune"
                  label="Colone Commune"
                  value={values.commune ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="npb"
                  label="Colone Nom Prénom Bénéf."
                  value={values.npb ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="tb"
                  label="Colone Téléphone Bénéf."
                  value={values.tb ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="npm"
                  label="Colone Nom Prénom mand."
                  value={values.npm ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
                <Controls.Select
                  name="tm"
                  label="Colone Téléphone mand."
                  value={values.tm ?? 'Aucune'}
                  onChange={handleInputChange}
                  options={key}
                  error={errors.colones}
                />
              </Form2>
            </div>

            <div className='flex flex-col m-4 w-[400px] h-[200px] no-break'>
            <div className='flex flex-row border-1 border-gray-500'>
              <div className='flex-[1.5] flex-col'>
                <div className='flex bg-blue-500 p-1 justify-center'>
                  <p className='text-white text-center underline'>Association Tin Tua/ Resan</p>
                </div>
                <TabsRows title={'Code'} content={jsonData[0][values.code]}/>
                <TabsRows title={'Projet'} content={jsonData[0][values.projet]}/>
                <TabsRows title={'Commune'} content={jsonData[0][values.commune]}/>
                <TabsRows title={'Nom et Prénom'} content={jsonData[0][values.npb]}/>
                <TabsRows title={'N° Téléphone'} content={jsonData[0][values.tb]}/>
                <TabsRows title={'Nom et Prénom mandataire'} content={jsonData[0][values.npm]}/>
                <TabsRows title={'N° Téléphone'} content={jsonData[0][values.tm]}/>
              </div>
              <div className='flex-[0.7] flex-col items-center justify-center'>
                <div className='flex items-center justify-center border-b-1 border-gray-500'>
                  <img 
                    src={avatar}
                    className='self-center'
                    height={75}
                    width={75}
                  />
                </div>
                <div className='overflow-hidden items-center justify-center'>
                  <img 
                    src={avatar}
                    className='self-center ml-5 mt-5'
                    height={75}
                    width={75}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col bg-blue-500 p-1 items-center justify-center'>
                <p className='text-white text-[8px] text-center'>
                  Cette carte est conçue pour les bénéficiaires du projet, elle ne saurait être utilisée à d’autres fins.
                </p>
                <p className='text-white text-[8px] text-center'>
                  Pour toutes questions ou feedbacks, veuillez contacter le 62 76 20 20/ 07 91 73 73.
                </p>
            </div>
        </div>

            <button className='flex text-white m-6 rounded-sm p-4 bg-blue-600' type='button' onClick={handlePrint}>Générer les cartes</button>

            <div ref={cRef} className='print:!flex print:!flex-col overflow-scroll !hidden'>
              {
                jsonData?.map((value, index)=>(
                  <Card_Att index={index} value={value} />
                ))
              }
            </div>
            
          </>
        )}
        
    </div>
        
    </div>
  )
    
}

export default Qrpage
