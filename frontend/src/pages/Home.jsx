import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories",
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.keyword = search.trim();
      }

      if (category !== "All") {
        params.category = category;
      }

      const response = await API.get("/products", {
        params,
      });

      setProducts(response.data);
    } catch (error) {
      console.error("HOME PRODUCTS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div style={{ paddingBottom: "50px" }}>
      {/* ================= HERO ================= */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #2563eb, #1e40af)",
          color: "white",
          borderRadius: "20px",
          padding: "55px 40px",
          marginBottom: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "15px",
              fontWeight: "700",
            }}
          >
            Mega Sale 50% OFF
          </h1>

          <p
            style={{
              fontSize: "18px",
              marginBottom: "25px",
              opacity: "0.95",
            }}
          >
            Discover gadgets, fashion, accessories and
            much more.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 500,
                behavior: "smooth",
              })
            }
            style={{
              background: "white",
              color: "#1e40af",
              border: "none",
              padding: "12px 22px",
              borderRadius: "8px",
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
            borderRadius: "18px",
            background:
              "rgba(255,255,255,0.18)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "70px",
          }}
        >
          🛍️
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px 18px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            fontSize: "16px",
            background: "white",
          }}
        />
      </div>

      {/* ================= CATEGORIES ================= */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "35px",
        }}
      >
        {categories.map((item) => {
          const active =
            category === item;

          return (
            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              style={{
                border: "none",
                padding: "10px 20px",
                borderRadius: "20px",
                background: active
                  ? "#2563eb"
                  : "white",
                color: active
                  ? "white"
                  : "#334155",
                fontWeight: "600",
                boxShadow:
                  "0 4px 12px rgba(15,23,42,0.08)",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
          }}
        >
          <h2>Loading products...</h2>
        </div>
      ) : error ? (
        <div
          className="card"
          style={{
            padding: "35px",
            textAlign: "center",
            color: "#991b1b",
            background: "#fee2e2",
          }}
        >
          {error}
        </div>
      ) : products.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "8px" }}>
            No products found
          </h2>

          <p style={{ color: "#64748b" }}>
            Try another search or category.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "25px",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;