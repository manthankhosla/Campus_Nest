import { useState } from "react";

export function PGFilter({ filters, setFilters }: {
  filters: { rentMin: string; rentMax: string; distanceMax: string; ratingMin: string };
  setFilters: (f: any) => void;
}) {
  return (
    <form className="flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label className="block text-xs mb-1">Min Rent</label>
        <input type="number" name="rentMin" value={filters.rentMin} onChange={e => setFilters(f => ({ ...f, rentMin: e.target.value }))} className="border rounded px-2 py-1 w-24" min={0} />
      </div>
      <div>
        <label className="block text-xs mb-1">Max Rent</label>
        <input type="number" name="rentMax" value={filters.rentMax} onChange={e => setFilters(f => ({ ...f, rentMax: e.target.value }))} className="border rounded px-2 py-1 w-24" min={0} />
      </div>
      <div>
        <label className="block text-xs mb-1">Max Distance (km)</label>
        <input type="number" name="distanceMax" value={filters.distanceMax} onChange={e => setFilters(f => ({ ...f, distanceMax: e.target.value }))} className="border rounded px-2 py-1 w-24" min={0} step={0.1} />
      </div>
      <div>
        <label className="block text-xs mb-1">Min Rating</label>
        <input type="number" name="ratingMin" value={filters.ratingMin} onChange={e => setFilters(f => ({ ...f, ratingMin: e.target.value }))} className="border rounded px-2 py-1 w-24" min={0} max={5} step={0.1} />
      </div>
    </form>
  );
}
