const KEYS = {
    employees: 'employees',
    employeeId: 'employeeId'
}

export const getDepartmentCollection = () => ([
    { id: 'RRH', title: 'RRH' },
    { id: 'Comptabilité', title: 'Comptabilité' },
    { id: 'Coordo SAME', title: 'Coordo SAME' },
    { id: 'Assistant RH', title: 'Assistant RH' },
    { id: 'Assistant Comptabilité', title: 'Assistant Comptabilité' },
    { id: 'Assistant Coordo SAME', title: 'Assistant Coordo SAME' },
    { id: 'Assistant CC&SE', title: 'Assistant CC&SE' },
    { id: 'Stagiaire RH', title: 'Stagiaire RH' },
    { id: 'Stagiaire Comptabilité', title: 'Stagiaire Comptabilité' },
    { id: 'Employé', title: 'Employé' },
])

export function insertEmployee(data) {
    let employees = getAllEmployees();
    data['id'] = generateEmployeeId()
    employees.push(data)
    localStorage.setItem(KEYS.employees, JSON.stringify(employees))
}

export function updateEmployee(data) {
    let employees = getAllEmployees();
    let recordIndex = employees.findIndex(x => x.id == data.id);
    employees[recordIndex] = { ...data }
    localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId() {
    if (localStorage.getItem(KEYS.employeeId) == null)
        localStorage.setItem(KEYS.employeeId, '0')
    var id = parseInt(localStorage.getItem(KEYS.employeeId))
    localStorage.setItem(KEYS.employeeId, (++id).toString())
    return id;
}

export function getAllEmployees() {
    if (localStorage.getItem(KEYS.employees) == null)
        localStorage.setItem(KEYS.employees, JSON.stringify([]))
    let employees = JSON.parse(localStorage.getItem(KEYS.employees));
    //map departmentID to department title
    let departments = getDepartmentCollection();
    return employees.map(x => ({
        ...x,
        department: departments[x.departmentId - 1].title
    }))
}