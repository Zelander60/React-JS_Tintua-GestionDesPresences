import React from "react";
import { GrLocation, GrUser } from "react-icons/gr";
import avatar3 from "./avatar3.png";
import avatar4 from "./avatar4.jpg";
import { useStateContext } from '../contexts/ContextProvider';

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

const gridEmployeeProfile = (props) => (
  <div className="flex flex-row gap-2">
    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
      <p className="py-1 px-2">{props?.nom[0] ? props?.nom[0] : 'C'}</p>
    </div>

    <div className="flex flex-row items-center gap-2">
      <p className="truncate">{props?.nom ? props?.nom : 'chargement...'}</p>
    </div>
  </div>
);

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props?.lieu ? props?.lieu : 'Fada' }</span>
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
      <p style={{ background: renderTime(props?.HeureA ? props?.HeureA : '0:0') }} className="rounded-full h-3 w-3" />
      <p>{props?.HeureA}</p>
    </div>
  );

  const buttonDelete = (props) => (
    <div className="flex flex-col gap-3">
    <button
      onClick={()=>console.log(props.ordre)}
      type="button"
      style={{ background: CurrColor() }}
      className="text-white w-1/2 py-1 capitalize rounded-2xl text-md"
    >
      {'Editer'}
    </button>

    <button
      onClick={()=>console.log(props.ordre)}
      type="button"
      style={{ background: '#FB9678' }}
      className="text-white w-2/3 py-1 capitalize rounded-2xl text-md"
    >
        {'Supprimer'}
    </button>
    </div>
  )

export const TintuaEmployeesData = [
  {
    Ordre: 1,
    Name: "Nancy Davolio SUPERVIS SUPER",
    Fonction: "SUPERVISEUR",
    HeureA: "7:35",
    HeureD: "16:30",
    Lieu: "Diapaga",
    Observations: "RAS",
    EmployeeImage: avatar3,
  },
  {
    Ordre: 2,
    Name: "Nasimiyu Danai",
    Fonction: "RRH",
    HeureA: "7:20",
    HeureD: "17:30",
    Lieu: "Fada",
    Observations: "RAS",
    EmployeeImage: avatar3,
  },
  {
    Ordre: 3,
    Name: "Iulia Albu",
    Fonction: "LOGISTIQUE",
    HeureA: "6:20",
    HeureD: "19:00",
    Lieu: "Ouaga",
    Observations: "Banque",
    EmployeeImage: avatar4,
  },
];

export const TintuaEmployeesGrid = [
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
    field: "fonction",
    headerText: "Fonction",
    width: "auto",
    textAlign: "Center",
  },

  {
    field: "HeureA",
    headerText: "Heure d'arrivée",
    template: EmployeeGridStatus,
    width: "auto",
    format: "yMd",
    textAlign: "Center",
  },

  {
    field: "HeureD",
    headerText: "Heure de départ",
    width: "auto",
    textAlign: "Center",
  },

  {
    field: "lieu",
    headerText: "Lieu",
    width: "auto",
    textAlign: "Center",
    template: gridEmployeeCountry,
  },

  {
    field: "Observations",
    headerText: "Observations",
    template: buttonDelete,
    width: "auto",
    textAlign: "Center",
  },
];
