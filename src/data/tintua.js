import React, { useState } from "react";
import { GrLocation, GrUser } from "react-icons/gr";
import { useStateContext } from '../contexts/ContextProvider';
import Popup from "../components/Popup";
import EmployeeForm from "../pages/Employees/EmployeeForm";
import * as employeeService from "../services/employeeService";
import { TbUserEdit } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { BsFillHouseAddFill } from "react-icons/bs";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { MdFolderDelete } from "react-icons/md";
import { BiSolidMessageSquareEdit } from "react-icons/bi";


const CurrColor = () => {
    const { currentColor } = useStateContext();
    return currentColor
}

const colorH = [
  'bg-slate-200',
  'bg-teal-200',
  'bg-cyan-200',
  'bg-sky-200',
  'bg-indigo-200',
];

function randomNumberInRange(min, max) {
  // 👇️ get number between min (inclusive) and max (inclusive)
  let rNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return colorH[rNum];
}

const gridEmployeeProfile = (props) => {
  
  const { API } = useStateContext();
  let hasNoImg = props?.image == "public/uploads/profiles/default.png";

    return (
    <div className="flex flex-row gap-2">
      <div className={`w-6 h-6 rounded-full ${hasNoImg ? randomNumberInRange(0,4) : ''} flex items-center justify-center`}>
        { hasNoImg ? <p className="py-1 px-2">{props?.nom[0] ?? 'C'}</p>
          :
          <img
            className="rounded-full"
            src={`${API.Local_Host_Name}/../storage/app/${props?.image ?? "public/uploads/profiles/default.png"}`}
            alt=""
          />
        }
      </div>

      <div className="flex flex-row items-center gap-2">
        <p className="truncate">{props?.nom ?? 'chargement...'}</p>
      </div>
    </div>
  )
}

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props?.lieu ?? 'Fada' }</span>
  </div>
);

const renderTime = (text) =>{
    let text2 = text?.split(':');
    let h = parseInt(text2[0])
    let mn = parseInt(text2[1])
    if (h > 7 ) {
        return '#FEC90F'
    }else if (h == 7 && mn > 30) {
        return '#FEC90F'
    }else {
        return '#8BE78B'
    }
}

