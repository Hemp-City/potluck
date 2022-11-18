use std::{ ops::{AddAssign}, };

use anchor_lang::{prelude::*};
use anchor_spl::{token::{ Token, }, associated_token::AssociatedToken};

use crate::{state::{UserAccount, PotSession, Entrants}, errors::PotluckError};


#[derive(Accounts)]
#[instruction(session_id:u16)]
pub struct AddTicket<'info>{

    #[account(
        mut,
        seeds = [
            b"pot_user_account".as_ref(),
            session_id.to_le_bytes().as_ref(),
            user.key().as_ref(),
        ],
        bump,
    )]
    pub user_account: Box<Account<'info,UserAccount>>,

    // serialization is checking the session creator
    #[account(
        mut,
        constraint=pot_session_acc.session_id == session_id, 
        has_one=creator
    )]
    pub pot_session_acc: Box<Account<'info,PotSession>>,

    #[account(
        mut,
        address = pot_session_acc.entrants,
        constraint=entrants.total <= entrants.max @PotluckError::NotEnoughTicketsLeft
    )]
    pub entrants : Box<Account<'info,Entrants>>,

    pub token_program : Program<'info,Token>,

    pub associated_token_program:Program<'info,AssociatedToken>,

    /// CHECK:
    #[account()]
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub creator : Signer<'info>,
    pub system_program: Program<'info,System>,


}

pub fn handler(
    ctx:Context<AddTicket>,
    session_id:u16
)-> Result<()>{

    let clock = Clock::get()?;

    let user_account = &mut ctx.accounts.user_account;

    let session = &mut ctx.accounts.pot_session_acc;
    // let payment_token_mint =  &mut ctx.accounts.payment_token_mint;
    let entrants = &mut ctx.accounts.entrants;
    let entrants_account_info = entrants.to_account_info();
    
    require!(
        clock.unix_timestamp > session.start_timestamp,
        PotluckError::SessionNotStarted
    );
    require!(
        clock.unix_timestamp < session.end_timestamp,
        PotluckError::SessionEnded
    );

    user_account.total_free_tickets.add_assign(1);

    entrants.append_entrant(
        entrants_account_info.try_borrow_mut_data().unwrap(),
        ctx.accounts.user.key(),
        1  
    )?;
    Ok(())
}