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

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Accueil = () => {
  const { currentColor, API } = useStateContext();
  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
     );

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

//   const [dateTime, setDateTime] = useState('now');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPresence = async () => {
    //   const id = toast.loading('En cours ...',{isLoading: true})
            // setIsLoading(true);
            // console.info(query)
        await fetch(`${API.Local_Host_Name}/api/presences/now/infos`, {
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
                //   toast.dismiss(id);
                  // setIsLoading(false);
                });
    }
    fetchPresence();
    const interval = setInterval(()=>
        fetchPresence(),
        5000
    );

    return ()=> clearInterval(interval);
  }, [])

  const today = new Date();
  function getDate() {
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    console.log(currentColor)
    return `${date}/${month}/${year}`;
  }

  const earningData = [
    {
      icon: <FaUserClock />,
      amount: data?.data?.arrives ?? '...',
      percentage: ' ',
      title: 'Arrivée(s)',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <FaUserTie />,
      amount: data?.data?.employers ?? '...',
      percentage: '+ 0%',
      title: 'Employés',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#1A97F5',
      pcColor: 'green-600',
    },
    {
      icon: <FaBusinessTime />,
      amount: `${today.getHours()}h ${today.getMinutes()}mn`,
      percentage: `${today.getSeconds()}s`,
      title: getDate(),
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
  
      pcColor: 'green-600',
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

  return (
    <div className="mt-20 sm:mt-3">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className=" text-base font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          
        </div>
        
      </div>

      <div className="m-2 md:m-4 p-2 md:p-10 bg-white rounded-3xl">
      {/* <Header category="Page" title="Liste d' Arrivées" /> */}
      <GridComponent
        dataSource={data?.data?.presences}
        width="auto"
        allowPaging
        allowSorting
        allowResizing
        textWrapSettings={{wrapMode:"Content"}}
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        contextMenuItems={ExportMenu}
        allowExcelExport
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {TintuaArriverGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page, ExcelExport, ContextMenu]} />

      </GridComponent>
      <ToastContainer
      position="top-right"
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

    </div>
  );
};

export default Accueil;
