import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import connectToDatabase from './database/db.js'
import leaveRouter from './routes/leave.js'
import dashboardRouter from './routes/dashboard.js'
import settingRouter from './routes/setting.js'
import attendanceRouter from './routes/attendance.js'
import chatRouter from './routes/chat.js'
import announcementRouter from './routes/announcement.js'
import taskRouter from './routes/task.js'

dotenv.config();  

connectToDatabase(); 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/chat', chatRouter);
app.use('/api/announcement', announcementRouter);
app.use('/api/task', taskRouter);


app.listen(process.env.PORT,()=>{
  console.log(`Server running on port ${process.env.PORT}`)
})  
