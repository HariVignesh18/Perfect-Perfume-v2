import { useParams } from "react-router-dom";
import { products } from "../data/product";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";

export default function Product() {
  const { id } = useParams();
  const { fetchCart } = useCart();
  const product = products.find(p => p.id === Number(id));
  const navigate = useNavigate();

  if (!product) return <h1>Product not found</h1>;
  const handleBuyNow = () => {
  navigate("/checkout", {
    state: {
      buyNowItem: {
        product_id: product.id,
        quantity: 1,
        price: product.price,
      },
    },
  });
};
const handleAddToCart = async () => {
  const toastId = toast.loading("Adding to cart...");

  try {
    const response = await fetch(`${API_BASE}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Added to cart 🛒", { id: toastId });
      fetchCart();
    } else {
      toast.error(data.error || "Failed to add", { id: toastId });
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong", { id: toastId });
  }
};
  return (
    <>
    <div className="product-detail">
      <img src={product.image} alt={product.name} />

      <div className="product-info">
        <p className="back-link" onClick={() => navigate(-1)}>
      ← Back
    </p>
        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <p className="price">₹{product.price}</p>

        <div className="button-group">
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
        </div>

        <hr />

        <div className="product-specifications">
          <h2>Product Details</h2>

          <table>
            <tbody>
              <tr><th>Gender</th><td>{product.details.gender}</td></tr>
              <tr><th>Scent</th><td>{product.details.scent}</td></tr>
              <tr><th>Form</th><td>{product.details.form}</td></tr>
              <tr><th>Ingredients</th><td>{product.details.ingredients}</td></tr>
              <tr><th>Feature</th><td>{product.details.feature}</td></tr>
              <tr><th>Volume</th><td>{product.details.volume}</td></tr>
              <tr><th>Origin</th><td>{product.details.origin}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}