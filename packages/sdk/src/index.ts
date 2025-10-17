export interface AllocationSummary {
  protocol: 'Aave' | 'Curve' | 'Base';
  allocationPct: number;
  apy: number;
  riskScore: number;
}

export interface RaysScore {
  protocol: string;
  interestBps: number;
  safetyDiscountBps: number;
  moveCostBps: number;
}

export interface ProposalDraft {
  fromProtocol: string;
  toProtocol: string;
  deltaPct: number;
  raysGapBps: number;
  reason: string;
}

export type ExplainerMessage = {
  headline: string;
  detail: string;
  txHash?: string;
  upliftBps: number;
  createdAt: string;
};
