import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {items} = useCart();
  const navigate =useNavigate();
  const count = items.reduce((s,i)=> s + i.qty, 0);
  const  role =localStorage.getItem("role")
  const handleLogout = ()=>{
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center py-4">
        <motion.div
          className="text-2xl font-bold"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/">FarmCare 🌱</Link>
        </motion.div>

          {/* desktop */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li><Link to="/" className="hover:text-green-200">Home</Link></li>
          <li><Link to="/medicines" className="hover:text-green-200">Medicines</Link></li>
          {role=="farmer" &&(<li><Link to="/cart" className="hover:text-green-200">Cart{count >0 &&(
            <span className="ml-2 text-xs bg-white text-green-700 rounded-full px-2 py-0.5 align-middle">{count}</span>
          )}</Link></li>)}
          <li><Link to="/" className="hover:text-green-200">About</Link></li>
          {!role && (<li><Link to="/login" className="hover:text-green-200" >Login</Link></li>)}
          {!role && (<li><Link to="/register" className="hover:text-green-200">Register</Link></li>)}
          {role=="admin" && (<li><Link to="/admin" className="hover:text-green-200">AdminDashBoard</Link></li>)}
          {role=="seller" && (<li><Link to="/seller" className="hover:text-green-200">SellerDashBoard</Link></li>)}
          {role && (<button className="hover:text-red-200" onClick={handleLogout}>Logout</button>)}
        
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="md:hidden bg-green-600 flex flex-col space-y-4 px-6 py-4 font-medium"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/medicines" onClick={() => setMenuOpen(false)}>Medicines</Link></li>
            {role=="farmer" && (<li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>)}
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            {!role && (<li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>)}
            {!role && (<li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>)}
            {role=="seller" && (<li><Link to="/seller" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>)}
            {role=="admin" && (<li><Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>)}
            {role && (<button className="text-red-500 text-2xl" onClick={handleLogout}>Logout</button>)}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}