import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
    const { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, resetCart } =
        useContext(ShopContext);
    const navigate = useNavigate();
    const [address, setAddress] = useState("");

    const handleProceedToPay = async () => {
        if (!address.trim()) {
            alert("Please enter your address before proceeding.");
            return;
        }

        const orderItems = Object.entries(cartItems).map(([productId, quantity]) => ({
            productId,
            quantity,
        }));

        try {
            const response = await fetch("http://localhost:4000/placeorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
                body: JSON.stringify({
                    items: orderItems,
                    totalAmount: getTotalCartAmount(),
                    address,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Order booked successfully!");
                resetCart(); // Clear the cart
                navigate("/checkout");
            } else {
                alert("Failed to book the order. Please try again.");
            }
        } catch (error) {
            console.error("Error confirming the order:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="cartitems">
            <div className="cartitems-format-main">
                <p>Product</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="classitems-format cartitems-format-main">
                                <img
                                    src={e.image}
                                    className="carticon-product-icon"
                                    alt=""
                                />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <div className="cartitems-quantity-control">
                                    <button onClick={() => removeFromCart(e.id)}>-</button>
                                    <span className="cartitems-quantity">{cartItems[e.id]}</span>
                                    <button onClick={() => addToCart(e.id)}>+</button>
                                </div>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img
                                    className="cartitems-remove-icon"
                                    src={remove_icon}
                                    onClick={() => removeFromCart(e.id, true)} // Pass `true` to remove all items
                                    alt="Remove"
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <hr />
                    <div className="cartitems-address">
                        <label htmlFor="address">Delivery Address:</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            rows="3"
                        ></textarea>
                    </div>
                    <button onClick={handleProceedToPay}>Proceed to Pay</button>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
