import { useEffect, useMemo, useState } from "react";
import api from "./api";

const emptyForm = {
  name: "",
  quantity: 1,
  category: "General",
  notes: "",
  inStock: true
};

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const title = useMemo(() => (editingId ? "Edit Item" : "Add Item"), [editingId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/items");
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Item name is required");
      return;
    }

    const payload = {
      ...form,
      quantity: Number(form.quantity)
    };

    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, payload);
      } else {
        await api.post("/items", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setError("");
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    }
  };

  const startEdit = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      notes: item.notes || "",
      inStock: item.inStock
    });
    setEditingId(item._id);
    setError("");
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <main className="container">
      <h1>MERN Item Manager</h1>
      <p className="subtitle">Simple practice project with an extra field set.</p>

      <section className="card">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} />
          </label>

          <label>
            Notes
            <input name="notes" value={form.notes} onChange={handleChange} />
          </label>

          <label className="checkbox">
            <input
              name="inStock"
              type="checkbox"
              checked={form.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>

          <div className="actions">
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId ? (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Items</h2>
        {error ? <p className="error">{error}</p> : null}
        {loading ? <p>Loading...</p> : null}

        {!loading && items.length === 0 ? <p>No items yet.</p> : null}

        <ul className="items">
          {items.map((item, index) => (
  <li key={item._id}>
    <div>
      <strong>#{index + 1} {item.name}</strong>
      <p>
        Qty: {item.quantity} | Category: {item.category} | {item.inStock ? "In stock" : "Out of stock"}
      </p>
      {item.notes ? <small>Notes: {item.notes}</small> : null}
    </div>
              <div className="item-actions">
                <button className="ghost" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button className="danger" onClick={() => removeItem(item._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
