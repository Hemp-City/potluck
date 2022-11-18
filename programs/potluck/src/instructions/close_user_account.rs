use anchor_lang::prelude::*;

use crate::state::{UserAccount, PotSession};


#[derive(Accounts)]
#[instruction(session_id:u16)]
pub struct CloseUserAccount<'info>{
    #[account(
        mut,
        close = payer,
        seeds = [
            b"pot_user_account".as_ref(),
            session_id.to_le_bytes().as_ref(),
            user.key().as_ref(),
        ],
        bump,
    )]
    pub user_account: Box<Account<'info,UserAccount>>,

    #[account(
        mut,
        seeds=[
            b"pot_session_acc".as_ref(),
            session_id.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
    )]
    pub pot_session_acc : Box<Account<'info,PotSession>>, // pot session acc
    
    /// CHECK: Just getting the user account
    #[account()]
    pub user:UncheckedAccount<'info>,
    pub payer:Signer<'info>,
}


// price_per_ticket
pub fn handler(
    ctx:Context<CloseUserAccount>,
    session_id:u16,

)->Result<()>{

    msg!("User account {} closed for session {}!",ctx.accounts.user.key.to_string(),session_id);
    Ok(())
}