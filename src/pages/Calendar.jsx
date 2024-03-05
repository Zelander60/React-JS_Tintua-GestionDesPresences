import React, { useState, useRef, useEffect } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Month, Agenda,ExcelExport, Inject, Resize } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent, DateTimePicker, TimePickerComponent } from '@syncfusion/ej2-react-calendars';

import { Ajax, loadCldr, L10n} from '@syncfusion/ej2-base';
import { FaCalendarAlt, FaUserTie, FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { useStateContext } from '../contexts/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import API from '../constants/Api';
import { NavLink } from 'react-router-dom';
import { localJSON } from './locale';
import Controls from '../components/controls/Controls';
import MiniForm from './MiniForm';

// eslint-disable-next-line react/destructuring-assignment
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
  );

// let localeTexts;
// let ajax = new Ajax(localJSON, 'GET', false);
// ajax.onSuccess = (value) => {
//     localeTexts = value;
//     console.log(value);
// };
// ajax.send();
L10n.load(localJSON);

  const scheduleObj = useRef(null);

  const [DateForm, setDateForm] = useState('auto');


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
    setDateForm(`${date}.${base}`);
  };

  const onDragStart = (arg) => {
    // eslint-disable-next-line no-param-reassign
    arg.navigation.enable = true;
  };

  const onActionBegin = (args) => {
    if (args.requestType === 'toolbarItemRendering') {
        let exportItem = {
            align: 'Right', showTextOn: 'Both', prefixIcon: 'e-icon-schedule-excel-export',
            text: 'Excel Export', cssClass: 'e-excel-export', click: onExportClick
        };
        args.items.push(exportItem);
    }
}

const { UserR, currentColor, propsID, initialVal, API } = useStateContext();

const onExportClick = () => {
  let customFields = [
    // { name: 'Id', text: 'N° d’ordre' },
    { name: 'Subject', text: 'Observations' },
    { name: 'StartTime', text: "Heure d'arrivée" },
    { name: 'EndTime', text: 'Heure de départ' },
    { name: 'Location', text: 'Lieu' },
    // { name: 'OwnerId', text: 'Owners' }
];
let exportValues = { fieldsInfo: customFields, fileName: initialVal?.nom ?? 'Inconnu' };
  scheduleObj.current.exportToExcel(exportValues);
}

const [dateTime, setDateTime] = useState('now');
const [data, setData] = useState([]);

const [autres, setAutres] = useState(false);

const changeAutres = (e) => {
  setAutres(!autres);
  // console.log(e.target.value);
}

