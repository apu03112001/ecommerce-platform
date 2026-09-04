import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || product.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div>
      {/* HERO SECTION */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563EB,#1E40AF)",
          color: "white",
          borderRadius: "24px",
          padding: "50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "30px",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "48px", marginBottom: "15px" }}>
            Mega Sale 50% OFF
          </h1>

          <p style={{ fontSize: "20px", opacity: 0.9 }}>
            Discover gadgets, fashion, accessories and much more.
          </p>

          <button
            style={{
              marginTop: "25px",
              background: "white",
              color: "#1E40AF",
              padding: "14px 24px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "600",
            }}
          >
            Shop Now
          </button>
        </div>

        <div
          style={{
            width: "250px",
            height: "180px",
            background: "rgba(255,255,255,.15)",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "70px",
          }}
        >
          🛍️
        </div>
      </div>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
          fontSize: "16px",
          marginBottom: "25px",
        }}
      />

      {/* CATEGORY BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "none",
              background:
                category === item ? "#2563EB" : "white",
              color:
                category === item ? "white" : "#334155",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              fontWeight: "600",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px,1fr))",
          gap: "25px",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;