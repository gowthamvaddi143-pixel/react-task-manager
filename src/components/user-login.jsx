import axios from "axios";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"

export function UserLogin(props){

    let navigate =useNavigate();

    const [cookies, setCookies,removeCookies] = useCookies(['uname']);

    const formik = useFormik({
        initialValues:{
            user_id:'',
            user_name:'',
            password:''
        },
        onSubmit:(user)=>{
            axios.get(`http://localhost:3000/users`)
            .then(response=>{
                
                var result = response.data.find(item=> item.user_id===user.user_id)
                
                if(result){
                    if(result.password===user.password){
                        
                        setCookies('username',result.user_name);
                        setCookies('userid',result.user_id)
                        navigate('/dashboard');
                    }else{
                        alert('invalid password ')
                    }
                }else{
                    alert('inavalid User_id')
                }
            })
        }
    })

    return(
        <form onSubmit={formik.handleSubmit} className={`${props.width}`}>
            <h3 className={`${props.displayTitle}`}>User Login</h3>
            <dl>
                <dt>User Id</dt>
                <dd><input type="text" onChange={formik.handleChange}  name="user_id" className="form-control"/></dd>
                <dt> Password</dt>
                <dt><input type="password"  onChange={formik.handleChange} name="password" className="form-control" /></dt>
            </dl>
            <button  className="btn btn-dark w-100 " type="submit">Login</button>
        </form>
    )
}