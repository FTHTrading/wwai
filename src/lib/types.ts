// TROPTIONS + WWAI shared types

export type PartnerCategory =
  | "hotel"
  | "restaurant"
  | "bar"
  | "merchant"
  | "driver"
  | "sponsor"
  | "venue";

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "needs_info"
  | "rejected";

export type PackageTier = "starter" | "standard" | "premium" | "featured" | "enterprise";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  category: PartnerCategory | "safety" | "transport";
  type: string;
  zone: string;
  distanceMiles: number;
  walkMinutes?: number;
  driveMinutes?: number;
  shuttleMinutes?: number;
  verified: boolean;
  safetyNote?: string;
  offer?: string;
  ageRestricted?: boolean;
  openLate?: boolean;
  priceLevel?: 1 | 2 | 3 | 4;
  cuisine?: string;
  coords?: Coordinates;
}

export interface PackageItem {
  id: string;
  name: string;
  category: "sponsor" | "merchant" | "hotel" | "driver";
  price: number;          // annual USD
  setupFee?: number;
  bestFor: string;
  features: string[];
  tier: PackageTier;
  featured?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  tier: PackageTier;
  status: "active" | "pending" | "renewal";
  monthlyValue: number;
  activeCampaigns: number;
}

export interface Campaign {
  id: string;
  name: string;
  sponsorId: string;
  type: string;
  zone: string;
  status: "live" | "scheduled" | "ended";
  scans: number;
  redemptions: number;
  estimatedValue: number;
}

export interface Submission {
  id: string;
  type: PartnerCategory;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  zone?: string;
  packageId?: string;
  status: SubmissionStatus;
  submittedAt: string;
  data: Record<string, unknown>;
}

export interface Proposal {
  id: string;
  customerType: PartnerCategory;
  businessName: string;
  contactName: string;
  packageId: string;
  campaignType?: string;
  zone?: string;
  termMonths: number;
  addons: string[];
  totalContractValue: number;
  setupFee: number;
  annualFee: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  message: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  status: "online" | "ready" | "needs-config";
}
