import "dotenv/config"

process.env.RELAYER_RPC ||= "https://base.blockpi.network/v1/rpc/public"
process.env.RELAYER_PRIVATE_KEY ||= "0x" + "0".repeat(64)
process.env.VAULT_ADDRESS ||= "0x0000000000000000000000000000000000000001"
process.env.USDC_BASE ||= "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
process.env.MAX_SPONSORED_USDC ||= "250"
process.env.RISK_FLOOR ||= "0.60"
process.env.VENUE_CAP_PCT ||= "50"
process.env.SLIPPAGE_MAX_PCT ||= "0.30"
process.env.COOLDOWN_HOURS ||= "6"
process.env.RATE_LIMIT_PER_IP ||= "10"
process.env.SPONSOR_ON ||= "false"
