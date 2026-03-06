"use client";
import { useState } from "react";

export default function AddPGPage() {
  const [form, setForm] = useState({
    title: "",
    rent: "",
    location: "",
    distance: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/pg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rent: Number(form.rent),
          distance: Number(form.distance),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("PG created successfully!");
        setForm({ title: "", rent: "", location: "", distance: "", description: "", image: "" });
      } else {
        setError(data.message || "Failed to create PG");
      }
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add PG</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full border rounded px-3 py-2"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="rent"
          type="number"
          placeholder="Rent (₹)"
          value={form.rent}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="distance"
          type="number"
          step="0.1"
          placeholder="Distance (km)"
          value={form.distance}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add PG"}
        </button>
        {success && <div className="text-green-700">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </main>
  );
}
