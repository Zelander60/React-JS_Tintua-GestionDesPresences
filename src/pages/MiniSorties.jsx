import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
// import API from '../constants/Api';
import { FaUserTie } from 'react-icons/fa6';

function MiniSorties({refresh, date, color, actions, API}) {
    const [HA, setHA] = useState(actions?.HeureA ?? '');
    const [HD, setHD] = useState(actions?.HeureD ?? '');
    const [Obs, setObs] = useState(actions?.Motifs ?? '');
    const [No, setNo] = useState(1);

    useEffect(() => {
        setHA(actions?.HeureA ?? '');
        setHD(actions?.HeureD ?? '');
        setObs(actions?.Motifs ?? '');
    }, [actions])
    

    const fetchPresence = async () => {
        const idd = toast.loading('En cours ...',{isLoading: true})

        await fetch(`${API.Local_Host_Name}/api/sorties/update/${0}/${date == "date" ? "auto" : date}`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'HeureA': HA,
                    'HeureD': HD,
                    'Observations': Obs,
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

  return (
    <div className="flex flex-row pl-4 sm:mx-auto sm:w-full sm:max-w-sm gap-8">
        
    <form className="flex flex-col gap-2" method="">

      <div className='flex flex-row gap-8'>

      <div>
        <label htmlFor="ha" className="block text-sm font-medium leading-6 text-gray-900">
            Heure de Sortie
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
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="hd" className="block text-sm font-medium leading-6 text-gray-900">
            Heure de Retour
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
      </div>

      </div>

      <div className='flex flex-row gap-8 mt-4'>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="obs" className="block text-sm font-medium leading-6 text-gray-900">
            Motifs
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
        </div>
      </div>

      {/* <div>
        <div className="flex items-center justify-between">
          <label htmlFor="obs" className="block text-sm font-medium leading-6 text-gray-900">
            No. sortie
          </label>
        </div>
        <div className="mt-2">
          <input
            id="obs"
            name="obs"
            type="number"
            autoComplete="name"
            required
            value={No}
            placeholder='RAS'
            onChange={(e)=>{
                console.warn(actions)
                setNo(e.target.value)}}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div> */}

      <div className='self-end'>
        <button
          type="button"
          onClick={()=>fetchPresence()}
          style={{ background: color,}}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Enregistrer
        </button>
      </div>

      </div>
      
    </form>

  </div>
  )
}

export default MiniSorties
