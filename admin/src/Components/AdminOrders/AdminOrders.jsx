import React, { useEffect, useState } from "react";
import './AdminOrders.css'

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState(""); // For date search

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/orders");
        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }
        const data = await response.json();

        // Filter and sort orders by date (latest first)
        const bookedOrders = data.orders
          .filter((order) => order.status === "Pending")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(bookedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search criteria
  const filteredOrders = orders.filter((order) => {
    const dateMatches =
      searchDate === "" ||
      new Date(order.orderDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString();

    return dateMatches;
  });

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      // Update the local state with the new status
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Orders</h1>

      {/* Search Form for Date */}
      <div>
        <h4>Product according to the Date</h4>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p>No results found.</p> // Display no results message
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              
              <th>Total Amount</th>
              <th>Order At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId.name} ({order.userId.email})</td>
                
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
