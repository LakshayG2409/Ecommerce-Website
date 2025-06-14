import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/getcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          console.error("Failed to fetch cart");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleFeedbackChange = (itemId, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [itemId]: value,
    }));
  };

  const handleFeedbackSubmit = async (itemId) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          productId: itemId,
          feedback: feedback[itemId],
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Feedback submitted successfully!");
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="checkout">
      <h1 className="check1">Order Confirmation</h1>
      {isLoading ? (
        <p>Loading your order...</p>
      ) : (
        <div className="cart-summary">
          <p className="check2">Your order has been booked!</p>
          <ul>
            {Object.entries(cartItems).map(([itemId, quantity]) => (
              quantity > 0 && (
                <li key={itemId}>
                  <span>Item ID: {itemId}</span> | <span>Quantity: {quantity}</span>
                  <div className="feedback-section">
                    <textarea
                      placeholder="Leave your feedback here"
                      value={feedback[itemId] || ''}
                      onChange={(e) => handleFeedbackChange(itemId, e.target.value)}
                    />
                    <button onClick={() => handleFeedbackSubmit(itemId)}>Submit Feedback</button>
                  </div>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>Delivery Status: Pending</h2>
      </div>
    </div>
  );
};

export default CheckoutPage;
