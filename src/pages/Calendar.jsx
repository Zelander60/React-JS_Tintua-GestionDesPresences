import React, { useState, useRef } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Month, Agenda,ExcelExport, Inject, Resize } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { loadCldr} from '@syncfusion/ej2-base';
// import * as numberingSystems from '../numberingSystems.json';
// import * as gregorian from '../ca-gregorian.json';
// import * as numbers from '../numbers.json';
// import * as timeZoneNames from '../timeZoneNames.json';

// eslint-disable-next-line react/destructuring-assignment
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
     );

  const scheduleObj = useRef(null);

  // const [scheduleObj2, setscheduleObj2] = useState()

  const change = (args) => {
    scheduleObj.current.selectedDate = args.value;
    /* eslint-disable no-console */
    // console.log(scheduleObj.current);
    scheduleObj.current.dataBind();
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
const onExportClick = () => {
  let customFields = [
    { name: 'Id', text: 'N° d’ordre' },
    { name: 'Subject', text: 'Nom et prénoms de l’agent' },
    { name: 'StartTime', text: "Heure d'arrivée" },
    { name: 'EndTime', text: 'Heure de départ' },
    { name: 'Location', text: 'Lieu' },
    { name: 'OwnerId', text: 'Owners' }
];
let exportValues = { fieldsInfo: customFields, fileName: "Feuille de Ouoba" };
  scheduleObj.current.exportToExcel(exportValues);
}

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={scheduleObj}
        selectedDate={new Date(2021, 0, 10)}
        eventSettings={{ dataSource: scheduleData }}
        dragStart={onDragStart}
        cssClass='excel-export'
        actionBegin={onActionBegin}
        locale="fr-CH"
      >
        <ViewsDirective>
          { ['Day', 'Month', 'Agenda', 'ExcelExport'].map((item) => <ViewDirective key={item} option={item} />)}
        </ViewsDirective>
        <Inject services={[Day, Month, ExcelExport, Agenda, Resize]} />
      </ScheduleComponent>
      <PropertyPane>
        <table
          style={{ width: '100%', background: 'white' }}
        >
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={new Date(2021, 0, 10)}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                  format='dd/MM/yyyy'
                  locale='fr-CH'
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;
