use std::{cell::RefMut, str::FromStr, ops::AddAssign};

use anchor_lang::prelude::*;
use anchor_spl::{token::{TokenAccount, Mint, Token, self}, associated_token::AssociatedToken};

use crate::{state::{UserAccount, PotSession, Entrants}, errors::PotluckError, TEAM_TREASURY, TEAM_FEES_PERC, POT_PERC, INVITES_PER_TICKET};


#[derive(Accounts)]
#[instruction(session_id:u16)]
pub struct BuyTicket<'info>{

    #[account(
        init_if_needed,
        seeds = [
            b"pot_user_account".as_ref(),
            session_id.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
        space = 8 + UserAccount::MAX_SIZE,
        payer = payer,
    )]
    pub user_account: Box<Account<'info,UserAccount>>,

    #[account(mut,constraint=pot_session_acc.session_id == session_id)]
    pub pot_session_acc: Box<Account<'info,PotSession>>,

    #[account(mut,
        seeds = [ 
            b"pot_session_treasury".as_ref(),
            pot_session_acc.key().as_ref(),
        ],
        bump
    )]
    pub session_treasury: Box<Account<'info,TokenAccount>>,

    #[account(address=pot_session_acc.payment_token_mint)]
    pub payment_token_mint : Box<Account<'info,Mint>>,

    #[account(
        mut,
        associated_token::mint=payment_token_mint,
        associated_token::authority = payer
    )]
    pub buyer_token_account: Box<Account<'info,TokenAccount>>, 

    #[account(
        mut,
        address = pot_session_acc.entrants,
        constraint=entrants.total <= entrants.max @PotluckError::NotEnoughTicketsLeft
    )]
    pub entrants : Box<Account<'info,Entrants>>,

    #[account(
        mut, 
        associated_token::mint=payment_token_mint,
        associated_token::authority = Pubkey::from_str(TEAM_TREASURY).unwrap()
     )]
    pub team_treasury_associated_account: Box<Account<'info,TokenAccount>>,

    #[account(mut)]
    pub inviter_account:Box<Account<'info,UserAccount>>,
    pub token_program : Program<'info,Token>,

    pub associated_token_program:Program<'info,AssociatedToken>,

    #[account(mut)]
    pub payer : Signer<'info>,
    pub system_program: Program<'info,System>,

}

