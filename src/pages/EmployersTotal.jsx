import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ExcelExport, ContextMenu, ColumnsDirective, ColumnDirective, Search, Page, Filter,Toolbar } from '@syncfusion/ej2-react-grids';

import { employeesData, employeesGrid, ExportMenu } from '../data/dummy';
import Poper, { TintuaEmployeesData, TintuaEmployeesGrid } from '../data/tintua';
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



const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

export const Rendre= (action) =>{
  // const [open, setOpen] = useState(false)
  console.log(action)
  return action ?? false
}

const EmployersTotal = () => {

  const { currentColor, type, setType, setPoper, API, initialVal, isNewSortie, setIsNewSortie, propsID } = useStateContext();

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  // const [op, setOp] = useState(false);

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  const { data, isLoading, refetch, Fragment} = useFetch(
    'employers',
    'GET'
  );

  const change = (args) => {
    /* eslint-disable no-console */
    console.log(args.value);
  };

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
      <Fragment/>
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

      <Poper
        reffresher={refetch}
      />

            <Popup
              title="Formulaire"
              openPopup={modalIsOpen}
              setOpenPopup={setModalIsOpen}
            >
                <EmployeeForm
                  recordForEdit={recordForEdit}
                  addOrEdit={addOrEdit} 
                  refresh={refetch}
                  type={type}
                  dataEdit={null}
                  id={0}
                  close={setPoper}
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
