import ProductCard from "./ProductCard";
import img1 from "../assets/img/perfume_img1.png";
import img2 from "../assets/img/perfume_img2.png";
import img3 from "../assets/img/perfume_img3.png";
import img4 from "../assets/img/perfume_img4.png";
import img5 from "../assets/img/perfume_img5.png";
import img6 from "../assets/img/perfume_img6.png";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
    const location = useLocation();

useEffect(() => {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}, [location]);
    const products = [
    {
      id:1,
      name: "Floral Perfume",
      image: img1,
      description: "100ml - feel the smell of flowers. Immerse yourself in a garden of pure enchantment with our Perfect Floral perfume",
    },
    {
      id:2,
      name: "Woody Perfume",
      image: img2,
      description: "100ml - Embrace Nature's Strength. Discover the allure of the forest and nature with our Woody perfume.",
    },
    {
      id:3,
      name: "Citrus Perfume",
      image: img3,
      description: "100ml - Savor the Sunshine - Capture the essence of summer. This refreshing fragrance bursts with the energy of citrus fruits.",
    },
    {
      id:4,
      name: "Oriental Perfume",
      image: img4,
      description: "100ml - Embrace the Exotic. Indulge your senses with our Oriental perfume, a captivating blend of exotic spices and rich woods.",
    },
    {
      id:5,
      name: "Fresh Aquatic Perfume",
      image: img5,
      description: "100ml -  resembles the calmness of the seashore - Ready to dive into the world of Aquatic region. Escape the ordinary with our Fresh Aquatic perfume.",
    },
    {
      id:6,
      name: "Gourmand Perfume",
      image: img6,
      description: "100ml - Indulge Your Sweet Tooth. Satisfy your cravings with our Gourmand perfume, a fragrance that captures the essence of your favorite treats.",
    },
  ];
  return (
    <>
        <center>
          <h1 className="quotes">"Enter into the world of fragrance"</h1>
        </center>

        <div id="navprod" className="product">
      {products.map((item, index) => (
        <ProductCard
          key={index}
          id={item.id}
          name={item.name}
          image={item.image}
          description={item.description}
        />
      ))}
    </div>
    </>
  );
}