const fetchPresence = async () => {
  const id = toast.loading('En cours ...',{isLoading: true})
        // setIsLoading(true);
        // console.info(propsID)
        const pID = propsID == 0 ? 0 : propsID;
    await fetch(`${API.Local_Host_Name}/api/presences/month/${pID ?? 0}/${dateTime}`, {
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
                if(responseJson?.jours == 0){
                  toast.warn("Aucune Présence !");
                }else{
                  toast.success(`${responseJson?.message}`);
                }
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

useEffect(() => {
  fetchPresence();
}, [dateTime])

const percent = (e) => {
  let pourcent = (parseInt(e) * 100) / 30;
  return pourcent.toFixed();
}

const earningData = [
  {
    icon: <FaUserTie />,
    amount: initialVal?.nom ?? ( UserR?.role != '' ? 'Retournez, puis sélectionnez un employé.' : (UserR?.nom ?? 'Employé')),
    percentage: '',
    title: '0',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    pcColor: 'red-600',
  },
  {
    icon: <FaBriefcase />,
    amount: initialVal?.fonction ?? ( UserR?.role != '' ? 'Employé' : (UserR?.fonction ?? 'Employé') ),
    percentage: '',
    title: '1',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: '#1A97F5',
    pcColor: 'green-600',
  },
  {
    icon: <FaCalendarAlt />,
    amount: `${data?.jours ?? 0} ${(data?.jours ?? 0) > 1 ? 'jours' : 'jour'}`,
    percentage: `~${percent(data?.jours ?? 0)}%`,
    title: '2',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
    pcColor: 'green-600',
  },
  {
    icon: <FaCalendarAlt />,
    amount: `${data?.absencesJ ?? 0} Abs. just.`,
    percentage: `~${percent(data?.absencesJ ?? 0)}%`,
    title: '3',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
    pcColor: 'green-600',
  },
  {
    icon: <FaCalendarAlt />,
    amount: `${data?.absencesN ?? 0} Abs. non just.`,
    percentage: `~${percent(data?.absencesN ?? 0)}%`,
    title: '4',
    iconColor: 'rgb(228, 106, 118)',
    iconBg: 'rgb(255, 244, 229)',
    pcColor: 'red-600',
  },
];

const chge = (args) => {
    /* eslint-disable no-console */
    let fresh2 = "";
    // let fresh = (args.currentDate).toLocaleDateString();
    fresh2 = (args.currentDate).toString();
    let take = fresh2.split(" ");
    // let date = fresh.replace(/\//gi, '-');
    let ba = `${take[1]}${take[3]}`
    let base = ba.toLowerCase();
    console.log(base);
    setDateTime(base);
}

function onEventRendered(args) {

  let categoryColor = args.data.CategoryColor;

  args.element.style.backgroundColor = categoryColor;

}

  return (
    <div className="m-2 md:m-10 mt-20 p-2 md:p-10 bg-white rounded-3xl">
      {/* <Header category="App" title="Calendrier" /> */}

      {/* <div className="flex flex-wrap lg:flex-nowrap justify-center "> */}

      {/* </div> */}

      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        
            {/* <div className="flex w-10 flex-col bg-gray-50 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-10 rounded-2xl "> */}
              { UserR?.role != '' && <NavLink
                to={"/listeEmployes"}
                type="button"
                style={{ color: 'rgb(255, 244, 229)', backgroundColor: currentColor ?? '#1A97F5' }}
                className="flex items-center justify-center opacity-0.9 rounded-full h-4 p-4 hover:drop-shadow-xl"
              >
                <FaArrowLeft size={20}/>
              </NavLink>}
            {/* </div> */}

        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div key={item.title} className="flex flex-col bg-gray-50 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 gap-4 p-4 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="flex justify-center text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="flex justify-center mt-0.5">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              {/* <p className="text-sm text-gray-400 mt-1">{item.title}</p> */}
            </div>
          ))}
        </div>
      </div>

      <ScheduleComponent
        height="650px"
        ref={scheduleObj}
        // selectedDate={}
        eventSettings={{ dataSource: data?.data }}
        dragStart={onDragStart}
        cssClass='excel-export'
        actionBegin={onActionBegin}
        navigating={chge}
        eventRendered={onEventRendered}
        locale="fr-CH"
      >
        <ViewsDirective>
          { ['Month', 'Agenda', 'ExcelExport'].map((item) => <ViewDirective key={item} option={item} />)}
        </ViewsDirective>
        <Inject services={[Month, ExcelExport, Agenda, Resize]} />
      </ScheduleComponent>

      { UserR?.role == "admin" && <PropertyPane>
        <table
          style={{ width: '100%', background: 'white' }}
        >
          <tbody>
            <tr style={{ height: 'auto' }} className='flex flex-col md:flex-row'>
              <td style={{ width: '25%' }}>
                {!autres && <><DatePickerComponent
                  // value={new Date()}
                  showClearButton={false}
                  placeholder="Choisir une Date"
                  floatLabelType="Always"
                  change={change}
                  locale='fr-CH'
                />
                <div className='h-0.5 mb-4 rounded-full' style={{backgroundColor: currentColor}}></div></>}
                <Controls.Checkbox
                        name="isPermanent"
                        label="Autres évènements"
                        value={autres}
                        onChange={changeAutres}
                    />
              </td>
              <td style={{ width: '75%',alignItems: 'center', justifyContent: 'center' }}>
                <MiniForm API={API} isAutres={autres} refresh={fetchPresence} ID={propsID} date={DateForm} color={currentColor}/>
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
      }
            
      <ToastContainer
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
      theme="colored" />

    </div>
  );
};

export default Scheduler;
