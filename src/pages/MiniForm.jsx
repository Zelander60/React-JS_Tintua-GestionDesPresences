import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
// import API from '../constants/Api';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import Controls from '../components/controls/Controls';
import { MdOutlineAutoDelete } from "react-icons/md";
import Popup from '../components/Popup';
import { useStateContext } from '../contexts/ContextProvider';

function MiniForm({ID, refresh, date, color, isAutres, API}) {

    const iDate = new Date();
    
    const regChange = () => {
      let fresh = iDate.toLocaleDateString();
      let date = fresh.replace(/\//gi, '-');
      // console.log(`${date} de Init`);
      return date;
    }

    const [HA, setHA] = useState('');
    const [HD, setHD] = useState('');
    const [Obs, setObs] = useState('');

    const [HA2, setHA2] = useState(regChange());
    const [HD2, setHD2] = useState(regChange());
    const [Obs2, setObs2] = useState('');
    const [Ordre2, setOrdre2] = useState('');
    
    const [open, setOpen] = useState(false);

    const Options = () => ([
      { id: 'Mission', title: 'Mission' },
      { id: "Autorisation d'Absence", title: "Autorisation d'Absence" },
      { id: 'Repos Médical', title: 'Repos Médical' },
      { id: 'Congés', title: 'Congés' },
      { id: 'Congés sans Solde', title: 'Congés sans Solde' },
      { id: 'Absence Non Autorisée', title: 'Absence Non Autorisée' },
      { id: 'Autres', title: 'Autres' },
    ])

    const corrDate = (e) => {
      let fDate = e?.split(".");
      return fDate[0] == '' ? 'auto' : fDate[0];
    }

    const diffDate = () => {
      // let date1 = parseInt(HA2.replace(/-/gi, ''));
      // let date2 = parseInt(HD2.replace(/-/gi, ''));
      let date1 = HA2.split('-');
      let date2 = HD2.split('-');
      
      console.log(date1);

      if(parseInt(date2[2]) > parseInt(date1[2])){
        return false;
      }else if(parseInt(date2[2]) == parseInt(date1[2])){
        if(parseInt(date2[1]) > parseInt(date1[1])){
          return false;
        }else if(parseInt(date2[1]) == parseInt(date1[1])){
          if(parseInt(date2[0]) > parseInt(date1[0])){
            return false;
          }else if(parseInt(date2[0]) == parseInt(date1[0])){
            return false;
          }else{
            return true
          }
        }
      }else{
        return true
      }
    }

    const fetchPresence = async () => {
      if (isAutres) {
        if(diffDate()) {
          return toast.warn("La date de Fin ne peut être inférieure à celle du Début !");
        }else if (Obs2 == '') {
          return toast.warn("Aucun Type d'absence entré !");
        }else if (Obs2 == 'Mission' && Ordre2 == '') {
          return toast.warn("Aucun Ordre de Mission entré !");
        }else if (Obs2 == 'Autres' && Ordre2 == '') {
          return toast.warn("Autres évènements à préciser !");
        }
      }
        const idd = toast.loading('En cours ...',{isLoading: true})

        await fetch(`${API.Local_Host_Name}/api/presences/update/${ID}/${date}`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: !isAutres ? 
                JSON.stringify({
                  'HeureA': HA,
                  'HeureD': HD,
                  'Observations': Obs,
              }) :
              JSON.stringify({
                'type': 'autres',
                'Date1': HA2,
                'Date2': HD2,
                'Absence': `${Obs2}`,
                'Observations': `${Ordre2}`,
            }),
              })
              .then(response => {
                if (!response.ok) {
                  // handle network errors or non-2xx status codes
                  toast.error('Vérifiez votre connexion !');
                }
                return response.json();
              })
                .then((responseJson) => {
                  //Showing response message coming from server
                  if (responseJson?.status !== 200) {
    
                    toast.warn(`${responseJson?.message}`);
                    console.warn(`${responseJson}`);
                    // setPokemons(responseJson.data);
                    
                  } else{
                    
                    refresh();
                    toast.success(`${responseJson?.message}`);
                    // console.log(responseJson)
                  }
                })
                .catch(errors => {
                    toast.warn("Une erreure s'est produite !");       
                  console.warn(errors);
                })
                .finally(()=>{
                    toast.dismiss(idd);
                });
    }

    const fetchSupprPresence = async () => {
      if (isAutres) {
        if(HA2 == '') {
          return toast.warn("La date de début doit être renseignée !");
        }
      }
        const idd = toast.loading('En cours ...',{isLoading: true})

        await fetch(`${API.Local_Host_Name}/api/presences/delete/${ID}`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: !isAutres ? 
                JSON.stringify({
                  'type': 'presence',
                  'date': date,
              }) :
              JSON.stringify({
                'type': 'autre',
                'date': HA2,
            }),
              })
              .then(response => {
                if (!response.ok) {
                  // handle network errors or non-2xx status codes
                  toast.error('Vérifiez votre connexion !');
                }
                return response.json();
              })
                .then((responseJson) => {
                  //Showing response message coming from server
                  if (responseJson?.status !== 200) {
    
                    toast.warn(`${responseJson?.message}`);
                    console.warn(`${responseJson}`);
                    // setPokemons(responseJson.data);
                    
                  } else{
                    
                    refresh();
                    toast.success(`${responseJson?.message}`);
                    // console.log(responseJson)
                  }
                })
                .catch(errors => {
                    toast.warn("Une erreure s'est produite !");       
                  console.warn(errors);
                })
                .finally(()=>{
                    toast.dismiss(idd);
                });
    }


    const test = (e) => {
      let value = e.target.value;
      console.log(value);
      setObs2(value);
      if(value != "Mission" && value != "Autres"){
        setOrdre2('');
      }
    }

    const change = (args) => {
      /* eslint-disable no-console */
      // let fresh2 = "";
      let fresh = (args.value).toLocaleDateString();
      // fresh2 = (args.value).toString();
      // let take = fresh2.split(" ");
      let date = fresh.replace(/\//gi, '-');
      // let ba = `${take[1]}${take[3]}`
      // let base = ba.toLowerCase();
      console.log(`${date} de Debut`);
      setHA2(date);
    };

    const change2 = (args) => {
      /* eslint-disable no-console */
      // let fresh2 = "";
      let fresh = (args.value).toLocaleDateString();
      // fresh2 = (args.value).toString();
      // let take = fresh2.split(" ");
      let date = fresh.replace(/\//gi, '-');
      // let ba = `${take[1]}${take[3]}`
      // let base = ba.toLowerCase();
      console.log(`${date} de Fin`);
      setHD2(date);
    };

  return (
    <div className=" pl-4 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="flex flex-col gap-2" method="">

      <div className='flex flex-row gap-8'>

      <div>
      {isAutres ?  <>
      <div className="mt-2"></div>               
          <DatePickerComponent
                  value={HA2}
                  showClearButton={false}
                  placeholder="DEBUT"
                  floatLabelType="Always"
                  change={change}
                  locale='fr-CH'
          /> 
          <div className='h-0.5 mb-4' style={{backgroundColor: color}}></div>
          </>  : <>
        <label htmlFor="ha" className="block text-sm font-medium leading-6 text-gray-900">
            Heure d'Arrivée
        </label>
        <div className="mt-2">
          <input
            id="ha"
            name="ha"
            type="text"
            autoComplete="name"
            required
            value={HA}
            placeholder='0:00'
            onChange={(e)=> setHA(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        </>}
      </div>

      <div>
      {isAutres ?  <>
      <div className="mt-2"></div>
          <DatePickerComponent
                  value={HD2}
                  showClearButton={false}
                  placeholder="FIN"
                  floatLabelType="Always"
                  change={change2}
                  locale='fr-CH'
          /> 
          <div className='h-0.5 mb-4' style={{backgroundColor: color}}></div>
          </>  : <>
        <div className="flex items-center justify-between">
          <label htmlFor="hd" className="block text-sm font-medium leading-6 text-gray-900">
            Heure de Départ
          </label>
        </div>
        <div className="mt-2">
          <input
            id="hd"
            name="hd"
            type="text"
            autoComplete="name"
            required
            value={HD}
            placeholder='0:00'
            onChange={(e)=>setHD(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div> 
        </> }
      </div>

      </div>

      <div className='flex flex-row gap-8'>

      <div>
      {isAutres ?  <>
      <div className="mt-2"></div>               
          <Controls.Select
              name="absences"
              label="Types d'Absence"
              value={Obs2}
              onChange={test}
              options={Options()}
              // error={errors.departmentId}
          />

        {Obs2 == "Mission" || Obs2 == "Autres" ? <><div className="flex items-center justify-between">
          <label htmlFor="obs" className="block mt-3 text-sm font-medium leading-6 text-gray-900">
            {Obs2 == "Mission" ? "Ordre de Mission" : "À Préciser"}
          </label>
        </div>
        <div className="mt-2">
          <input
            id="ordre"
            name="ordre"
            type="text"
            autoComplete="name"
            required
            value={Ordre2}
            placeholder={Obs2 == "Mission" ? '#01' : '...'}
            onChange={(e)=>setOrdre2(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div></> : ''}

          </>  : <>
        <div className="flex items-center justify-between">
          <label htmlFor="obs" className="block text-sm font-medium leading-6 text-gray-900">
            Observations
          </label>
        </div>
        <div className="mt-2">
          <input
            id="obs"
            name="obs"
            type="text"
            autoComplete="name"
            required
            value={Obs}
            placeholder='RAS'
            onChange={(e)=>setObs(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div></>}
      </div>

      <div className='flex flex-row self-end justify-between gap-4'>
        <button
          type="button"
          onClick={()=>fetchPresence()}
          style={{ background: color,}}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Enregistrer
        </button>

        <button
          type="button"
          onClick={()=>setOpen(true)}
          style={{ background: "#FF5C8E" }}
          className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:drop-shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        <MdOutlineAutoDelete/>
        </button>
      </div>

      </div>
      
    </form>

    <Popup
    title={ isAutres ? `Supprimer l'évènement du ${HA2} ?` : `Supprimer la présence d${corrDate(date) == "auto" ? "'aujourd'hui ?" : `u ${corrDate(date)} ? `}`}
    openPopup={open}
    setOpenPopup={setOpen}
    >
      <div className='flex flex-row self-end justify-between gap-4'>
        <button
          type="button"
          onClick={()=>{
            fetchSupprPresence();
            setOpen(false);
          }}
          style={{ background: color,}}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          OUI
        </button>
        <button
          type="button"
          onClick={()=>setOpen(false)}
          style={{ background: "#FF5C8E",}}
          className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          NON
        </button>
      </div>
    </Popup>

  </div>
  )
}

export default MiniForm
