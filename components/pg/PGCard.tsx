export function PGCard({ pg }: {
  pg: { id: string; title: string; rent: number; rating: number; distance: number; image: string };
}) {
  return (
    <div className="rounded border p-4 flex gap-4 items-center bg-white shadow-sm">
      <img src={pg.image} alt={pg.title} className="w-24 h-24 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold text-lg">{pg.title}</div>
        <div className="text-sm text-zinc-600">Rent: ₹{pg.rent} &bull; {pg.distance} km from campus</div>
        <div className="text-sm text-yellow-600">Rating: {pg.rating ?? 0} / 5</div>
      </div>
    </div>
  );
}
