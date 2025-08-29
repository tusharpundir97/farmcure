import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config.js";


export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "",stock:"",image: null });
  const [image, setImage] = useState(null);


  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products/seller/me`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
//     if(!image){
//       console.log(e.target.files[0]);
      
//     }
    if (image) formData.append("images", form.image);

    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData,
    });
   console.log(res)
    if (res.ok) {
      setForm({ name: "", description: "", price: "", category: "", stock: "",image:null });
      setImage(null);
      fetchProducts();
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

    
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full mb-2"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 w-full mb-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Stock"
          className="border p-2 w-full mb-2"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          type="file"
          
          onChange={(e) => {
            
            setForm({ ...form, image: e.target.files[0] })
            setImage(e.target.files[0])
            
            
      }}
          className="mb-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>

     
      <h2 className="text-xl font-semibold mb-2">My Products</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded shadow">
            {p.images && ( <img src={`${p.images}`} alt={p.name} className="rounded-md h-64 w-full object-cover hover:shadow-md"/>)}
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-600">₹{p.price}</p>
            <span className={`px-2 py-1 text-sm rounded ${p.verified ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
              {p.verified ? "Verified" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}