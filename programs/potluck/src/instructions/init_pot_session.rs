

use std::str::FromStr;

use anchor_spl::{token::{Mint, TokenAccount, Token}, mint, associated_token::AssociatedToken};

// use anchor_spl::{token, associated_token::get_associated_token_address};

use anchor_lang::{prelude::*};

use crate::state::{PotSession, Entrants};


// admin lock
#[derive(Accounts)]
#[instruction(session_id:u16)]
pub struct InitPotSession<'info>{
    #[account(
        init,
        seeds=[
            b"pot_session_acc".as_ref(),
            session_id.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
        payer = payer,
        space= 8 + PotSession::MAX_SIZE
    )]
    pub pot_session_acc : Box<Account<'info,PotSession>>, // pot session acc
    // pub 

    #[account(
        constraint = crate::VALID_TOKEN_MINTS.contains(&payment_token_mint.key()) == true 
    )]
    pub payment_token_mint: Box<Account<'info,Mint>>,

    #[account(
        init,
        seeds = [ 
            b"pot_session_treasury".as_ref(),
            pot_session_acc.key().as_ref(),
        ],
        bump,
        payer = payer,
        token::mint = payment_token_mint,
        token::authority = pot_session_acc,
    )]
    pub session_treasury: Box<Account<'info,TokenAccount>>,

    // pub team_treasury: Box<Account<'info,AssociatedToken>>
    #[account(zero)]
    entrants : Box<Account<'info,Entrants>>,
    
    #[account(mut)]
    pub payer : Signer<'info>,
    pub token_program : Program<'info,Token>,

    pub system_program: Program<'info,System>,
    pub rent: Sysvar<'info,Rent>,
}




pub fn handler(
    ctx:Context<InitPotSession>,
    session_id:u16,
    max_entrants:u32,
    start_timestamp:i64,
    end_timestamp:i64,
    max_paid_tickets_per_entrant:u16, // using $SOL or $USDC
    max_free_tickets_per_entrant:u16, //using invites etc
    price_per_ticket:u64,
) -> Result<()>{
    let session = &mut ctx.accounts.pot_session_acc;
    session.entrants = ctx.accounts.entrants.key();
    session.creator = ctx.accounts.payer.key();
    session.session_id = session_id;
    session.max_paid_tickets_per_entrant = max_paid_tickets_per_entrant;
    session.max_free_tickets_per_entrant= max_free_tickets_per_entrant;
    session.price_per_ticket = price_per_ticket;
    session.start_timestamp = start_timestamp;
    session.end_timestamp = end_timestamp;
    session.payment_token_mint = ctx.accounts.payment_token_mint.key();

    session.randomness = None;
    session.pot_claimed = false;
    session.winner = None;
    // msg!("POTLUCK LOG INIT POT: {:?},{:?},{:?}",start_timestamp,end_timestamp,ctx.accounts.payment_token_mint.key().to_string());
    let entrants  = &mut ctx.accounts.entrants;
    entrants.max = max_entrants;
    entrants.total = 0;
    
    Ok(())
}