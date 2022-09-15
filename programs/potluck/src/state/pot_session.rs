// Accounts structs
use anchor_lang::prelude::*;


#[account]
pub struct PotSession{
    pub session_id : u16,
    pub creator:Pubkey,
    pub winner:Option<Pubkey>,
    pub randomness: Option<[u8;32]>,
    pub pot_claimed:bool,
    pub start_timestamp: i64,
    pub end_timestamp:i64,
    pub max_paid_tickets_per_entrant:u16,
    pub max_free_tickets_per_entrant:u16,
    pub price_per_ticket:u64,
    pub payment_token_mint:Pubkey,
    pub entrants:Pubkey
}