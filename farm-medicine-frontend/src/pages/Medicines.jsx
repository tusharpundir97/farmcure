import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE_URL } from "../config.js";

export default function Medicines() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const {addToCart} =useCart();


  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products?limit=60&page=1`);
        const data = await res.json();

        setMedicines(data.products);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);


  const filteredMedicines = medicines.filter(
    (m) =>
      (filter === "All" || m.category?.toLowerCase() === filter.toLowerCase()) &&
      m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
    
        <motion.h1
          className="text-4xl font-bold text-green-700 text-center mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🛒 Browse Medicines
        </motion.h1>

      
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
      
          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 outline-none"
          />

       
          <select
            value={filter.value}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Pesticide">Pesticide</option>
            <option value="Herbicide">Herbicide</option>
          </select>
        </div>

    
        {loading ? (
          <p className="text-center text-gray-500">Loading medicines...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((med, index) => (
                <motion.div
                  key={med._id}
                  className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                > <div className="flex">
                  <div className="pr-4">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">{med.name}</h2>
                    <p className="text-gray-600 mb-2">Category: {med.category}</p>
                    <p className="text-green-600 font-bold mb-4">Price: ₹ {med.price}</p>
                    <p className="text-red-600 font-bold mb-4">Stock: {med.stock}</p>
                  </div>
                  <div>
                    {med.images && (<img src={`${med.images}`} 
                    alt="Medicine Image"
                    className="rounded-md h-64 w-full object-cover"/>)}
                  </div>
                </div>
                
                  
                  <button className="w-full mt-4 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
                  onClick={()=> addToCart(med, 1)}>
                    Add to Cart
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No medicines found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}