use anchor_lang::{prelude::*, solana_program::sysvar};

use crate::{state::{PotSession, Entrants}, TIME_BUFFER, errors::PotluckError, recent_blockhashes, randomness_tools};


#[derive(Accounts)]
#[instruction(_session_id:u16)]
pub struct RevealWinner<'info>{
    #[account(
        mut,
        seeds=[
            b"pot_session_acc".as_ref(),
            _session_id.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
        has_one=entrants // checking if entrants is correct part of the session
    )]
    pub pot_session_acc : Box<Account<'info,PotSession>>, // pot session acc
    
    #[account(mut)]
    pub entrants : Box<Account<'info,Entrants>>,
    
    // pub 
     /// CHECK: sysvar address check is hardcoded, we want to avoid the default deserialization
    #[account(address = sysvar::recent_blockhashes::ID)]
     pub recent_blockhashes: UncheckedAccount<'info>,
    #[account()]
    pub payer : Signer<'info>,
    // pub system_program: Program<'info,System>,
}



pub fn handler(ctx: Context<RevealWinner>,_session_id: u16) -> Result<()> {
    let clock = Clock::get()?;
    let session = &mut ctx.accounts.pot_session_acc;
    let entrants = &ctx.accounts.entrants;
    let end_timestamp_with_buffer = session
        .end_timestamp
        .checked_add(TIME_BUFFER)
        .ok_or(PotluckError::InvalidCalculation)?;
    require!(
        clock.unix_timestamp > end_timestamp_with_buffer,
        PotluckError::RaffleStillRunning
    );

    let randomness =
        recent_blockhashes::last_blockhash_accessor(&ctx.accounts.recent_blockhashes)?;

    match session.randomness {
        Some(_) => return Err(PotluckError::WinnersAlreadyDrawn.into()),
        None => session.randomness = Some(randomness),
    }

    let winner_rand = randomness_tools::expand(randomness, 1);
    let winner_index = winner_rand % entrants.total;

    let winner_pubkey = Entrants::get_entrant(
        entrants.to_account_info().data.borrow(),
        winner_index as usize
    );

    session.winner = Some(winner_pubkey);

    Ok(())
}