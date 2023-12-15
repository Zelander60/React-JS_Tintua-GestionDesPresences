import React from 'react';
import { GridComponent, Inject, ExcelExport, ContextMenu, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { employeesData, employeesGrid, ExportMenu } from '../data/dummy';
import { TintuaEmployeesData, TintuaEmployeesGrid } from '../data/tintua';
import { Header } from '../components';
import useFetch from '../hooks/useFetch';
import { loadCldr} from '@syncfusion/ej2-base';

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const EmployersTotal = () => {

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/fr-CH/ca-gregorian.json'),
    require('cldr-data/main/fr-CH/numbers.json'),
    require('cldr-data/main/fr-CH/timeZoneNames.json')
     );

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  const { data, isLoading, error, ok } = useFetch(
    'index.php',
    'GET'
  );

  const change = (args) => {
    /* eslint-disable no-console */
    console.log(args.value);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Liste des Employés" />
      <GridComponent
        dataSource={data}
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
          {TintuaEmployeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page, ExcelExport, ContextMenu]} />

      </GridComponent>
    </div>
  );
};
export default EmployersTotal;
