import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function UserRegister(){
  
    const [msg,setMsg]= useState('')
    const [errorStyle,setErrorStyle]= useState('')

     let navigate = useNavigate();
     const formik =useFormik({
        initialValues:{
            user_id:'',
            user_name:'',
            password:'',
            email:''
        },
        onSubmit:(user)=>{
            axios.post(`http://localhost:3000/users`,user)
            .then(()=>{
                alert("Rigester Successfully")
                navigate('/login');

            })
        }
     })
      function VerifyUser(e){
        axios.get(`http://localhost:3000/users`)
        .then(response=>{
            for(var item of response.data){
                if(item.user_id===e.target.value){
                    setMsg('User id taken- try Another ')
                    setErrorStyle(" text-danger")
                    break;
                }else{
                    setMsg('user id avilable')
                    setErrorStyle('text-success')
                }
            }

        })
      }

    return(
        <form onSubmit={formik.handleSubmit}>
            <dl>
                <dt>User Id</dt>
                <dd><input onKeyUp={VerifyUser} onChange={formik.handleChange} type="text" name="user_id" className="form-control"  /></dd>
                <dd className={errorStyle}> {msg} </dd>
                   <dt>User Name</dt>
                <dd><input type="text" name="user_name" className="form-control" onChange={formik.handleChange}   /></dd>
           
              <dt>Password</dt>
                <dd><input type="password" name="password" className="form-control" onChange={formik.handleChange}   /></dd>
           
              <dt>Email</dt>
                <dd><input type="email" name="email" className="form-control" onChange={formik.handleChange}   /></dd>
             
            </dl>
            <button type="submit" className="btn btn-primary w-100">Rigister </button>
        </form>
    )
}