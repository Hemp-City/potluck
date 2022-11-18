use anchor_lang::prelude::*;

#[error_code]
pub enum PotluckError{
    #[msg("Not Enough Tickets Left")]
    NotEnoughTicketsLeft,

    #[msg("Session hasn't started yet.")]
    SessionNotStarted,

    #[msg("Session ended")]
    SessionEnded,

    #[msg("Paid tickets limit reached")]
    PaidTicketLimitReached,
    
    #[msg("Invalid Inviter")]
    InvalidInviter,

    #[msg("Inviter session id not matched")]
    InviterSessionIdNotMatched,

    #[msg("Inviter limit reached")]
    InviterLimitReached,

    #[msg("Invalid calculation")]
    InvalidCalculation,

    #[msg("Raffle still running")]
    RaffleStillRunning,
    
    #[msg("Winner already drawn")]
    WinnersAlreadyDrawn,
    
    #[msg("Winner not drawn yet")]
    WinnerNotDrawn,

    #[msg("Not a valid winner")]
    InvalidWinner,
    
    #[msg("Prize already claimed")]
    PrizeAlreadyClaimed,

    #[msg("Prize airdrop failed")]
    PrizeAirdropFailed,

    #[msg("Invalid quantity")]
    InvalidQuantity,

    #[msg("Fees percenetage is not equal to 100")]
    TotalFeesPercNot100,

    #[msg("Treasury claim failed")]
    TreasuryClaimFailed,
}