const EmployeeGridStatus = (props) => (
    <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
      <p style={{ background: renderTime(props?.HeureA ?? '0:0') }} className="rounded-full h-3 w-3" />
      <p>{props?.HeureA}</p>
    </div>
  );


  const buttonDelete = (props, mode) => {
    const { UserR, setPoperPop, setType, setIsNewSortie } = useStateContext();
    const initial = {
      ordre: `${props.ordre}`,
      nom: `${props.nom}`,
      email: `${props.email}`,
      password: `${props.password}`,
      fonction: `${props.fonction}`,
      departement: `${props.departement}`,
      n1: props.n1,
      projet: props.projet,
      contrat_deb: props.contrat_deb,
      contrat_fin: props.contrat_fin,
      image: props.image,
      lieu: `${props.lieu}`,
    }
    const goTo = useNavigate();
   return (
   <div className="flex items-center justify-center py-2 gap-3">

    <TooltipComponent content={`Editer les informations de ${initial.nom}`}>
    <button
      // key={1}
      onClick={()=>{
        setPoperPop( true, initial, props.id );
        setType('edit');
        // console.warn(props.projet)
      }}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white p-1.5 rounded-lg ease-in-out delay-15 hover:scale-110"
    >
      <TbUserEdit size={20} />

    </button>
    </TooltipComponent>


    {UserR?.role == "admin" && mode != "rappel" && <TooltipComponent content={`Nouvelle Sortie de ${initial.nom}`}>
    <button
      // key={3}
      onClick={()=>{
        setPoperPop( false, initial, props.id );
        setIsNewSortie(true);
        // console.warn(props.id)
      }}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white p-1.5 rounded-lg ease-in-out delay-15 hover:scale-110"
    >
      <BsFillHouseAddFill size={20} />

    </button>
    </TooltipComponent>
    }

    <TooltipComponent content={`Supprimer ${initial.nom}`}>
    <button
      // key={2}
      onClick={()=>{
        setType('delete');
        setPoperPop( true, initial, props.id );
      }}
      type="button"
      style={{ background: '#FB9678' }}
      className="text-white p-1.5 rounded-lg transition ease-in-out delay-15 hover:scale-110"
    >
      <AiOutlineUserDelete size={20} />
    </button>
    </TooltipComponent>


    <TooltipComponent content={`Voir le calendrier de ${initial.nom}`}>
    <button
      onClick={()=>{
        setPoperPop( false, initial, props.id );
        goTo("/calendrier");
      }}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white p-1.5 rounded-lg ease-in-out delay-15 hover:scale-110"
    >
      <FaEye size={20} />

    </button>
    </TooltipComponent>
    
    </div>)
  }

  const actions = (props) => {
    const { setOpenSS, setActions } = useStateContext();
    const sorties = {
      sID: `${props.id}`,
      sNo: `${props.rang}`,
      sPro: `${props.Type}`,
      Nom: `${props.nom}`,
      HeureA: `${props.HeureA}`,
      HeureD: `${props.HeureD}`,
      Motifs: `${props.Observations}`,
    }
    const sortiesSuppr = {
      Nom: `${props.nom}`,
      sID: `${props.id}`,
      sNo: `${props.rang}`,
      sType: "suppr",
    }
   return (
   <div className="flex items-center justify-center py-2 gap-3">
    <button
      onClick={()=>{
        setActions(sorties);
        // setPoperPop( true, initial, props.id );
        // console.warn(Admin())
        // setType('edit');
      }}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white p-1.5 rounded-lg ease-in-out delay-15 hover:scale-110"
    >
      <FaEye size={20} />
    </button>

    <button
      onClick={()=>{
        setActions(sortiesSuppr);
        setOpenSS(true);
      }}
      type="button"
      style={{ background: '#FB9678' }}
      className="text-white p-1.5 rounded-lg transition ease-in-out delay-15 hover:scale-110"
    >
      <AiOutlineUserDelete size={20} />

    </button>
    
    </div>)
  }

  const paramsActions = (props) => {
    const { setParams, setParamsOpen } = useStateContext();
  
    const params= (m) => [{
      nom: `${props?.nom}`,
      id: `${props?.id}`,
      source: `${props?.source}`,
      desc: `${props?.desc}`,
      mode: m,
    }]
   return (
   <div className="flex items-center justify-center py-2 gap-3">
    <button
      onClick={()=>{
        setParams(params('edit'));
        console.log(params('edit'));
        setParamsOpen(true);
      }}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white p-1.5 rounded-lg ease-in-out delay-15 hover:scale-110"
    >
      <BiSolidMessageSquareEdit size={20} />
    </button>

    <button
      onClick={()=>{
        setParams(params('suppr'));
        console.log(params('suppr'))
        setParamsOpen(true);
      }}
      type="button"
      style={{ background: '#FB9678' }}
      className="text-white p-1.5 rounded-lg transition ease-in-out delay-15 hover:scale-110"
    >
      <MdFolderDelete size={20} />

    </button>
    
    </div>)
  }

  const gridNumProfile = (props) => (
    <div className="flex items-center justify-center py-2">
      <div className={`self-center w-6 h-6 rounded-md bg-sky-900 flex items-center justify-center`}>
        <p className="py-1 px-2 text-white">{props.rang ?? '0'}</p>
      </div>
    </div>
  );

  const joursRestants = (props) => (
    <button
    type="button"
    style={{ background: props?.jours >= 0 ? "rgb(254, 201, 15)" : "#FB9678"}}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {`${props?.jours} jours`}
  </button>
  );

  const profession = (props) => (
    <button
    type="button"
    style={{ background: props?.Type == 'Professionnel' ? "#1A237E" : "#FB9678"}}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props?.Type ?? 'Non Défini'}
  </button>
  );
 
export const TintuaEmployeesData = [
  {
    ordre: 1,
    nom: "Nancy Davolio SUPERVIS SUPER",
    fonction: "SUPERVISEUR",
    HeureA: "7:35",
    HeureD: "16:30",
    Observations: "RAS",
  },
  {
    ordre: 2,
    nom: "Nasimiyu Danai",
    fonction: "RRH",
    HeureA: "7:20",
    HeureD: "17:30",
    Observations: "RAS",
  },
  {
    ordre: 3,
    nom: "Iulia Albu",
    fonction: "LOGISTIQUE",
    HeureA: "6:20",
    HeureD: "19:00",
    Observations: "Banque",
  },
];

export const TintuaEmployeesGrid = [
  {
    field: "id",
    headerText: "id",
    width: "0",
    textAlign: "Center",
  },
  {
    field: "ordre",
    headerText: "Ordre",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "nom",
    headerText: "Nom et Prénoms de l'agent",
    template: gridEmployeeProfile,
    width: "240",
    textAlign: "Justify",
  },

  {
    field: "fonction",
    headerText: "Fonction",
    width: "100",
    textAlign: "Center",
  },
  {
    field: "lieu",
    headerText: "Lieu",
    width: "100",
    textAlign: "Center",
    template: gridEmployeeCountry,
  },

  {
    field: "Observations",
    headerText: "Actions",
    template: buttonDelete,
    width: "200",
    textAlign: "Center",
  },
];

