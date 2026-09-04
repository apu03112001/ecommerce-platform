import { useEffect, useState } from "react";
import API from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalItems: 0,
  });

  const [form, setForm] = useState(emptyForm);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= LOAD ALL DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        productsResponse,
        usersResponse,
        ordersResponse,
        statsResponse,
      ] = await Promise.all([
        API.get("/products"),
        API.get("/auth/users"),
        API.get("/orders/admin/all"),
        API.get("/orders/admin/stats"),
      ]);

      setProducts(productsResponse.data);
      setUsers(usersResponse.data);
      setOrders(ordersResponse.data);
      setStats(statsResponse.data);

      setMessage("");
    } catch (error) {
      console.error("ADMIN LOAD ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= PRODUCT FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    setImage(selectedImage);

    if (selectedImage) {
      setPreview(URL.createObjectURL(selectedImage));
    }
  };

  // ================= CREATE PRODUCT =================
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
          "Product created successfully!"
      );

      handleCancelEdit();

      await fetchData();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to create product."
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

      handleCancelEdit();

      await fetchData();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update product."
      );
    }
  };

  // ================= CANCEL EDIT =================
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setPreview("");
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/products/${id}`
      );

      setMessage(
        response.data.message ||
          "Product deleted successfully!"
      );

      await fetchData();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ================= USER FORM =================
  const handleUserFormChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE USER =================
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/users",
        userForm
      );

      setMessage(
        response.data.message ||
          "User created successfully!"
      );

      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      await fetchData();
    } catch (error) {
      console.error("CREATE USER ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to create user."
      );
    }
  };

  // ================= CHANGE ROLE =================
  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      const response = await API.put(
        `/auth/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      setMessage(
        response.data.message ||
          "Role updated successfully!"
      );

      await fetchData();
    } catch (error) {
      console.error("ROLE UPDATE ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update role."
      );
    }
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/auth/users/${userId}`
      );

      setMessage(
        response.data.message ||
          "User deleted successfully!"
      );

      await fetchData();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "60px" }}>
      <h1 className="page-title">
        Admin Dashboard
      </h1>

      <p className="page-subtitle">
        Manage products, users, orders and sales.
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

      {/* ================= STATISTICS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          title="Total Products"
          value={products.length}
        />

        <StatCard
          title="Total Users"
          value={users.length}
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
        />

        <StatCard
          title="Total Sales"
          value={`₹${Number(
            stats.totalSales || 0
          ).toLocaleString("en-IN")}`}
        />
      </div>

      {/* ================= ADD PRODUCT ================= */}
      <div
        className="card"
        style={{
          padding: "30px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {editingId
            ? "Edit Product"
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
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              required
              style={inputStyle}
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              style={inputStyle}
            />

            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
              style={inputStyle}
            />

            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
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
                onClick={handleCancelEdit}
                style={secondaryButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= PRODUCTS ================= */}
      <section style={{ marginBottom: "45px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Product Management
        </h2>

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
                          width: "55px",
                          height: "55px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      "No image"
                    )}
                  </td>

                  <td style={tdStyle}>
                    {product.name}
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
      </section>

      {/* ================= USER MANAGEMENT ================= */}
      <section style={{ marginBottom: "45px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          User Management
        </h2>

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Create User
          </h3>

          <form onSubmit={handleCreateUser}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              <input
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                placeholder="Name"
                required
                style={inputStyle}
              />

              <input
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                placeholder="Email"
                required
                style={inputStyle}
              />

              <input
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                placeholder="Password"
                required
                style={inputStyle}
              />

              <select
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
                style={inputStyle}
              >
                <option value="user">
                  User
                </option>

                <option value="sales_person">
                  Sales Person
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                ...primaryButton,
                marginTop: "20px",
              }}
            >
              Create User
            </button>
          </form>
        </div>

        <div className="card table-wrapper">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>
                    {user.name}
                  </td>

                  <td style={tdStyle}>
                    {user.email}
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id,
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        width: "auto",
                      }}
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="sales_person">
                        Sales Person
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        handleDeleteUser(
                          user._id
                        )
                      }
                      style={deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= ORDERS ================= */}
      <section>
        <h2 style={{ marginBottom: "20px" }}>
          Order Management
        </h2>

        {orders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            No orders found.
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
                key={order._id}
                className="card"
                style={{
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <h3>
                      Order #
                      {order._id.slice(-8)}
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                        marginTop: "5px",
                      }}
                    >
                      Customer:{" "}
                      {order.user?.name ||
                        order.user?.email ||
                        "Customer"}
                    </p>

                    <p
                      style={{
                        color: "#64748b",
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

                <div>
                  <h4
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    Items
                  </h4>

                  {order.items?.map(
                    (item, index) => (
                      <div
                        key={
                          item._id || index
                        }
                        style={{
                          padding:
                            "10px 0",
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
                          Quantity:{" "}
                          {item.quantity ||
                            1}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ================= STAT CARD =================
function StatCard({ title, value }) {
  return (
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
        {title}
      </p>

      <h2
        style={{
          fontSize: "30px",
          color: "#1e40af",
        }}
      >
        {value}
      </h2>
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

export default AdminDashboard;