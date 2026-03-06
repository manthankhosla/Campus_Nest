import { PGCard } from "@/components/pg/PGCard";

export default async function SinglePGPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/pg/${params.id}`);
  if (!res.ok) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">PG Not Found</h1>
      </main>
    );
  }
  const pg = await res.json();
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{pg.title}</h1>
      <PGCard pg={pg} />
      <div className="mt-4">
        <div className="text-zinc-700 mb-2">{pg.description}</div>
        <div className="text-zinc-500 text-sm">Location: {pg.location}</div>
      </div>
    </main>
  );
}
