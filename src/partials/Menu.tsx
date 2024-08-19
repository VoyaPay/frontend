import { NavLink } from "react-router-dom";
import logo from '../assets/logo.jpg';

export const Menu: React.FC = () => (
  <div className="" style={{ width: "250px", height: "100vh" }}>
    <img src={logo} className='img-fluid width-10 mx-auto d-block' alt='VoyaPay' />
    <div className="list-group list-group-flush">
      <NavLink to="/" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}>
        My Account
      </NavLink>
      <NavLink to="/pre-paid-card" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}>
        Pre-Paid Card
      </NavLink>
      <NavLink to="/shared-card" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}>
        Shared Card
      </NavLink>
      <NavLink to="/transactions" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}>
        Transaction Details
      </NavLink>
      <NavLink to="/settings" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}>
        Settings
      </NavLink>
      {/* <NavLink to="/qa" className="list-group-item list-group-item-action" style={isActive => ({
    color: isActive ? "green" : "blue"
  })}> */}
        {/* Q&A */}
      {/* </NavLink> */}
    </div>
  </div>
)
