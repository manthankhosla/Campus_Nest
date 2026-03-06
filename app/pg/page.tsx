"use client";
import { useEffect, useState } from "react";
import { PGCard } from "@/components/pg/PGCard";
import { PGFilter } from "@/components/pg/PGFilter";

export default function PGListPage() {
  const [pgs, setPgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    rentMin: "",
    rentMax: "",
    distanceMax: "",
    ratingMin: "",
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    fetch(`/api/pg?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setPgs(data))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">PG Listings</h1>
      <PGFilter filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="text-zinc-500">Loading...</div>
      ) : pgs.length === 0 ? (
        <div className="text-zinc-500">No PGs found.</div>
      ) : (
        <div className="space-y-4">
          {pgs.map((pg) => (
            <PGCard key={pg.id} pg={pg} />
          ))}
        </div>
      )}
    </main>
  );
}
