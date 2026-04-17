import { Link } from "react-router-dom";

export default function ProductCard({ id, name, image, description }) {
  return (
    <div className="box">
        <Link to={`/product/${id}`}>
        <img src={image} alt={name} width="220px" height="220px" />
      <h3>{name}</h3>
      <hr className="h" />
      <p>{description}</p>
        </Link>
    </div>
  );
}