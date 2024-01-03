import React, {useEffect, useState} from 'react';
import { GridComponent, Inject, ExcelExport, ContextMenu, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { employeesData, employeesGrid, ExportMenu } from '../data/dummy';
import { TintuaArriverGrid, TintuaEmployeesData, } from '../data/tintua';
import { Header } from '../components';
import useFetch from '../hooks/useFetch';
import { loadCldr} from '@syncfusion/ej2-base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../constants/Api';

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Employees = () => {

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
  );

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  const [dateTime, setDateTime] = useState('date');
  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [ok, setOK] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresence = async () => {
      const id = toast.loading('En cours ...',{isLoading: true})
            // setIsLoading(true);
            // console.info(query)
        await fetch(`${API.Local_Host_Name}/api/presences/jour/${dateTime}`, {
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
                    toast.warn(`${responseJson?.message}`);
                    // setIsLoading(false);
                    console.warn(`${responseJson}`);
                    setData(responseJson);
                    // console.log(new Date())
                    
                  } else{
                    // setIsLoading(false);
                    setData(responseJson);
                    toast.success(`${responseJson?.message}`);
                    // toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                    // setOK(true);
                    console.log(responseJson)
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
    fetchPresence();
  }, [dateTime])

  const change = (args) => {
    /* eslint-disable no-console */
    let fresh2 = "";
    let fresh = (args.value).toLocaleDateString();
    fresh2 = (args.value).toString();
    let take = fresh2.split(" ");
    let date = fresh.replace(/\//gi, '-');
    let ba = `${take[1]}${take[3]}`
    let base = ba.toLowerCase();
    console.log(`${date}.${base}`);
    setDateTime(`${date}.${base}`);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Présences" />
      <PropertyPane>
        <table
          style={{ width: '30%', background: 'white' }}
        >
          <tbody>
            <tr style={{ height: '70px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  // value={new Date()}
                  showClearButton={false}
                  placeholder="Choisir une Date"
                  floatLabelType="Always"
                  change={change}
                  locale='fr-CH'
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
      <GridComponent
        dataSource={data.data}
        width="auto"
        allowPaging
        allowSorting
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
  );
};
export default Employees;
