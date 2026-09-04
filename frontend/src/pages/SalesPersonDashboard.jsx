import { useEffect, useState } from "react";
import API from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

function SalesPersonDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ================= LOAD DATA =================
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const productsResponse = await API.get("/products/my");
      const ordersResponse = await API.get(
        "/orders/sales-person"
      );

      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);

      setMessage("");
    } catch (error) {
      console.error("Dashboard error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load sales dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    setImage(selectedImage);

    if (selectedImage) {
      setPreview(URL.createObjectURL(selectedImage));
    }
  };

  // ================= ADD PRODUCT =================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      if (image) {
        formData.append("image", image);
      }

      const response = await API.post(
        "/products",
        formData
      );

      setMessage(
        response.data.message ||
          "Product added successfully!"
      );

      resetForm();

      await loadDashboard();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to add product."
      );
    }
  };

  // ================= EDIT PRODUCT =================
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
    });

    setPreview(product.image || "");
    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      if (image) {
        formData.append("image", image);
      }

      const response = await API.put(
        `/products/${editingId}`,
        formData
      );

      setMessage(
        response.data.message ||
          "Product updated successfully!"
      );

      resetForm();

      await loadDashboard();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update product."
      );
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/products/${productId}`
      );

      setMessage(
        response.data.message ||
          "Product deleted successfully!"
      );

      await loadDashboard();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview("");
    setEditingId(null);
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        <h2>Loading Sales Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "50px" }}>
      <h1 className="page-title">
        Sales Person Dashboard
      </h1>

      <p className="page-subtitle">
        Manage your products and view orders containing
        your products.
      </p>

      {message && (
        <div
          style={{
            background: "#eff6ff",
            color: "#1e40af",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          {message}
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div
          className="card"
          style={{
            padding: "25px",
          }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            My Products
          </p>

          <h2
            style={{
              fontSize: "32px",
              color: "#1e40af",
            }}
          >
            {products.length}
          </h2>
        </div>

        <div
          className="card"
          style={{
            padding: "25px",
          }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            My Orders
          </p>

          <h2
            style={{
              fontSize: "32px",
              color: "#1e40af",
            }}
          >
            {orders.length}
          </h2>
        </div>
      </div>

      {/* ================= ADD / EDIT PRODUCT ================= */}
      <div
        className="card"
        style={{
          padding: "30px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {editingId
            ? "Edit My Product"
            : "Add New Product"}
        </h2>

        <form
          onSubmit={
            editingId ? handleUpdate : handleCreate
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              min="0"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              min="0"
              required
              style={inputStyle}
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="4"
            required
            style={{
              ...inputStyle,
              width: "100%",
              marginTop: "18px",
              resize: "vertical",
            }}
          />

          <div style={{ marginTop: "18px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <div style={{ marginTop: "15px" }}>
              <img
                src={preview}
                alt="Product preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={primaryButton}
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={secondaryButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= MY PRODUCTS ================= */}
      <section style={{ marginBottom: "45px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          My Products
        </h2>

        {products.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            No products found. Add your first product
            above.
          </div>
        ) : (
          <div className="card table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td style={tdStyle}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>

                    <td style={tdStyle}>
                      <strong>{product.name}</strong>
                    </td>

                    <td style={tdStyle}>
                      {product.category}
                    </td>

                    <td style={tdStyle}>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </td>

                    <td style={tdStyle}>
                      {product.stock}
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          style={editButton}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          style={deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= ORDERS ================= */}
      <section>
        <h2 style={{ marginBottom: "20px" }}>
          Orders Containing My Products
        </h2>

        {orders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            No orders containing your products yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {orders.map((order) => (
              <div
                className="card"
                key={order._id}
                style={{
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <h3>
                      Order #{order._id.slice(-8)}
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        marginTop: "5px",
                      }}
                    >
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    style={{
                      padding: "12px 0",
                      borderTop:
                        "1px solid #e2e8f0",
                    }}
                  >
                    <strong>
                      {item.productName ||
                        item.name ||
                        item.product?.name ||
                        "Product"}
                    </strong>

                    <p
                      style={{
                        color: "#64748b",
                      }}
                    >
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "15px",
  width: "100%",
};

const primaryButton = {
  background: "#1e40af",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "600",
};

const secondaryButton = {
  background: "#e2e8f0",
  color: "#334155",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "600",
};

const editButton = {
  background: "#dbeafe",
  color: "#1e40af",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  fontWeight: "600",
};

const deleteButton = {
  background: "#fee2e2",
  color: "#991b1b",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  fontWeight: "600",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
};

export default SalesPersonDashboard;