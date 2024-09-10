import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

// import { Button } from './Button';
import { Button } from './Button';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/tintua_trans.png';
import { useNavigate } from 'react-router-dom';

const UserParams = () => {
  const { currentColor, API, setApiper } = useStateContext();
//   const goTo = useNavigate();

  const perform = () => {
    setOnline(false);
    goTo("/");
  }

  const [Param, setParam] = useState('');

  useEffect(() => {
    setParam(API.Local_Host_Name);
  }, [API])
  

  return (
    <div className="nav-item shadow-2xl absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-80">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Serveur</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex flex-col gap-5 items-center mt-1 border-color border-t-1 border-b-1 pt-6 pb-6">
        <input
            id="hd"
            name="hd"
            type="text"
            autoComplete="name"
            required
            value={Param}
            placeholder='api'
            onChange={(e)=>setParam(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        <div className='flex flex-row gap-5 items-center mt-1'>
          {/* <p className="font-semibold text-xl dark:text-gray-200"> RRH </p> */}
          {/* <p className="text-gray-500 text-sm dark:text-gray-400">  Administrateur  </p> */}
          {/* <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> rrh@tintua.org </p> */}
    <button
      type="button"
      onClick={() => {
        setApiper("http://192.168.0.222/api_presences/public");
      }}
      style={{ backgroundColor: currentColor, color: "white", borderRadius: "20px" }}
      className={`flex items-center text-sm p-1 hover:drop-shadow-xl`}
    >
        Serv.
    </button>
    <button
      type="button"
      onClick={() => {
        setApiper("http://localhost:8000");
      }}
      style={{ backgroundColor: currentColor, color: "white", borderRadius: "20px" }}
      className={`flex items-center text-sm p-2 hover:drop-shadow-xl`}
    >
        Local.
    </button>
        </div>
      </div>
      <div className="mt-5">
      <button
      type="button"
      onClick={() => {
        setApiper(Param);
      }}
      style={{ backgroundColor: currentColor, color: "white", borderRadius: "10px" }}
      className={`text-sm p-3 w-full hover:drop-shadow-xl`}
    >
        Modifier
    </button>
    {/* <button
      type="button"
      onClick={() => {
        setOnline(false); 
        goTo("/acceuil")
      }}
      style={{ backgroundColor: currentColor, color: "white", borderRadius: "10px" }}
      className={`p-3 w-full hover:drop-shadow-xl`}
    >
      Se Déconnecter
    </button> */}
      </div>
    </div>

  );
};

export default UserParams;
