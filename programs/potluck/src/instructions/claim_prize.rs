use anchor_lang::prelude::*;
use anchor_spl::{token::{TokenAccount, Token, Mint, self}, associated_token::AssociatedToken};

use crate::state::PotSession;
use crate::errors::PotluckError;

#[derive(Accounts)]
// #[instruction(session_id:u16)]

pub struct ClaimPrize<'info>{

    #[account(mut)]
    pub pot_session_acc: Box<Account<'info,PotSession>>,

    #[account(mut,
        seeds = [ 
            b"pot_session_treasury".as_ref(),
            pot_session_acc.key().as_ref(),
        ],
        bump
    )]
    pub session_treasury: Box<Account<'info,TokenAccount>>,


    #[account(
        mut,
        associated_token::mint=payment_token_mint,
        associated_token::authority = payer
    )]
    pub buyer_token_account: Box<Account<'info,TokenAccount>>, 
    
    #[account(address=pot_session_acc.payment_token_mint)]
    pub payment_token_mint : Box<Account<'info,Mint>>,

    #[account(mut)]
    pub payer : Signer<'info>,

    pub token_program : Program<'info,Token>,
    pub associated_token_program:Program<'info,AssociatedToken>,

    pub system_program: Program<'info,System>,
}

pub fn handler(ctx:Context<ClaimPrize>) -> Result<()>{

    let session = &mut ctx.accounts.pot_session_acc;
    let session_treasury = &mut ctx.accounts.session_treasury;
    let buyer_token_acc = &mut ctx.accounts.buyer_token_account;
    
    // winner revealed or not | this also checks if session ended or not
    // require_neq!(session.winner,None,PotluckError::WinnerNotDrawn);

    if session.winner.is_none() {
        return err!(PotluckError::WinnerNotDrawn);
    }

    // invalid winner check
    require_eq!(session.winner.unwrap(),ctx.accounts.payer.key(),PotluckError::InvalidWinner);
    
    // winner already claimed or not
    require_neq!(session.pot_claimed,true,PotluckError::PrizeAlreadyClaimed);
    
    // require_eq!(session.winner,Some())

    // transfer tokens from treasury to winner

    let session_key = session.key();
    let session_treasury_seeds = &[
        b"pot_session_treasury".as_ref(),
        session_key.as_ref(),
        // bump,
    ];

    token::transfer(
        CpiContext::new(

            ctx.accounts.token_program.to_account_info(),
            token::Transfer{
                from: session_treasury.to_account_info(), 
                to: buyer_token_acc.to_account_info(),
                authority: session_treasury.to_account_info()
            }
        )
        .with_signer(&[session_treasury_seeds])
        ,session_treasury.amount
    )
    .or(Err(PotluckError::PrizeAirdropFailed))?;

    
    // set pot claimed to true
    session.pot_claimed = true;

    Ok(())
    // check session ended
    // is user is the winner

}

/* 
TODO:
1. In future we can ask for winner to give some % in donations while claiming. They can select 0-90%
2. 
*/