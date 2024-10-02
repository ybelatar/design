"use client";

import { useState } from "react";
import axios from "axios";

// Define types for a dish and the order
type Dish = {
  name: string;
  price: number;
};

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  table: string;
  items: OrderItem[];
  total: number;
};

export default function Waiter() {
  // State types
  const [tableNumber, setTableNumber] = useState<string>("");
  const [order, setOrder] = useState<Dish[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Mock dishes data with types
  const dishes: Dish[] = [
    { name: "Boeuf", price: 20 },
    { name: "Poulet", price: 15 },
    { name: "Poisson", price: 18 },
    { name: "Salade", price: 10 },
    { name: "Dessert", price: 8 },
  ];

  // Handle table number input change
  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableNumber(e.target.value);
  };

  // Add a dish to the current order
  const addDishToOrder = (dish: Dish) => {
    setOrder((prevOrder) => [...prevOrder, dish]);
  };

  // Calculate the total order price
  const getOrderTotal = (): number => {
    return order.reduce((total, dish) => total + dish.price, 0);
  };

  // Handle sending the order to the kitchen
  const handleSendToKitchen = async () => {
    if (!tableNumber) {
      alert("Please select a table number");
      return;
    }

    const orderData: Order = {
      table: tableNumber,
      items: order.map((item) => ({ name: item.name, quantity: 1 })),
      total: getOrderTotal(),
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData);
      alert("Order sent to kitchen!");
      setOrder([]);
    } catch (error) {
      console.error("Error sending order", error);
      alert("Error sending order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Waiter Page</h1>

      {/* Select Table Number */}
      <label htmlFor="table">Table Number:</label>
      <input
        id="table"
        type="number"
        value={tableNumber}
        onChange={handleTableChange}
        placeholder="Enter table number"
        style={{ margin: "10px" }}
      />

      {/* Display Dishes */}
      <h3>Select Dishes</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {dishes.map((dish, index) => (
          <button
            key={index}
            onClick={() => addDishToOrder(dish)}
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {dish.name} (${dish.price})
          </button>
        ))}
      </div>

      {/* View and Send Order */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showMenu ? "Hide Order" : "View Order"}
      </button>

      {showMenu && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#fafafa",
            padding: "20px",
            border: "1px solid #ddd",
          }}
        >
          <h3>Order Summary</h3>
          <ul>
            {order.map((dish, index) => (
              <li key={index}>
                {dish.name} - ${dish.price}
              </li>
            ))}
          </ul>
          <h4>Total: ${getOrderTotal()}</h4>

          <button
            onClick={handleSendToKitchen}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send to Kitchen
          </button>
        </div>
      )}
    </div>
  );
}
