import { Link, Outlet } from "react-router-dom"
import './App.css'


function App() {

  return (
    <div>
      <header className="p-3 d-flex justify-content-between align-items-center bg-light text-dark Appheader">
        <div>
          <span className=" bi bi-pencil-square fw-bold text-primary fs-2 "><Link to="/" className="text-decoration-none">Task Flow</Link> </span>
        </div>
        <div className="">
          <span> Products</span>
          <span className="mx-4 "> Pricing</span>
          <span > Preview</span>
        </div>
        <div>
          <button className="btn btn-primary">Support</button>
          <Link to="/login" className="btn btn-warning mx-3"> Login</Link>
        </div>
        
      </header>
      <div className="p-4 d-flex justify-content-center" style={{height:"550px"}}>
          <Outlet/>
      </div>
      <footer className="bg-light text-center">
        & copy : copyright 2026 Task Flow
      </footer>

    </div>
  )
}
  
export default App