export const TintuaRappelsGrid = [
  {
    field: "id",
    headerText: "id",
    width: "0",
    textAlign: "Center",
  },
  {
    field: "ordre",
    headerText: "Ordre",
    width: "0",
    textAlign: "Center",
  },

  {
    field: "nom",
    headerText: "Nom et Prénoms de l'agent",
    template: gridEmployeeProfile,
    width: "150",
    textAlign: "Justify",
  },

  {
    field: "fonction",
    headerText: "Fonction",
    width: "100",
    textAlign: "Center",
  },
  {
    field: "lieu",
    headerText: "Lieu",
    width: "100",
    textAlign: "Center",
    template: gridEmployeeCountry,
  },
  {
    field: "jours",
    headerText: "Restants",
    width: "100",
    textAlign: "Center",
    template: joursRestants,
  },

  {
    field: "Observations",
    headerText: "Actions",
    template: (e)=>buttonDelete(e, "rappel"),
    width: "150",
    textAlign: "Center",
  },
];

export const TintuaArriverGrid = [
  {
    field: "ordre",
    headerText: "Ordre",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "nom",
    headerText: "Nom et Prénoms de l'agent",
    template: gridEmployeeProfile,
    width: "200",
    textAlign: "Justify",
  },

  {
    field: "nom",
    width: "0",
    textAlign: "Center",
  },

  {
    field: "fonction",
    headerText: "Fonction",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "HeureA",
    headerText: "H. Arrivée",
    template: EmployeeGridStatus,
    width: "100",
    format: "yMd",
    textAlign: "Center",
  },

  {
    field: "HeureD",
    headerText: "H. Départ",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "Observations",
    headerText: "Observations",
    width: "100",
    textAlign: "Center",
  },
];

export const TintuaSortiesGrid = [
  {
    field: "rang",
    headerText: "N° Sortie",
    template: gridNumProfile,
    width: "100",
    textAlign: "Center",
  },

  {
    field: "nom",
    headerText: "Nom et Prénoms de l'agent",
    template: gridEmployeeProfile,
    width: "200",
    textAlign: "Center",
  },

  // {
  //   field: "fonction",
  //   headerText: "Fonction",
  //   width: "100",
  //   textAlign: "Center",
  // },

  {
    field: "HeureA",
    headerText: "H. Sortie",
    template: EmployeeGridStatus,
    width: "100",
    format: "yMd",
    textAlign: "Center",
  },

  {
    field: "HeureD",
    headerText: "H. Retour",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "Observations",
    headerText: "Motifs",
    width: "100",
    textAlign: "Center",
  },

  {
    field: "Type",
    headerText: "Type",
    template: profession,
    width: "120",
    textAlign: "Center",
  },

  {
    field: "fonction",
    headerText: "Actions",
    template: actions,
    width: "100",
    textAlign: "Center",
  },

];

export const ParamsGrid = (nom) => [
  {
    field: "id",
    headerText: "Id",
    width: "0",
    textAlign: "Center",
  },

  {
    field: "nom",
    headerText: nom ?? "Nom",
    // template: gridEmployeeProfile,
    width: "100",
    textAlign: "Justify",
  },

  {
    field: "id",
    headerText: "Action",
    // template: (e) => paramsActions(e),
    template: paramsActions,
    width: "50",
    textAlign: "Justify",
  },
];


const Poper = ({reffresher}) => {

  const [recordForEdit, setRecordForEdit] = useState(null);
  const { poper, setPoper, propsID, initialVal, type, API } = useStateContext();

  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0)
        employeeService.insertEmployee(employee)
    else
        employeeService.updateEmployee(employee)
    resetForm()
    setRecordForEdit(null)
}

  return (
    <Popup
      title={type == 'edit' ? `Modifier "${initialVal?.nom ?? ''}" ?` : `Supprimer "${initialVal?.nom ?? ''}" ?`}
      openPopup={poper}
      setOpenPopup={setPoper}
    >
      <EmployeeForm
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit} 
        refresh={reffresher}
        type={type}
        dataEdit={initialVal}
        id={propsID}
        close={setPoper}
      />
    </Popup>
  )

}

export default Poper;
