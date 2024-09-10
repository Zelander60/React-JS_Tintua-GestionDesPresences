import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { dropdownData, ExportMenu } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import product9 from '../data/product9.jpg';
import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ExcelExport, ContextMenu, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { TintuaArriverGrid, TintuaEmployeesData, } from '../data/tintua';
import { Header } from '../components';
import { loadCldr} from '@syncfusion/ej2-base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import API from '../constants/Api';
import { FaBusinessTime, FaUserClock, FaUserTie } from "react-icons/fa";
import { search } from '@syncfusion/ej2/filemanager';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Collegue = () => {
  const { currentColor, API, UserR } = useStateContext();

//   const [dateTime, setDateTime] = useState('now');
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  const [area, setArea] = useState("all");

  const fetchPresence = async () => {
      const id = toast.loading('En cours ...',{isLoading: true});
            // setIsLoading(true);
            // console.info(AllDatas?.lieu)
        await fetch(`${API.Local_Host_Name}/api/employers/collegues/${UserR?.departement}`, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
    
                // body: JSON.stringify(query),
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
                    toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                    // setIsLoading(false);
                    console.warn(`${responseJson}`);
                    // console.log(new Date())
                    
                  } else{
                    // setIsLoading(false);
                    setData(responseJson);
                    setData2(responseJson?.employers);
                    //toast.success(`${responseJson?.message}`);
                    // toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                    // setOK(true);
                    // console.log(responseJson)
                  }
                })
                .catch(errors => {
                  //display error message         
                  toast.error("Une erreure est survenue !");
                  console.warn(errors);
                  // setError(errors);
                })
                .finally(()=>{
                  toast.dismiss(id);
                  // setIsLoading(false);
                });
    }

  useEffect(() => {
    if ((UserR?.departement != null) || (UserR?.departement != '')) {
      fetchPresence();
    }
  }, [UserR?.departement])
  

  const earningData = [
    {
      image: null,
      nom: 'Mader Chain',
      email: 'chaval.terrain@tintua.net',
      fonction: 'Employé',
      superieur: 'Jada',
      departement: 'Meal',
      projet: ["VBG", "Valpape"],
      contrat: 'contrat actif',
      tel: '70707035',
      statut: 'au service'
    },
    
    {
      image: null,
      nom: 'Mader Chain',
      email: 'chaval.terrain@tintua.net',
      fonction: 'Employé',
      superieur: 'Jada',
      departement: 'Meal',
      projet: ["VBG", "Valpape"],
      contrat: 'contrat actif',
      tel: '70707035',
      statut: 'au service'
    },

    {
      image: null,
      nom: 'Mader Chain',
      email: 'chaval.terrain@tintua.net',
      fonction: 'Employé',
      superieur: 'Jada',
      departement: 'Meal',
      projet: ["VBG", "Valpape"],
      contrat: 'contrat actif',
      tel: '70707035',
      statut: 'au service'
    },

    {
      image: null,
      nom: 'Mader Chain',
      email: 'chaval.terrain@tintua.net',
      fonction: 'Employé',
      superieur: 'Jada',
      departement: 'Meal',
      projet: ["VBG", "Valpape"],
      contrat: 'contrat actif',
      tel: '70707035',
      statut: 'au service'
    },
    // {
    //   icon: <HiOutlineRefresh />,
    //   amount: '39,354',
    //   percentage: '-12%',
    //   title: 'Refunds',
    //   iconColor: 'rgb(0, 194, 146)',
    //   iconBg: 'rgb(235, 250, 242)',
    //   pcColor: 'red-600',
    // },
  ];

  const searchEmployers = (text) => {
    const result = data?.employers?.filter((value)=>{
      // console.log(text?.toLowerCase())
      return value?.nom?.toLowerCase().match(text?.toLowerCase())
    });
    // let d =""
    // d.match()
    setData2(result);
    // console.log(text)
  }

  return (
    <div className="mt-20 md:mt-10">

      <div className="flex flex-row mb-4 gap-4 items-center justify-center">
        {/* <div className="flex bg-white justify-center items-center dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
              
        </div> */}
        <FaUserTie />
        <input
          onChange={e=>{searchEmployers(e.target.value)}}
          placeholder='Rechercher un nom...'
          className='flex rounded-3xl sm:w-1/3 xl:w-1/4 border-2 border-gray-200 bg-white'
        />
        
      </div>

      <div className='flex rounded-lg items-center ml-8 mb-6 mt-8'>
        <p style={{background: "#03C9D7"}} className='p-1 rounded-md text-white text-xl'>{UserR?.departement}</p>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        
        <div className="flex m-3 flex-wrap justify-center gap-4 items-center">
          {data2?.map((item) => (
            <div key={item.title} className="flex flex-row gap-4 shadow-sm bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 pt-9 rounded-2xl ">
              {/* <div> */}
                <img
                  className="flex-1 rounded-full p-1 border-1 h-20 w-20"
                  src={`${API.Local_Host_Name}/../storage/app/${item?.image ?? "public/uploads/profiles/default.png"}`}
                  alt="user-profile"
                />
              {/* </div> */}
              <div>
                <p className="font-semibold text-xl dark:text-gray-200"> {item?.nom ?? '...'} </p>
                <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {item?.email ?? '...'} </p>
                <div className='flex gap-2'>
                  <p className="flex p-1 rounded-md text-gray-500 text-sm font-semibold bg-gray-100 dark:text-gray-400"> {item?.fonction ?? '...'} </p>
                  <p style={{ color: item?.statut[0] == 'A' ? 'rgb(0, 194, 146)': '', backgroundColor: 'rgb(235, 250, 242)' }}
                    className="flex p-1 rounded-md text-gray-500 text-sm font-semibold bg-gray-100 dark:text-gray-400"> {item?.statut ?? '...'} </p>
                </div>
                <div className='flex flex-wrap'>
                {
                  item?.projet.map((projet, key)=>(
                    <div key={key} className='flex mr-2 mt-1'>
                      <p className="text-gray-500 rounded-lg bg-yellow-50 p-1 text-sm dark:text-gray-400"> {projet} </p>
                    </div>
                  ))
                }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      className={"conT"}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />

    </div>
  );
};

export default Collegue;
