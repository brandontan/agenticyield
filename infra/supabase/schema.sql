create schema if not exists agenticyield;

create table if not exists agenticyield.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists agenticyield.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references agenticyield.users(id) on delete cascade,
  chain text not null,
  address text not null,
  primary_wallet boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists agenticyield.vaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references agenticyield.users(id) on delete cascade,
  chain text not null,
  address text not null,
  auto_manage boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists agenticyield.allocations (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references agenticyield.vaults(id) on delete cascade,
  protocol text not null,
  amount_usdc numeric(36, 6) not null,
  apy numeric(8, 4) not null,
  risk_score numeric(5, 2) not null,
  updated_at timestamptz not null default now()
);

create table if not exists agenticyield.proposals (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references agenticyield.vaults(id) on delete cascade,
  from_protocol text not null,
  to_protocol text not null,
  delta_usdc numeric(36, 6) not null,
  rays_gap_bps numeric(10, 4) not null,
  reason text not null,
  created_at timestamptz not null default now(),
  status text not null
);

create table if not exists agenticyield.executions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references agenticyield.proposals(id) on delete cascade,
  tx_hash text not null,
  gas_used numeric(20, 4) not null,
  slippage_bps numeric(10, 4) not null,
  net_delta_usdc numeric(36, 6) not null,
  created_at timestamptz not null default now()
);

create table if not exists agenticyield.proofs (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references agenticyield.vaults(id) on delete cascade,
  ipfs_uri text not null,
  created_at timestamptz not null default now()
);

create table if not exists agenticyield.incidents (
  id uuid primary key default gen_random_uuid(),
  protocol text not null,
  severity text not null,
  title text not null,
  url text not null,
  occurred_at timestamptz not null
);
