import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../config.js";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, setQty, removeFromCart, clearCart, totals } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [msg, setMsg] = useState("");

  const uniqueSellers = useMemo(() => [...new Set(items.map(i => i.seller))], [items]);
  const singleSellerOk = uniqueSellers.length <= 1;

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  const handleCheckout = async () => {
    setMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("Please login to place an order.");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      setMsg("Your cart is empty.");
      return;
    }
    if (!singleSellerOk) {
      setMsg("Items from multiple sellers detected. Please keep items from one seller per order.");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        items: items.map(i => ({
          product: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          seller: i.seller
        })),
        shippingAddress: address,
        paymentMethod: "cod"
      };
      

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      // console.log(res);
      
      const data = await res.json();
      
      
      if (res.ok) {
        clearCart();
        setMsg("✅ Order placed successfully!");
        // optional: navigate(/order/${data._id});
      } else {
        setMsg(data.message || "Failed to place order.");
      }
    } catch (e) {
      console.log(e);
      
      setMsg("Something went wrong. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-green-700 mb-4">Your Cart</h1>
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : items.map(item => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />}
                <div>
                  <p className="font-semibold text-green-800">{item.name}</p>
                  <p className="text-sm text-gray-500">₹ {item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number" min="1" value={item.qty}
                  onChange={(e) => setQty(item._id, parseInt(e.target.value || "1", 10))}
                  className="w-16 border rounded px-2 py-1"
                />
                <button className="text-red-600 hover:underline" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <div className="flex justify-between mt-4">
              <button className="text-red-700 hover:underline" onClick={clearCart}>Clear Cart</button>
              {!singleSellerOk && (
                <span className="text-xs text-red-600">
                  Items from multiple sellers. Please checkout per seller.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary & Address */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold text-green-700 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Items</span><span>₹ {totals.itemsPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹ {totals.shippingPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-green-800 border-t pt-2">
              <span>Total</span><span>₹ {totals.total.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-green-700 mt-6 mb-2">Shipping Address</h3>
          <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2" placeholder="Address"
                   value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} />
            <div className="flex gap-2">
              <input className="w-1/2 border rounded px-3 py-2" placeholder="City"
                     value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
              <input className="w-1/2 border rounded px-3 py-2" placeholder="State"
                     value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <input className="w-1/2 border rounded px-3 py-2" placeholder="Postal Code"
                     value={address.postalCode} onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))} />
              <input className="w-1/2 border rounded px-3 py-2" placeholder="Country"
                     value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} />
            </div>
          </div>

          <button
            className="w-full mt-6 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-60"
            onClick={handleCheckout}
            disabled={placing || items.length === 0 || !singleSellerOk}
          >
            {placing ? "Placing Order..." : "Place Order (COD)"}
          </button>

          {msg && <p className="text-sm mt-3 text-center text-gray-700">{msg}</p>}
        </div>
      </div>
    </div>
  );
}