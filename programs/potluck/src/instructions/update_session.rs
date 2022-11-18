use anchor_lang::prelude::*;
use crate::state::{ PotSession};
use crate::errors::PotluckError;

#[derive(Accounts)]
#[instruction(_session_id:u16)]
pub struct UpdateSession<'info>{
    #[account(
        mut,
        seeds=[
            b"pot_session_acc".as_ref(),
            _session_id.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
        // has_one=entrants // checking if entrants is correct part of the session
    )]
    pub pot_session_acc : Box<Account<'info,PotSession>>, // pot session acc    
    #[account()]
    pub payer : Signer<'info>,
}

pub fn handler(
    ctx:Context<UpdateSession>,
    _session_id:u16,
    start_timestamp:i64,
    end_timestamp:i64,
    max_paid_tickets_per_entrant:u16,
    max_free_tickets_per_entrant:u16,
    price_per_ticket:u64,
) -> Result<()>{

    let session = &mut ctx.accounts.pot_session_acc;

    let clock = Clock::get().unwrap();
    require!(clock.unix_timestamp < session.end_timestamp, PotluckError::SessionEnded);

    session.start_timestamp = start_timestamp;
    session.end_timestamp = end_timestamp;
    session.max_paid_tickets_per_entrant = max_paid_tickets_per_entrant;
    session.max_free_tickets_per_entrant = max_free_tickets_per_entrant;
    session.price_per_ticket = price_per_ticket;

    Ok(())

}