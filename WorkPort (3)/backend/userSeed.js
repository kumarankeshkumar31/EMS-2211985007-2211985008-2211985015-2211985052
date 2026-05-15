import User from './models/User.js';
import bcryptjs from 'bcryptjs'
import connectToDatabase from './database/db.js';



const userRegister = async()=>{

  connectToDatabase();  

  try{ 
    const hashPassword =await bcryptjs.hash('admin',10);
     const newUser = new User({
      name:"Admin",
      email:"admin@gmail.com",  
      password:hashPassword, 
      role:"admin"
     })
     await newUser.save();
     console.log('Admin registered successfully');
  }  
  catch(err){
    console.log(err);
  }
}

userRegister();