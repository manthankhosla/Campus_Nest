// Member 3: GET single PG by id
import { prisma } from "@/lib/prisma";

// GET /api/pg/[id] - Get single PG by id
export async function GET(_request, { params }) {
  const { id } = await params;
  const pg = await prisma.pGListing.findUnique({
    where: { id },
    include: { reviews: true },
  });
  if (!pg) {
    return Response.json({ message: "PG not found" }, { status: 404 });
  }
  const avgRating =
    pg.reviews.length > 0
      ? pg.reviews.reduce((sum, r) => sum + r.rating, 0) / pg.reviews.length
      : 0;
  return Response.json({
    id: pg.id,
    title: pg.title,
    rent: pg.rent,
    location: pg.location,
    distance: pg.distance,
    description: pg.description,
    image: pg.image,
    rating: Number(avgRating.toFixed(2)),
  });
}
