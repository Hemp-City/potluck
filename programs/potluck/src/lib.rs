
use anchor_lang::prelude::*;

use anchor_spl::mint;
use instructions::*;

pub mod instructions;
pub mod state;
pub mod errors;

pub mod utils;
pub mod randomness_tools;
pub mod recent_blockhashes;
// use sanitizer::StringSanitizer;
// use anchor_spl::token::{TokenAccount, Token, Mint, Transfer};

const INVITES_PER_TICKET:u16 = 1; // 1 Free ticket for every 2 invites  
const TEAM_TREASURY:&str = "6rhreNsCWgcLha4AViLwHGBV9vKCw6wVi486SYf6JLvR";
const TEAM_FEES_PERC:u8 = 10;
const POT_PERC:u8 = 90;
const TIME_BUFFER:i64 =20;

declare_id!("PoTeh9dW9VEr6ApxiLintTRoWmZDF6GDRrtSu7zbTo4");

pub use crate::usdc_devnet::ID as USDC_DEVNET;

mod usdc_devnet {
    use super::*;
    declare_id!("9m1AUciQjityTXiqPnV1KyVZK2dzVAxFxdSVSNeJhosX"); // minted the address on devnet | USDC Dummy
    // declare_id!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
}
pub static  VALID_TOKEN_MINTS: [Pubkey;2] = [USDC_DEVNET,mint::USDC];

/* 
    1. init pot session
        - set : session acc, id, max entrants, max(paid,free) tickets, price per ticket, start + end timestamp, entrants account
    2. buy ticket
        - init user account if needed
            - set if needed : invite code, id etc.
        - debit payment and transfer to the treasury
    3. Declare Winner
    4. Claim prize
*/



#[program]
pub mod potluck {
   
    use super::*;

    pub fn init_pot_session(
        ctx:Context<InitPotSession>,
        session_id:u16,
        max_entrants:u32,
        start_timestamp:i64,
        end_timestamp:i64,
        max_paid_tickets_per_entrant:u16, // using $SOL or $USDC
        max_free_tickets_per_entrant:u16, //using invites etc
        price_per_ticket:u64,
    ) -> Result<()>{
               
        instructions::init_pot_session::handler(
            ctx, 
            session_id,
            max_entrants, 
            start_timestamp, 
            end_timestamp, 
            max_paid_tickets_per_entrant, 
            max_free_tickets_per_entrant, 
            price_per_ticket
        )
    }

    pub fn buy_ticket(
        ctx:Context<BuyTicket>,
        session_id:u16,
        quantity:u16
        // identifier:String,
        // invite_code:String, // optional

    ) -> Result<()> {

        instructions::buy_ticket::handler(ctx, session_id,quantity)

    }

    pub fn reveal_winner(ctx: Context<RevealWinner>,session_id: u16) -> Result<()> {

        instructions::reveal_winner::handler(ctx, session_id)

    }

    pub fn claim_prize(ctx: Context<ClaimPrize>,session_bump:u8) -> Result<()>{

        instructions::claim_prize::handler(ctx,session_bump)
        
    }
    pub fn update_pot_session(
        ctx:Context<UpdateSession>,
        session_id:u16,
        start_timestamp:i64,
        end_timestamp:i64,
        max_paid_tickets_per_entrant:u16,
        max_free_tickets_per_entrant:u16,
        price_per_ticket:u64,
    ) -> Result<()>{

        instructions::update_session::handler(
            ctx, 
            session_id, 
            start_timestamp, 
            end_timestamp, 
            max_paid_tickets_per_entrant,
             max_free_tickets_per_entrant,
             price_per_ticket
        )
    }

    pub fn close_user_account(
        ctx:Context<CloseUserAccount>,
        session_id:u16,
    )->Result<()>{

        instructions::close_user_account::handler(ctx, session_id)
    }

}

// TODO:CLAIM PRIZE FUNCTION

/* 
    TODO: 
    1. invites code - the invite code should identify the account from the frontend itself and verify on contract.
    2. only first time user invited can be added for free tickets (new users only)
*/



