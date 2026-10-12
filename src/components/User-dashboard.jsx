import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom"
import { store } from "../store/store";
import { addToShare } from "../slicers/task-slicer";

export function UserDashboard(){

    let navigate = useNavigate();
    let dispatch= useDispatch();

    const [cookies,setCookie,removeCookie] = useCookies(['username','userid']);

    const [ appointments,setAppointments] = useState([{id:null,title:null,description:null,date:null,user_id:null}]);
    const [appointment,setAppointment] =useState({id:'',title:'',description:'',date:'',user_id:''})
    const [searchstring, setSearchString]= useState('')


   const LoadAppointment = useCallback(()=>{

    axios.get(`http://localhost:3000/appointments`)
    .then(response=>{
        setAppointments(response.data);
    })

   },[appointments])

   const filteredAppointments = useMemo(()=>{
    if(searchstring===''){
            return appointments.filter(appointment=> appointment.user_id===cookies['userid']);

    }else{
        return appointments.filter(appointment=> appointment.user_id===cookies["userid"]).filter(item=> item.title.toLowerCase().includes(searchstring.toLowerCase()));
    }

   } ,[cookies['userid'],appointments])

    useEffect(()=>{
        LoadAppointment()
    },[appointments,store]);


    function handleSignout(){
        removeCookie('userid');
        removeCookie('username');
        navigate('/')

    }

    const frmNewTask = useFormik({
        initialValues:{
            title:'',
            description:'',
            date:'',
            user_id:cookies['userid']
        },
        onSubmit:(appointment)=>{
            axios.post(`http://localhost:3000/appointments`,appointment)
            .then(()=>{
                LoadAppointment();

            })
        },
        enableReinitialize:true
    })

    const frmEditTask = useFormik({
        initialValues:{
            id:appointment.id,
            title:appointment.title,
            description:appointment.description,
            date:appointment.date,
            user_id:appointment.user_id
        },
        onSubmit:(appointment)=>{
            axios.put(`http://localhost:3000/appointments/${appointment.id}`,appointment)
            .then(()=>{
                LoadAppointment();

            })
        },
        enableReinitialize:true
    })

    function handleEditClick(appointment){
        setAppointment(appointment)
    }

    function handleDeleteClick(appointment){
        let flag = confirm(`are you sure want to delete\n${appointment.title.toUpperCase()}`);
        if(flag===true){
            axios.delete(`http://localhost:3000/appointments/${appointment.id}`)
            .then(()=>{
                LoadAppointment();
            })
        }
    }

    function handleSearchChenge(e){
        setSearchString(e.target.value)
    }

    function handleShareClick(appointment){
        dispatch(addToShare(appointment));
        alert("Appointment Shared Successfully..")
    }
 
    return(
        <div className="row p-2">
            <div className="col-2 d-flex flex-column justify-content-between p-3 " style={{height:'650px'}}>
                <div>
                    <div className="fs-1 fw-bold text-primary"> Task Flow </div>

                    <ul className="list-group">
                        <li className="list-group-item p-3 list-group-item-light"> <span className="bi bi-columns-gap tex-capitalize fw-bold text-primary"> {cookies['username']} Dashboard </span> </li>
                        <li className="list-group-item p-3 list-group-item-light"> <button data-bs-target="#shared" data-bs-toggle="offcanvas"className="btn btn-dark bi bi-share w-100 position-relative"> Shared <span className="badge bg-danger rounded rounded-circle position-absolute">
                            
                           {store.getState().sharedTaskCount} </span></button></li>

                         <div className="offcanvas offcanvas-start" id="shared">
                            <div className="offcanvas-header">
                                <h2>Shared Appointments</h2>
                                <button className="btn btn-close"data-bs-dismiss="offcanvas"></button>
                            </div>
                            <div className="offcanvas-body">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>user</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            store.getState().sharedTask.map(task=>
                                                <tr key={task.id}>
                                                    <td>{task.title}</td>
                                                    <td> {task.user_id}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>

                            </div>

                         </div>

                        <li className="list-group-item p-3 list-group-item-light "> <button className="btn btn-primary w-100" data-bs-target="#newTask" data-bs-toggle="modal"> <span className="bi bi-plus-lg"></span> New</button></li>
                        <li className="list-group-item p-3 list-group-item-light"> <span className="bi bi-check-circle"> Task </span></li>
                        <li className="list-group-item p-3 list-group-item-light"> <span className="bi bi-calendar-date"></span></li>
                    </ul>
                </div>
                <div>
                    <button onClick={handleSignout} className="btn btn-primary w-100"> SignouT</button>
                </div>
                

            </div>
            <div className="col-10">
                    <header className="bg-primary p-4 mt-2">
                       <div>
                          <div className="position-relative">
                            <span className="bi bi-search position-absolute" style={{top:'7px',left:'10px'}}></span> <input type="text" className="form-control ps-5" onChange={handleSearchChenge} placeholder="search Title" />

                          </div>
                       </div>
                    </header>
                    <div className="d-flex flex-wrap">
                        {
                            (filteredAppointments.length===0)?
                            <code className="mt-3"> No Appointments Found</code>
                            :
                           filteredAppointments.map(appointment=>
                            <div key={appointment.id} className="card m-3 p-3" style={{width:'400px'}}>
                                <div className="card-header d-flex justify-content-between">
                                    <span className="text-uppercase fw-bold"> { appointment.title}</span>
                                    <span><span className="bi bi-calendar-date"></span> {moment(appointment.date).format('DD dddd, MMMM,YYYY')}</span>

                                </div>
                                <div className="card-body">
                                    <div>{appointment.description}</div>
                                </div>
                                <div className="card-footer">
                                    <button data-bs-target="#editTask" data-bs-toggle="modal" onClick={()=> handleEditClick(appointment)} className="btn btn-warning bi bi-pen-fill"></button>
                                    <button onClick={()=>handleDeleteClick(appointment)} className="btn btn-danger bi  bi-trash-fill mx-3"></button>
                                    <button onClick={()=>handleShareClick(appointment)} className="btn btn-dark bi bi-share-fill"></button>
                                </div>

                            </div>)
                        }
                        

                    </div>

                </div>

                <div className="modal fade" id="newTask">
                    <form onSubmit={frmNewTask.handleSubmit} >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>New Appointment</h3>
                                </div>
                                <div className="modal-body">
                                    <dl>
                                           <dt>Title</dt>
                                        <dd><input type="text" name="title" onChange={frmNewTask.handleChange} className="form-control" /></dd>
                                           <dt>Description</dt>
                                        <dd>
                                            <textarea name="description"  onChange={frmNewTask.handleChange}  rows="4" cols="40" className="form-control"></textarea>
                                        </dd>
                                            <dt>Daate</dt>
                                         <dd>
                                            <input type="date"  onChange={frmNewTask.handleChange} name="date" className="form-control" />
                                       </dd>
                                        
                                    </dl>

                                </div>
                                <div className="modal-footer">
                                    <button type="submit"  data-bs-dismiss="modal" className="btn btn-primary"> Add</button>
                                     <button type="button"  data-bs-dismiss="modal" className="btn btn-warning mx-2"> Cancel</button>
                                </div>

                            </div>

                        </div>
                    </form>

                </div>

                <div className="modal fade " id="editTask">
                    <form onSubmit={frmEditTask.handleSubmit}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Edit appointment</h3>
                                    
                                </div>
                                <div className="modal-body">
                                    <dl>
                                        <input type="hidden" name="id" value={frmEditTask.values.id}  />
                                        <dt>title</dt>
                                        <dd><input type="text" value={frmEditTask.values.title} name="title" className="form-control" onChange={frmEditTask.handleChange} /></dd>
                                        <dt>Description</dt>
                                        <dd>
                                            <textarea name="description" value={frmEditTask.values.description} rows={4} cols={40} className="form-control" onChange={frmEditTask.handleChange}></textarea>
                                             </dd>
                                            <dt>Daate</dt>
                                             <dd><input type="date" value={frmEditTask.values.date} name="date" className="form-control" onChange={frmEditTask.handleChange} /></dd>

                                       
                                    </dl>

                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary mx-2" type="submit" data-bs-dismiss="modal"> Add</button>
                                    <button className="btn btn-warning" type="button" data-bs-dismiss="modal">cancel</button>

                                </div>

                            </div>

                        </div>
                    </form>

                </div>

        </div>
    )
}