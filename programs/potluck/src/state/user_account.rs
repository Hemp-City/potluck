
use anchor_lang::prelude::*;

#[account]
pub struct UserAccount{
    pub owner:Option<Pubkey>,
    // pub identifier:String, // ip/storage-id sha-1 hashed
    pub invite_code:String,
    pub current_session_id:u16,
    pub total_invites:u16,
    pub total_free_tickets:u16,
    pub total_paid_tickets:u16
}

impl UserAccount {
    // + (4+ 40)for identifier
    pub const MAX_SIZE:usize = (1+32) +(4+6)+2+2+2+2; // for string 4 + length in bytes  
}