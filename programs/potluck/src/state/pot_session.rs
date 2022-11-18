// Accounts structs
use anchor_lang::prelude::*;

#[account]
pub struct PotSession{
    pub session_id : u16,
    pub creator:Pubkey,
    pub winner: Option<String>,
    // pub winner:Option<Pubkey>,
    pub randomness: Option<[u8;32]>,
    pub pot_claimed:bool,
    pub start_timestamp: i64,
    pub end_timestamp:i64,
    pub max_paid_tickets_per_entrant:u16,
    pub max_free_tickets_per_entrant:u16,
    pub price_per_ticket:u64,
    pub payment_token_mint:Pubkey,
    pub entrants:Pubkey,
    pub fee_distribution:Option<Vec<u8>> // player,team,protocol // max 3
}

impl PotSession {
    pub const MAX_SIZE :usize = 2 + 32 + (1 + 4 + 6) + (1+ 1*32) + 1 +  8 + 8 + 2 + 2 + 8 + 32 + 32 + (4 + 1 + 1*3);
}