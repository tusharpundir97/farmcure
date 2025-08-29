import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch all products (including unverified)
  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products/unverified`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
    });
    const data = await res.json();
    setProducts(data);
  };

  // Fetch all orders
  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/orders/admin`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Verify product
  const verifyProduct = async (id) => {
    await fetch(`${API_BASE_URL}/products/${id}/verify`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchProducts();
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/orders/admin/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Products Section */}
      <h2 className="text-xl font-semibold mb-3">Unverified Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded-lg shadow">
            <h3 className="font-bold">{p.name}</h3>
            <p>Price: ₹{p.price}</p>
            <button
              onClick={() => verifyProduct(p._id)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
              Verify
            </button>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <h2 className="text-xl font-semibold mb-3">Orders</h2>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="border p-4 rounded-lg shadow">
            <p><strong>Order ID:</strong> {o._id}</p>
            <p><strong>Status:</strong> {o.status}</p>
            <p><strong>Items:</strong></p>
            <ul className="ml-4 list-disc">
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} x {i.quantity} — ₹{i.price}</li>
              ))}
            </ul>

            <div className="mt-3">
              <button
                onClick={() => updateOrderStatus(o._id, "Shipped")}
                className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
              >
                Mark Shipped
              </button>
              <button
                onClick={() => updateOrderStatus(o._id, "Delivered")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}