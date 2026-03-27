import { pgTable, text, serial, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const competitorAnalysesTable = pgTable("competitor_analyses", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  productName: text("product_name").notNull(),
  productCategory: text("product_category"),
  productSummary: text("product_summary"),
  regionalQueries: jsonb("regional_queries").$type<RegionalQueries>(),
  competitors: jsonb("competitors").notNull().$type<CompetitorRecord[]>(),
  analysisDate: timestamp("analysis_date").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  validationPassed: boolean("validation_passed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export interface RegionalQuery {
  region: "TR" | "USA" | "EU";
  query: string;
  gl: string;
  hl: string;
  measurementUnit: "cm" | "inches";
  reasoning: string;
}

export interface RegionalQueries {
  TR: RegionalQuery;
  USA: RegionalQuery;
  EU: RegionalQuery;
}

export interface CompetitorRecord {
  name: string;
  brand: string;
  region: "TR" | "USA" | "EU";
  country: string;
  priceLocal: string;
  priceTRY: string;
  currency: string;
  productUrl: string;
  deliveryEstimate: string;
  socialMedia: { platform: string; url: string }[];
  matchScore: number;
  matchReason: string;
  rating: number;
  reviewCount: number;
  stockStatus: "in_stock" | "low_stock" | "unknown";
  urlVerified: boolean;
  lastChecked: string;
}

export const insertCompetitorAnalysisSchema = createInsertSchema(competitorAnalysesTable).omit({ id: true });
export type InsertCompetitorAnalysis = z.infer<typeof insertCompetitorAnalysisSchema>;
export type CompetitorAnalysis = typeof competitorAnalysesTable.$inferSelect;
