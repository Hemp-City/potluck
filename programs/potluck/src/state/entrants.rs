use std::{cell::{Ref, RefMut}, ops::Add, borrow::Borrow};

use anchor_lang::prelude::*;

use crate::errors::PotluckError;


// TODO: 1. Pot session can only be created with Pot as a signer
//       2. Set Entrant version 2 
#[account]
pub struct Entrants {
    pub total: u32,
    pub max: u32,
    // Entrants array of length max
    // pub entrants: [Pubkey; max],
}

impl Entrants {
    /// The size of entrants excluding the entrants array
    const BASE_SIZE: usize = 8 + 4 + 4;

    pub fn get_entrant(entrants_data: Ref<&mut [u8]>, index: usize) -> Pubkey {
        let start_index = Entrants::BASE_SIZE + 32 * index;
        Pubkey::new(&entrants_data[start_index..start_index + 32])
    }

    pub fn append_entrant(
        &mut self,
        mut entrants_data: RefMut<&mut [u8]>,
        entrant: Pubkey,
        quantity:u16,
    ) -> Result<()> {
        if self.total.add(quantity as u32) >= self.max {
            return Err(PotluckError::NotEnoughTicketsLeft.into());
        }

        msg!("Appending entrant {}",entrant.to_string());
        let current_index = Entrants::BASE_SIZE + 32 * self.total as usize;
        let entrant_slice: &mut [u8] = &mut entrants_data[current_index..current_index + 32*quantity as usize];
        entrant_slice.copy_from_slice(&entrant.to_bytes().repeat(quantity as usize));

        self.total += quantity as u32;

        Ok(())
    }
    // append only invite code
    pub fn append_entrant_v2(
        &mut self,
        mut entrants_data: RefMut<&mut [u8]>,
        entrant: Pubkey,
        quantity:u16,
    ) -> Result<()> {
        if self.total.add(quantity as u32) >= self.max {
            return Err(PotluckError::NotEnoughTicketsLeft.into());
        }
        let sliced_entrant_code = &entrant.to_bytes()[0 .. 6];
        msg!("Appending entrant {}",entrant.to_string());
        let current_index = Entrants::BASE_SIZE + 6 * self.total as usize;
        let entrant_slice: &mut [u8] = &mut entrants_data[current_index..current_index + 6*quantity as usize];
        // entrant_slice.copy_from_slice(&entrant.to_bytes().repeat(quantity as usize));
        entrant_slice.copy_from_slice(sliced_entrant_code.repeat(quantity  as usize).as_ref());

        self.total += quantity as u32;

        Ok(())
    }
}