// price_per_ticket
pub fn handler(
    ctx:Context<BuyTicket>,
    session_id:u16,
    identifier:String,
    invite_code:String, // optional

)->Result<()>{

    let clock = Clock::get()?;

    let user_account = &mut ctx.accounts.user_account;

    let session = &mut ctx.accounts.pot_session_acc;
    let session_treasury = &mut ctx.accounts.session_treasury;
    // let payment_token_mint =  &mut ctx.accounts.payment_token_mint;
    let entrants = &mut ctx.accounts.entrants;
    let entrants_account_info = entrants.to_account_info();
    let remaining_accounts = &mut ctx.remaining_accounts.iter();
    let mut assert_inviter_ok:bool= false;
    let mut inviter_pubkey:Pubkey;
    // check for start timestamp and end timestamp
    // msg!("Unix Timestamp: {:?}",clock.unix_timestamp);
    // return Ok(());
    require!(
        clock.unix_timestamp > session.start_timestamp,
        PotluckError::SessionNotStarted
    );
    require!(
        clock.unix_timestamp < session.end_timestamp,
        PotluckError::SessionEnded
    );

    

    // initialize the user account if the owner is none/empty
    if user_account.owner.is_none() {
        user_account.owner = Some(ctx.accounts.payer.key());
        // user_account.identifier = StringSanitizer::try_from(identifier).unwrap().to_string();
        user_account.identifier = identifier;
        unsafe{
            user_account.invite_code = 
                ctx.accounts.payer
                .key()
                .to_string()
                .get_unchecked(0..6)
                .to_string();
        }
        user_account.current_session_id = session_id; // check done in Accounts struct
        user_account.total_invites = 0;
        user_account.total_free_tickets = 0;
        user_account.total_paid_tickets = 0;    

        // ctx.remaining_accounts[0].try


        // if there is an invitation get the user account and update after checking the free tickets

        let inviter_info = next_account_info(remaining_accounts);

        
        // checking if there is an inviter account else move on
        if inviter_info.as_ref().is_ok(){

            add_inviter_entry(
                inviter_info.unwrap(),
                ctx.accounts.payer.key(),
                session.max_free_tickets_per_entrant,
                session.session_id,
                entrants,
            entrants_account_info.data.borrow_mut(),
            )?;
        }
        
        // add inviter entry else throw error            

    }


    // check if user can buy any more tokens
    require!(
        session.max_paid_tickets_per_entrant > user_account.total_paid_tickets,
        PotluckError::PaidTicketLimitReached
    );

    // add entrants
    entrants.append_entrant(
        entrants_account_info.data.borrow_mut(),
        ctx.accounts.payer.key()
    )?;

    // transfer money from the account to session pot

    let team_fee =  ((session.price_per_ticket as f64) * ((TEAM_FEES_PERC as f64 / 100 as f64))) as u64 ;
    let ticket_amount:u64 =  ((session.price_per_ticket as f64) * ((POT_PERC as f64 / 100 as f64))) as u64;
    
    
    token::transfer(
        CpiContext::new(

            ctx.accounts.token_program.to_account_info(),
            token::Transfer{
                from:ctx.accounts.buyer_token_account.to_account_info(),
                to:session_treasury.to_account_info(), 
                authority: ctx.accounts.payer.to_account_info()
            }
        )
        , ticket_amount)?;

    // transfer funds to the team treasury

    token::transfer(
        CpiContext::new(

            ctx.accounts.token_program.to_account_info(),
            token::Transfer{
                from:ctx.accounts.buyer_token_account.to_account_info(),
                to:ctx.accounts.team_treasury_associated_account.to_account_info(), 
                authority: ctx.accounts.payer.to_account_info()
            }
        )
        , team_fee)?;

    
    // update user account and session state

    user_account.total_paid_tickets.add_assign(1);

    Ok(())
}


/*  
    wild case: if buyer tries to buy the last ticket with invitation it will fail as after appending the inviter it can't append the buyer
*/
fn add_inviter_entry<'info>(
    inviter_info:  &AccountInfo<'info>,
    payer: Pubkey,
    max_free_tickets:u16,
    session_id: u16,
    entrants:&mut Account<Entrants>,
    entrants_data:RefMut<&mut [u8]>,
) -> Result<()>{

   
    // serialize inviter pda account
    // reference: https://github.com/gemworks/gem-farm/blob/main/programs/gem_bank/src/instructions/deposit_gem.rs#L131
    let inviter_user_acc_pda = &mut Account::<'info,UserAccount>::try_from(&inviter_info)?;

     // check payer and inviter are not same
    require_keys_neq!(inviter_user_acc_pda.owner.unwrap(),payer,PotluckError::InvalidInviter);

    // check if the session ids are same
    require_eq!(inviter_user_acc_pda.current_session_id,session_id,PotluckError::InviterSessionIdNotMatched);

    // check if session max invites achieved or not
    // for every 2 invites add ticket // compare with the const variable

    inviter_user_acc_pda.total_invites.add_assign(1);

    // free_tcts = tt_invites/INVITES_PER_TCT - tt_free_tcts
    let free_tickets = inviter_user_acc_pda.total_invites
        .checked_div(INVITES_PER_TICKET).unwrap()
        .checked_sub(inviter_user_acc_pda.total_free_tickets).unwrap();

    if free_tickets > 0 && inviter_user_acc_pda.total_free_tickets < max_free_tickets {

        inviter_user_acc_pda.total_free_tickets.add_assign(1);

        entrants.append_entrant(entrants_data, inviter_user_acc_pda.owner.unwrap())?;
        // return Ok(());
        // entrants.append_entrant(entrants_data, entrant)
        // inviter_user_acc_pda.a
    }    
    // adding one more ticket

    Ok(())

    // Err(error!(PotluckError::InvalidInviter))
    

}