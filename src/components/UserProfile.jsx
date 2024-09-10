import React, { useState, useRef } from 'react';
import { MdOutlineCancel, MdOutlineWork } from 'react-icons/md';

// import { Button } from './Button';
import { Button } from './Button';
// import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
// import avatar from '../data/tintua_trans.png';
import { useNavigate } from 'react-router-dom';
import { TbUserEdit } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import { BsCurrencyDollar } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa6';
import { GrWorkshop } from 'react-icons/gr';
import Popup from './Popup';
import UserParamsForm from '../pages/Employees/UserParamsForm';
import { IoSettings } from 'react-icons/io5';

const UserProfile = () => {
  const { UserR, API, setOnline, currentColor, setUserR, propsID } = useStateContext();
  const goTo = useNavigate();

  // const [file, setFile] = useState(null);
  const [paramOpem, setParamOpem] = useState(false);
  const profileRef = useRef(null);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const handleChange = (e) => {
    const imgFile = e.target.files[0];
      // setFile(imgFile);
      handleSubmit(imgFile);
  };

  const userProfile = [
    {
      icon: <MdOutlineWork />,
      title: 'Fonction',
      desc: UserR?.fonction ?? "Employé(e)",
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
    },
    {
      icon: <FaUserTie />,
      title: 'Supérieur·e',
      desc: UserR?.n1?.nom == "" ? "Non défini" : (UserR?.n1?.nom ?? "Non défini"),
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
    },
    {
      icon: <GrWorkshop />,
      title: "Département",
      desc: UserR?.departement,
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#03C9D7',
    },
  ];

  const handleSubmit = async (files) => {

    const id = toast.loading('En cours ...',{isLoading: true})

    const formData = new FormData();
    formData.append('file', files);
    formData.append('ordre', UserR?.ordre);

    
    await fetch(`${API.Local_Host_Name}/api/profile`, {
        method: 'POST',
        body: formData,
      })
      .then( res => {
        if (!res.ok) {
          // handle network errors or non-2xx status codes
          toast.error('Vérifiez votre connexion !');
        }
        return res.json();
      })
      .then((resJson)=>{
        if (resJson?.status !== 200) {
          toast.warn(`${resJson?.message}`);
          console.warn(`${resJson}`);
        } else{
          toast.success(`${resJson?.message}`);
          setUserR({...UserR, ['image'] : resJson?.path});
          console.log('Profile picture uploaded:', resJson?.path);
        }
      })
      .catch (error => {
        toast.error("Une erreure est survenue !");
        console.error('Error uploading profile picture:', error);
      })
      .finally(()=>{
        toast.dismiss(id);
      })
    };

  const click = () => {
    if(UserR?.role != '') return;
    profileRef.current.click();
  }

  const perform = () => {
    setOnline(false);
    goTo("/");
  }

  const initialVal = {
    nom: UserR?.nom,
    email: UserR?.email,
    emailRecept: UserR?.emailRecept,
    password: UserR?.password,
    image: UserR?.image,
    contrat_deb: UserR?.contrat_deb,
    contrat_fin: UserR?.contrat_fin,
  }

  return (
    <div className="nav-item shadow-2xl absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-80">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-3 items-center mt-6 border-color border-b-1 pb-6">
        <div onClick={click} className=' relative '>
          <img
            className="flex-1 rounded-full p-1 border-1 h-20 w-20"
            src={`${API.Local_Host_Name}/../storage/app/${UserR?.image ?? "public/uploads/profiles/default.png"}`}
            alt="user-profile"
            // onClick={click}
          />
          <TbUserEdit size={24} className="absolute bottom-0 right-1 text-gray-400 rounded-full bg-white p-1 text-14" />
        </div>
          <input type='file' onChange={handleChange} ref={profileRef} style={{ display: "none"}}/>
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {UserR?.nom ?? '...'} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  {UserR?.role ?? '...'}  </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {UserR?.email ?? '...'} </p>
          {UserR?.role == '' && <a onClick={()=>setParamOpem(true)} className="flex w-24 items-center mt-1 rounded-xl bg-gray-100 p-0.5 gap-1 text-sky-500 cursor-pointer text-sm font-semibold dark:text-gray-400"> <IoSettings /> Paramètres </a>}
        </div>
      </div>
      <div>
        {UserR?.role != '' ? '' : userProfile.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
              {/* { typeof(item.desc) == 'string' ? 
                  <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
                  :
                  item.desc.map((projet, key)=>(
                  <p key={key} className="text-gray-500 bg-yellow-100 pr-1 text-sm dark:text-gray-400"> {projet} </p>
                ))
              } */}
            </div>
          </div>
        ))}
          { UserR?.role != '' ? '' : <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <div>
              <button
                type="button"
                style={{ color: "rgb(255, 244, 229)", backgroundColor: "rgb(254, 201, 15)" }}
                className=" text-xl rounded-lg p-3 hover:bg-light-gray"
              >
                <GrWorkshop />
              </button>
            </div>

            <div className='flex flex-col'>
              <p className="font-semibold dark:text-gray-200 ">Projets/Services</p>
              <div className='flex flex-wrap'>
                {
                  UserR?.projet.map((projet, key)=>(
                    <div key={key} className='flex mr-2 mt-1'>
                      <p className="text-gray-500 rounded-lg bg-yellow-100 p-1 text-sm dark:text-gray-400"> {projet} </p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>}
      </div>
      <div className="mt-5">
        <Button
          perfom={perform}
          color="white"
          bgColor={currentColor}
          text="Se Déconnecter"
          borderRadius="10px"
          width="full"
        />
      </div>

            <Popup
              title={"Paramètres"}
              openPopup={paramOpem}
              setOpenPopup={setParamOpem}
              param
            >
              <UserParamsForm
                recordForEdit={recordForEdit}
                dataEdit={initialVal}
                id={propsID}
                close={setParamOpem}
              />
            </Popup>

      {/* <ToastContainer
      position="top-right"
      autoClose={5000}
      className={"conZ"}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" /> */}

    </div>

  );
};

export default UserProfile;
