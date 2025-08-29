import { createContext,useContext,useEffect,useMemo,useState } from "react";

const CartContext =createContext();

export function CartProvider({children}){
      const [items, setItems] = useState(()=>{
            try {
                  return JSON.parse(localStorage.getItem("cart") || "[]");
            } catch  {
                  return [];
            }
      });

      useEffect(()=>{
            localStorage.setItem("cart",JSON.stringify(items));
      }, [items]);

      const addToCart = (product, qty =1) =>{
            setItems(prev => {
                  const i =prev.findIndex(p => p._id === product._id);
                  if(i >=0){
                        const copy = [...prev];
                        copy[i] ={ ...copy[i], qty: copy[i].qty +qty};
                        return copy;
                  }
                  return [...prev, {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        seller: product.seller,
                        image: product.image?.[0],
                        qty
                  }]
            })
      };

      const removeFromCart = (id) => setItems(prev => prev.filter(p => p._id !==id));

      const setQty =(id, qty) => setItems(prev =>
            prev.map(p => p._id === id ? {...p, qty: Math.max(1, qty)}: p)
      );

      const clearCart =()=> setItems([]);

      const totals =useMemo(()=>{
            const itemsPrice =items.reduce((s,i) => s+i.price*i.qty,0);
            return {itemsPrice, shippngPrice:0, total:itemsPrice};
      },[items]);

      return (
            <CartContext.Provider value={{items,addToCart,removeFromCart,setQty,clearCart,totals}}>
                  {children}
            </CartContext.Provider>
      )
}

export const useCart =() => useContext(CartContext);