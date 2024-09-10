import React, { useState, useRef } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

// import { Button } from './Button';
import { Button } from './Button';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/tintua_trans.png';
import { useNavigate } from 'react-router-dom';
import { TbUserEdit } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';

const UserProfile = () => {
  const { UserR, API, setOnline, currentColor, setUserR } = useStateContext();
  const goTo = useNavigate();

  const [file, setFile] = useState(null);
  const profileRef = useRef(null);

  const handleChange = (e) => {
    const imgFile = e.target.files[0];
      // setFile(imgFile);
      handleSubmit(imgFile);
  };

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
        </div>
      </div>
      <div>
        {UserR?.role != '' ? '' : userProfileData.map((item, index) => (
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
              <p className="text-gray-500 text-sm dark:text-gray-400"> {UserR?.projet} </p>
            </div>
          </div>
        ))}
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
