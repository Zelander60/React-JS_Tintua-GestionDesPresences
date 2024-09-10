import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { dropdownData, ExportMenu } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import React, { useEffect, useState } from 'react';

import { Header } from '../components';
import { loadCldr} from '@syncfusion/ej2-base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import API from '../constants/Api';
import { FaBusinessTime, FaUserClock, FaUserTie } from "react-icons/fa";
import { ColumnDirective, ColumnsDirective, ContextMenu, ExcelExport, GridComponent, Inject, Page, Search } from '@syncfusion/ej2-react-grids';
import { ParamsGrid, TintuaArriverGrid } from '../data/tintua';
import Popup from '../components/Popup';
import { FaBuildingUser, FaQuoteLeft } from 'react-icons/fa6';
import { BsPersonWorkspace } from 'react-icons/bs';
import { HiRectangleGroup } from "react-icons/hi2";
import { FiFolderPlus, FiUserPlus } from 'react-icons/fi';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Variables = () => {
  const { currentColor, API, AllDatas, Params, setParamsOpen, ParamsOpen, handleAllDatas, } = useStateContext();
  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
     );

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

//   const [dateTime, setDateTime] = useState('now');
  // const [data, setData] = useState([]);

  const [pOpen, setpOpen] = useState(false);
  const [Desc, setDesc] = useState('');
  const [PName, setPName] = useState('');
  const [PSource, setPSource] = useState('');

  const [AllD, setAllD] = useState({
    fonction: [],
    lieu: [],
    motif: [],
    service: [],
    departement: [],
  });

  useEffect(() => {
    if (Params[0]?.nom != '' && Params[0]?.nom != null) {
      setPName(Params[0]?.nom);
    }
  }, [Params[0]?.nom])

  useEffect(() => {
    if (AllDatas.lieu != undefined && AllDatas.lieu != null) {
      setAllD(AllDatas);
    }
  }, [AllDatas])
  

  const fetchPresence = async (act) => {
      const id = toast.loading('En cours ...',{isLoading: true});
            // setIsLoading(true);
        // console.log(currentColor)

        await fetch(`${API.Local_Host_Name}/api/params`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
    
                body: JSON.stringify({
                  mode: act,
                  nom: PName,
                  id: Params[0]?.id,
                  source: act == 'add' ? PSource : Params[0]?.source,
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
                    toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                    // setIsLoading(false);
                    console.warn(`${responseJson}`);
                    // console.log(new Date())
                    
                  } else{
                    toast.success(`${responseJson?.message}`);
                    const params = responseJson?.params;
                    handleAllDatas('hard',{
                      fonction: params?.fonction ?? [],
                      lieu: params?.lieu ?? [],
                      motif: params?.motif ?? [],
                      service: params?.service ?? [],
                      departement: params?.departement ?? [],
                    });
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

  const earningData = [
    {
      icon: <FaUserClock />,
      amount: AllD?.fonction?.length ?? '...',
      data: AllD?.fonction ?? [],
      title: 'Fonction(s)',
      iconColor: '#fff',
      iconBg: '#1A97F5',
      desc: 'Fonction',
      source: 'liste_fonctions',
      pcColor: 'red-600',
    },
    {
      icon: <FaBuildingUser />,
      amount: AllD?.lieu?.length ?? '...',
      data: AllD?.lieu ?? [],
      title: 'Lieu(x)',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#03C9D7',
      desc: 'Lieu',
      source: 'liste_lieux',
      pcColor: 'green-600',
    },
    {
      icon: <FaQuoteLeft />,
      amount: AllD?.motif?.length ?? '...',
      data: AllD?.motif ?? [],
      title: 'Motif(s)',
      iconColor: '#fff',
      iconBg: '#7352FF',
      desc: 'Motif',
      source: 'liste_motifs',
      pcColor: 'green-600',
    },
    {
      icon: <BsPersonWorkspace />,
      amount: AllD?.service?.length ?? '...',
      data: AllD?.service ?? [],
      title: 'Service(s)',
      iconColor: '#fff',
      iconBg: '#1E4DB7',
      desc: 'Service',
      source: 'liste_projets',
      pcColor: 'green-600',
    },
    {
      icon: <HiRectangleGroup />,
      amount: AllD?.departement?.length ?? '...',
      data: AllD?.departement ?? [],
      title: 'Département(s)',
      iconColor: '#fff',
      iconBg: '#7352FF',
      desc: 'Département',
      source: 'liste_departements',
      pcColor: 'green-600',
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Variables" />
      <div className="grid grid-cols-2 lg:flex-nowrap justify-center ">
        
        {/* <div className="flex m-3 flex-wrap justify-center gap-1 items-center"> */}
          {earningData.map((item) => (
            <div key={item?.title} className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 m-2 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item?.iconColor, backgroundColor: item?.iconBg }}
                className="text-2xl opacity-0.9 rounded-full ml-1 p-4 hover:drop-shadow-xl"
              >
                {item?.icon}
              </button>

              <div className='flex flex-row gap-6'>
                <p className="mt-3 ml-1">
                  <span className=" text-base font-semibold">{item?.title}</span>
                </p>
                <button
                  onClick={()=>{
                    setDesc(item?.desc);
                    setPName('');
                    setPSource(item?.source);
                    setpOpen(true);
                  }}
                  type="button"
                  style={{ background: currentColor }}
                  className="text-white flex items-center justify-center sm:gap-1 md:gap-4 flex-row p-2 py-3 capitalize rounded-2xl text-md transition ease-in-out delay-15 hover:scale-110"
                >
                  <FiFolderPlus size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-400 ml-1 mt-1">{item?.amount}</p>
              <div className="relative mt-2 p-2 md:p-10 bg-gray-50 rounded-2xl">
                {/* <Header category="Page" title="Liste d' Arrivées" /> */}
                <GridComponent
                  // key={item?.source}
                  dataSource={item?.data}
                  width="auto"
                  allowPaging
                  allowSorting
                  allowResizing
                  textWrapSettings={{wrapMode:"Content"}}
                  pageSettings={{ pageSize: 5,  }}
                  editSettings={editing}
                  // toolbar={toolbarOptions}
                  // contextMenuItems={ExportMenu}
                  // allowExcelExport
                >
                  <ColumnsDirective>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    {/* {ParamsGrid(item?.title, item?.source, item?.desc).map((itemP, index) => <ColumnDirective key={index} {...itemP} />)} */}
                    {ParamsGrid(item?.title).map((itemP, index) => <ColumnDirective key={index} {...itemP} />)}
                    {/* {TintuaArriverGrid.map((itemP, index) => <ColumnDirective key={index} {...itemP} />)} */}
                  </ColumnsDirective>
                  <Inject services={[ContextMenu]} />

                </GridComponent>
              </div>
            </div>
          ))}
        </div>
      {/* </div> */}

      <Popup
        title={Params[0]?.mode == 'suppr' ? `Supprimer ${Params[0]?.nom} de ${Params[0]?.desc} ?  ` : `Modifier ${Params[0]?.nom} dans ${Params[0]?.desc}  ?  `}
        openPopup={ParamsOpen}
        setOpenPopup={setParamsOpen}
      >
        {Params[0]?.mode == 'suppr' ? 
        <div className='flex flex-row self-end justify-between gap-4'>
          <button
            type="button"
            onClick={()=>{
              fetchPresence('suppr');
              setParamsOpen(false);
            }}
            style={{ background: currentColor,}}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            OUI
          </button>
          <button
            type="button"
            onClick={()=>setParamsOpen(false)}
            style={{ background: "#FF5C8E",}}
            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            NON
          </button>
        </div> : 
        <div className='flex flex-col gap-5'>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="obs" className="block text-sm font-medium leading-6 text-gray-900">
              {Desc ?? '...'}
            </label>
          </div>
          <div className="mt-2">
            <input
              id="mode"
              name="mode"
              type="text"
              autoComplete="name"
              required
              value={PName}
              placeholder={Desc?.toLowerCase()}
              onChange={(e)=>setPName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className='flex flex-row self-end justify-between gap-4'>
          <button
            type="button"
            onClick={()=>{
              fetchPresence('edit');
              setParamsOpen(false);
            }}
            style={{ background: currentColor,}}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={()=>setParamsOpen(false)}
            style={{ background: "#FF5C8E",}}
            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Annuler
          </button>
        </div>

      </div>
        }
      </Popup>

      <Popup
        title={`Ajouter dans ${Desc} ?  `}
        openPopup={pOpen}
        setOpenPopup={setpOpen}
      >
        <div className='flex flex-col gap-5'>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="obs" className="block text-sm font-medium leading-6 text-gray-900">
                {Desc ?? '...'}
              </label>
            </div>
            <div className="mt-2">
              <input
                id="mode"
                name="mode"
                type="text"
                autoComplete="name"
                required
                value={PName}
                placeholder={Desc?.toLowerCase()}
                onChange={(e)=>setPName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className='flex flex-row self-end justify-between gap-4'>
            <button
              type="button"
              onClick={()=>{
                fetchPresence('add');
                setpOpen(false);
              }}
              style={{ background: currentColor,}}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={()=>setpOpen(false)}
              style={{ background: "#FF5C8E",}}
              className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Annuler
            </button>
          </div>

        </div>
      </Popup>

      <ToastContainer
      position="top-right"
      className={"conZ"}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" />

    </div>
  );
};

export default Variables;
