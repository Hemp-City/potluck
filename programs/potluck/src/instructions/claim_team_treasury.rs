
use anchor_lang::prelude::*;
use anchor_spl::{token::{TokenAccount, Token, Mint, self}, associated_token::AssociatedToken};

use crate::state::PotSession;
use crate::errors::PotluckError;

#[derive(Accounts)]
// #[instruction(session_id:u16)]

pub struct ClaimTeamTreasury<'info>{

    #[account(mut,has_one=creator)]
    pub pot_session_acc: Box<Account<'info,PotSession>>,

    #[account(mut,
        seeds = [ 
            b"pot_team_treasury".as_ref(),
            pot_session_acc.key().as_ref(),
        ],
        bump
    )]
    pub team_treasury: Box<Account<'info,TokenAccount>>,

    #[account(
        mut,
        associated_token::mint=payment_token_mint,
        associated_token::authority = creator
    )]
    pub receiver_token_account: Box<Account<'info,TokenAccount>>, 
    
    #[account(address=pot_session_acc.payment_token_mint)]
    pub payment_token_mint : Box<Account<'info,Mint>>,

    #[account(mut)]
    pub creator : Signer<'info>,

    pub token_program : Program<'info,Token>,
    pub associated_token_program:Program<'info,AssociatedToken>,

    pub system_program: Program<'info,System>,
}

pub fn handler(ctx:Context<ClaimTeamTreasury>,session_bump:u8) -> Result<()>{

    let session = &mut ctx.accounts.pot_session_acc;
    let team_treasury = &mut ctx.accounts.team_treasury;
    let receiver_token_acc = &mut ctx.accounts.receiver_token_account;
    
    // TODO: Pot team treasury can only be claimed after session ending

    // transfer tokens from team treasury to another account

    let pot_session_bump = session_bump.to_be_bytes();

    let session_id = session.session_id.to_le_bytes();
    let pot_session_seeds = &[
        b"pot_session_acc".as_ref(),
        session_id.as_ref(),
        session.creator.as_ref(),
        pot_session_bump.as_ref()
    ];

    // Pubkey::try_find_program_address(team_treasury_seeds, )

    token::transfer(
        CpiContext::new(

            ctx.accounts.token_program.to_account_info(),
            token::Transfer{
                from: team_treasury.to_account_info(), 
                to: receiver_token_acc.to_account_info(),
                authority: session.to_account_info(),
            },
        )
        .with_signer(&[pot_session_seeds])
        ,team_treasury.amount
    ).map_err(|_e|PotluckError::TreasuryClaimFailed)?;


    Ok(())
    // check session ended
    // is user is the winner

}

/* 
TODO:
1. In future we can ask for winner to give some % in donations while claiming. They can select 0-90%
2. 
*/