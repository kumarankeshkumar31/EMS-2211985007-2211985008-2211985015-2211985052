import React from 'react'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './components/AdminDashBoard/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';
import EditDepartment from './components/department/EditDepartment';
import EmployeeList from './components/employee/EmployeeList';
import AddEmployee from './components/employee/AddEmployee';
import EmployeeProfile from './components/employee/EmployeeProfile';
import EditEmployee from './components/employee/EditEmployee';
import AddSalary from './components/salary/AddSalary';
import ViewSalary from './components/salary/SalaryView';
import Summary from './components/EmployeeDashboard/Summary';
import AttendanceHistory from './components/EmployeeDashboard/AttendanceHistory';
import LeaveHistory from './components/leave/LeaveHistory';
import AddLeave from './components/leave/AddLeave';
import Setting from './pages/Setting';
import LeaveDetail from './components/leave/LeaveDetail';
import LeaveList from './components/leave/LeaveList';
import AdminAddLeave from './components/leave/AdminAddLeave';
import AdminAttendanceList from './components/attendance/AdminAttendanceList';
import EmployeeChat from './components/chat/EmployeeChat';
import AdminChat from './components/chat/AdminChat';
import AdminAnnouncements from './components/announcement/AdminAnnouncements';
import EmployeeAnnouncements from './components/announcement/EmployeeAnnouncements';
import AdminTasks from './components/task/AdminTasks';
import EmployeeTasks from './components/task/EmployeeTasks';





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard"/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
            <AdminDashboard/>
            </RoleBaseRoutes>
          </PrivateRoutes>
          }>


        <Route path="/admin-dashboard/departments" element={<DepartmentList/>}></Route>
        <Route path="/admin-dashboard/attendance" element={<AdminAttendanceList/>}></Route>
        <Route path="/admin-dashboard/chat" element={<AdminChat/>}></Route>
        <Route path="/admin-dashboard/announcements" element={<AdminAnnouncements/>}></Route>
        <Route path="/admin-dashboard/tasks" element={<AdminTasks/>}></Route>
        <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
        <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>}></Route>

  
       <Route path="/admin-dashboard/add-leave/:id" element={<AdminAddLeave/>}></Route>
        <Route path="/admin-dashboard/employees" element={<EmployeeList/>}></Route>
        <Route path="/admin-dashboard/add-employee" element={<AddEmployee/>}></Route>
        <Route path="/admin-dashboard/employees/:id" element={<EmployeeProfile/>}></Route>
        <Route path="/admin-dashboard/employees/edit/:id" element={<EditEmployee/>}></Route>
        <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary/>}></Route>


        <Route path="/admin-dashboard/salary/add" element={<AddSalary/>}></Route>
        <Route path="/admin-dashboard/salary" element={<ViewSalary/>}></Route>
        <Route path="/admin-dashboard/leaves" element={<LeaveList/>}></Route>  
        <Route path="/admin-dashboard/leaves/:id" element={<LeaveDetail/>}></Route> 
        <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveHistory/>}></Route>
        <Route path="/admin-dashboard/setting" element={<Setting/>}></Route>
      
      </Route>

      

      {/* Employee Part */}

        <Route path="/employee-dashboard" element={
          <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin","employee"]}>
          <EmployeeDashboard/>
          </RoleBaseRoutes>
          </PrivateRoutes>
          }>
          <Route path="/employee-dashboard" element={<Summary/>}></Route>
          <Route path="/employee-dashboard/profile/:id" element={<EmployeeProfile/>}></Route>
          <Route path="/employee-dashboard/attendance" element={<AttendanceHistory/>}></Route>
          <Route path="/employee-dashboard/chat" element={<EmployeeChat/>}></Route>
          <Route path="/employee-dashboard/announcements" element={<EmployeeAnnouncements/>}></Route>
          <Route path="/employee-dashboard/tasks" element={<EmployeeTasks/>}></Route>
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveHistory/>}></Route>
          <Route path="/employee-dashboard/add-leave" element={<AddLeave/>}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary/>}></Route>
          <Route path="/employee-dashboard/setting" element={<Setting/>}></Route>

          </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App
