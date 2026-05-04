/**
 * Campaign + QR data layer — TROPTIONS Sales OS
 * Manages campaigns, QR codes, and scan/redemption events.
 */
import prisma from "./prisma";
import { createHash } from "crypto";

export type CampaignType   = "qr" | "offer" | "event" | "digital";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface CampaignRow {
  id:          string;
  name:        string;
  sponsorId:   string | null;
  venueId:     string | null;
  type:        string;
  status:      string;
  startDate:   Date | null;
  endDate:     Date | null;
  budget:      number | null;
  impressions: number;
  clicks:      number;
  redemptions: number;
  notes:       string | null;
  createdAt:   Date;
  updatedAt:   Date;
  sponsor?:    { name: string } | null;
  venue?:      { name: string } | null;
  _count?:     { qrCodes: number };
}

export interface QrCodeRow {
  id:          string;
  campaignId:  string;
  code:        string;
  label:       string | null;
  offerText:   string | null;
  rewardValue: number | null;
  rewardType:  string;
  scans:       number;
  redemptions: number;
  active:      boolean;
  expiresAt:   Date | null;
  createdAt:   Date;
  campaign?:   { name: string; sponsor?: { name: string } | null } | null;
}

export async function listCampaigns(status?: string): Promise<CampaignRow[]> {
  return prisma.campaign.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      sponsor: { select: { name: true } },
      venue:   { select: { name: true } },
      _count:  { select: { qrCodes: true } },
    },
  });
}

export async function getCampaign(id: string): Promise<CampaignRow | null> {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      sponsor:  { select: { name: true } },
      venue:    { select: { name: true } },
      _count:   { select: { qrCodes: true } },
      qrCodes:  { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function createCampaign(data: {
  name: string;
  sponsorId?: string;
  venueId?: string;
  type?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  budget?: number;
  notes?: string;
}): Promise<CampaignRow> {
  return prisma.campaign.create({
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate:   data.endDate   ? new Date(data.endDate)   : undefined,
    },
    include: {
      sponsor: { select: { name: true } },
      venue:   { select: { name: true } },
    },
  });
}

export async function getQrByCode(code: string): Promise<QrCodeRow | null> {
  return prisma.qrCode.findUnique({
    where: { code },
    include: {
      campaign: {
        select: { name: true, sponsor: { select: { name: true } } },
      },
    },
  });
}

export async function recordQrScan(opts: {
  qrCodeId: string;
  eventType: "scan" | "redeem";
  ip?: string;
  userAgent?: string;
  location?: string;
}): Promise<void> {
  const ipHash = opts.ip
    ? createHash("sha256").update(opts.ip).digest("hex").slice(0, 16)
    : null;

  await prisma.$transaction([
    prisma.qrEvent.create({
      data: {
        qrCodeId:  opts.qrCodeId,
        eventType: opts.eventType,
        ipHash,
        userAgent: opts.userAgent ?? null,
        location:  opts.location  ?? null,
      },
    }),
    prisma.qrCode.update({
      where: { id: opts.qrCodeId },
      data: opts.eventType === "scan"
        ? { scans:       { increment: 1 } }
        : { redemptions: { increment: 1 } },
    }),
    ...(opts.eventType === "redeem"
      ? [prisma.campaign.update({
          where: { id: (await prisma.qrCode.findUnique({ where: { id: opts.qrCodeId }, select: { campaignId: true } }))!.campaignId },
          data: { redemptions: { increment: 1 } },
        })]
      : []),
  ]);
}

export async function createQrCode(data: {
  campaignId: string;
  label?: string;
  offerText?: string;
  rewardValue?: number;
  rewardType?: string;
  expiresAt?: Date | string;
}): Promise<QrCodeRow> {
  return prisma.qrCode.create({
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });
}

export const CAMPAIGN_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:     { label: "Draft",     color: "text-slate-400 bg-slate-800 border-slate-700" },
  active:    { label: "Active",    color: "text-green-400 bg-green-400/10 border-green-400/30" },
  paused:    { label: "Paused",    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  completed: { label: "Completed", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
};
