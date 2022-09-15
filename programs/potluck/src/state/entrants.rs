use std::cell::{Ref, RefMut};

use anchor_lang::prelude::*;

use crate::errors::PotluckError;



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
    ) -> Result<()> {
        if self.total >= self.max {
            return Err(PotluckError::NotEnoughTicketsLeft.into());
        }
        let current_index = Entrants::BASE_SIZE + 32 * self.total as usize;
        let entrant_slice: &mut [u8] = &mut entrants_data[current_index..current_index + 32];
        entrant_slice.copy_from_slice(&entrant.to_bytes());
        self.total += 1;

        Ok(())
    }
}