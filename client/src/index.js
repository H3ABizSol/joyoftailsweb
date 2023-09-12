import React, { createContext, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { persistor } from "./Store/Store";
import reportWebVitals from "./reportWebVitals";
import store from "./Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <CartProvider>
        <App />
      </CartProvider>
    </PersistGate>
  </Provider>
);
export default CartContext;
const useCart = () => {
  return useContext(CartContext);
};

export { useCart };

reportWebVitals();
