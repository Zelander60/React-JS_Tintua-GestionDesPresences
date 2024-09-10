import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ExcelExport, ContextMenu, ColumnsDirective, ColumnDirective, Search, Page, Filter,Toolbar } from '@syncfusion/ej2-react-grids';

import { employeesData, employeesGrid, ExportMenu } from '../data/dummy';
import Poper, { TintuaEmployeesData, TintuaEmployeesGrid, TintuaRappelsGrid } from '../data/tintua';
import { Header } from '../components';
import useFetch from '../hooks/useFetch';
import { loadCldr} from '@syncfusion/ej2-base';
import { Puff } from  'react-loader-spinner'
import { useStateContext } from '../contexts/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyFormModal from '../components/MyFormModal';
import { FiUserPlus } from "react-icons/fi";
import Popup from '../components/Popup';
import EmployeeForm from './Employees/EmployeeForm';
import * as employeeService from "../services/employeeService";
import MiniSortiesNew from './MiniSortiesNew';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { RiNotification3Line } from 'react-icons/ri';



// const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

export const Rendre= (action) =>{
  // const [open, setOpen] = useState(false)
  console.log(action)
  return action ?? false
}

const EmployersTotal = () => {

  const { currentColor, type, setType, setPoper, poper, API, initialVal, isNewSortie, setIsNewSortie, propsID, handleAllDatas } = useStateContext();

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openRappels, setOpenRappels] = useState(false);
  const [checkRappel, setCheckRappel] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  // const [op, setOp] = useState(false);..
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  // const { data, isLoading, refetch, Fragment} = useFetch(
  //   'employers',
  //   'GET'
  // );

  const fetchPresence = async () => {
      const id = toast.loading('En cours ...',{isLoading: true});
      setIsLoading(true);
      await fetch(`${API.Local_Host_Name}/api/employers`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })
            .then(response => {
              if (!response.ok) {

                toast.error('Vérifiez votre connexion !');
              }
              return response.json();
            })
              .then((responseJson) => {
                //Showing response message coming from server
                if (responseJson?.status !== 200) {
                  toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                  console.warn(`${responseJson}`);
                  
                } else{
                  const empDatas = responseJson?.employers.map((val)=>({
                    ordre: val.ordre,
                    nom: val.nom
                  }));
                  handleAllDatas('employers', empDatas);
                  
                  setData(responseJson);
                }
              })
              .catch(errors => {  
                toast.error("Une erreure est survenue !");
                console.warn(errors);
              })
              .finally(()=>{
                setIsLoading(false);
                toast.dismiss(id);
              });
    }

  useEffect(() => {
    fetchPresence();
    
  }, [])
  

  useEffect(() => {
    if (data?.rappels?.length > 0 && !checkRappel) {
      setOpenRappels(true)
      setCheckRappel(true)
    }
  }, [data])

  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0)
        employeeService.insertEmployee(employee)
    else
        employeeService.updateEmployee(employee)
    resetForm()
    setRecordForEdit(null)
    setModalIsOpen(false)
    setRecords(employeeService.getAllEmployees())
}

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

      <div className='flex flex-row justify-between items-center pb-4'>
        <Header category="Page" title="Liste des Employés" />

        <div className='flex gap-4 flex-row justify-between items-center'>
          <TooltipComponent content={'Rappels'}>
            <button
              type="button"
              onClick={() => setOpenRappels(true)}
              style={{ color: currentColor }}
              className="relative text-xl rounded-full p-3 hover:bg-light-gray"
            >
              <span
                style={{ background: "rgb(254, 201, 15)", color: "white" }}
                className="absolute text-xs items-center justify-center inline-flex rounded-full h-4 w-4 right-2 top-1"
              >
              {data?.rappels?.length ?? 0}
              </span>
              {data?.critique > 0 ? <span
                style={{ background: "#FB9678", color: "white" }}
                className="absolute text-xs items-center justify-center inline-flex rounded-full h-4 w-4 -right-1 top-1"
              >
              {data?.critique ?? 0}
              </span> : ''}
              <RiNotification3Line />
            </button>
          </TooltipComponent>
          <button
            onClick={()=>{
              setModalIsOpen(true)
              setType('add')
            }}
            type="button"
            style={{ background: currentColor }}
            className="text-white flex items-center justify-center sm:gap-1 md:gap-4 flex-row p-2 py-3 capitalize rounded-2xl text-md transition ease-in-out delay-15 hover:scale-110"
          >
            <FiUserPlus size={20} />
            Ajouter
          </button>
        </div>
      </div>

      <Puff
        height="80"
        width="80"
        radius={10}
        color={currentColor}
        ariaLabel="puff-loading"
        wrapperStyle={{position: 'absolute', zIndex: 2, left: '50%' }}
        wrapperClass="m-2 md:m-10 mt-24 animate-ping p-2 md:p-10 bg-slate-50 shadow-2xl rounded-3xl"
        visible={isLoading}
      />

      <GridComponent
        dataSource={data?.employers}
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
          {TintuaEmployeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Toolbar,Search, Page, ExcelExport, ContextMenu, Filter]} />

      </GridComponent>
      {/* <Fragment/> */}

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
        theme="colored" 
      />

            {/* <Poper
              reffresher={refetch}
            /> */}

            <Popup
              title={type == 'edit' ? `Modifier "${initialVal?.nom ?? ''}" ?` : `Supprimer "${initialVal?.nom ?? ''}" ?`}
              openPopup={poper}
              setOpenPopup={setPoper}
            >
              <EmployeeForm
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit} 
                refresh={fetchPresence}
                type={type}
                dataEdit={initialVal}
                id={propsID}
                close={setPoper}
              />
            </Popup>

            <Popup
              title="Rappels"
              openPopup={openRappels}
              setOpenPopup={setOpenRappels}
            >
              <GridComponent
                dataSource={data?.rappels}
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
                  {TintuaRappelsGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
                </ColumnsDirective>
                <Inject services={[Toolbar,Search, Page, ExcelExport, ContextMenu, Filter]} />

              </GridComponent>
            </Popup>

            <Popup
              title="Formulaire d'ajout"
              openPopup={modalIsOpen}
              setOpenPopup={setModalIsOpen}
            >
                <EmployeeForm
                  recordForEdit={recordForEdit}
                  addOrEdit={addOrEdit}
                  refresh={fetchPresence}
                  type={type}
                  dataEdit={null}
                  id={0}
                  close={setModalIsOpen}
                />
            </Popup>

            <Popup
              title={`Nouvelle sortie de "${initialVal?.nom ?? ''}" ?`}
              openPopup={isNewSortie}
              setOpenPopup={setIsNewSortie}
            >
              <MiniSortiesNew API={API} iid={propsID} initial={initialVal} active={setIsNewSortie} color={currentColor}/>
            </Popup>

    </div>
  );
};
export default EmployersTotal;
