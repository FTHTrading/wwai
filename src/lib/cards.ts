/**
 * FIFA / EA FC card data layer
 * Tries FutBin-style public endpoints; falls back to local DB cache.
 */
import prisma from "./prisma";

export interface CardSearchResult {
  eaId: string;
  name: string;
  club: string;
  league: string;
  nation: string;
  position: string;
  rating: number;
  rarity: string;
  imageUrl: string | null;
  price: number | null; // ATP-equivalent estimate
}

/**
 * Search local DB first; if empty, return empty (scraping must be triggered separately).
 */
export async function searchCards(query: string): Promise<CardSearchResult[]> {
  const cards = await prisma.playerCard.findMany({
    where: {
      name: { contains: query },
    },
    take: 20,
    include: {
      priceHistory: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });

  return cards.map((c) => ({
    eaId: c.eaId,
    name: c.name,
    club: c.club,
    league: c.league,
    nation: c.nation,
    position: c.position,
    rating: c.rating,
    rarity: c.rarity,
    imageUrl: c.imageUrl,
    price: c.priceHistory[0]?.price ?? null,
  }));
}

export async function upsertCard(data: {
  eaId: string;
  name: string;
  club: string;
  league: string;
  nation: string;
  position: string;
  rating: number;
  rarity?: string;
  imageUrl?: string;
}) {
  return prisma.playerCard.upsert({
    where: { eaId: data.eaId },
    create: { ...data, rarity: data.rarity ?? "gold" },
    update: {
      name: data.name,
      club: data.club,
      rating: data.rating,
      imageUrl: data.imageUrl,
    },
  });
}

export async function recordPrice(cardId: string, price: number, source = "market") {
  return prisma.priceSnapshot.create({ data: { cardId, price, source } });
}
