/**
 * Seed sample FIFA player cards + price snapshots
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const CARDS = [
  { eaId: "158023", name: "Lionel Messi",        club: "Inter Miami",     league: "MLS",          nation: "Argentina", position: "RW",  rating: 91, rarity: "icon" },
  { eaId: "20801",  name: "Cristiano Ronaldo",   club: "Al Nassr",        league: "Saudi Pro",    nation: "Portugal",  position: "ST",  rating: 89, rarity: "gold" },
  { eaId: "192985", name: "Kylian Mbappé",        club: "Real Madrid",     league: "La Liga",      nation: "France",    position: "ST",  rating: 95, rarity: "gold" },
  { eaId: "231747", name: "Erling Haaland",       club: "Man City",        league: "Premier",      nation: "Norway",    position: "ST",  rating: 94, rarity: "gold" },
  { eaId: "239085", name: "Jude Bellingham",      club: "Real Madrid",     league: "La Liga",      nation: "England",   position: "CAM", rating: 93, rarity: "gold" },
  { eaId: "168542", name: "Virgil van Dijk",      club: "Liverpool",       league: "Premier",      nation: "Netherlands",position: "CB", rating: 90, rarity: "gold" },
  { eaId: "173731", name: "Kevin De Bruyne",      club: "Man City",        league: "Premier",      nation: "Belgium",   position: "CM",  rating: 93, rarity: "gold" },
  { eaId: "176580", name: "Mohamed Salah",        club: "Liverpool",       league: "Premier",      nation: "Egypt",     position: "RW",  rating: 92, rarity: "gold" },
  { eaId: "231443", name: "Pedri",                club: "Barcelona",       league: "La Liga",      nation: "Spain",     position: "CM",  rating: 90, rarity: "gold" },
  { eaId: "260507", name: "Lamine Yamal",         club: "Barcelona",       league: "La Liga",      nation: "Spain",     position: "RW",  rating: 90, rarity: "special" },
];

const PRICES: Record<string, number[]> = {
  "158023": [180000, 195000, 210000],
  "20801":  [85000,  82000,  88000],
  "192985": [950000, 980000, 1020000],
  "231747": [720000, 750000, 740000],
  "239085": [850000, 900000, 880000],
  "168542": [280000, 275000, 290000],
  "173731": [620000, 640000, 650000],
  "176580": [480000, 500000, 510000],
  "231443": [310000, 320000, 315000],
  "260507": [420000, 450000, 470000],
};

async function main() {
  console.log("Seeding player cards…");
  for (const card of CARDS) {
    const created = await prisma.playerCard.upsert({
      where: { eaId: card.eaId },
      create: card,
      update: { rating: card.rating },
    });
    const prices = PRICES[card.eaId] ?? [];
    for (const price of prices) {
      await prisma.priceSnapshot.create({
        data: { cardId: created.id, price, source: "seed" },
      });
    }
    console.log(`  ✓ ${card.name} (${card.rating})`);
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
