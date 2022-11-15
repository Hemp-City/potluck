export type Potluck = {
  "version": "0.1.0",
  "name": "potluck",
  "instructions": [
    {
      "name": "initPotSession",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "maxEntrants",
          "type": "u32"
        },
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "maxPaidTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "maxFreeTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "pricePerTicket",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_user_account"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamTreasuryAssociatedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "quantity",
          "type": "u16"
        }
      ]
    },
    {
      "name": "revealWinner",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "_session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentBlockhashes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updatePotSession",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "_session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "maxPaidTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "maxFreeTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "pricePerTicket",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeUserAccount",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_user_account"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "entrants",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u32"
          },
          {
            "name": "max",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "potSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sessionId",
            "type": "u16"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "winner",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "randomness",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "potClaimed",
            "type": "bool"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "maxPaidTicketsPerEntrant",
            "type": "u16"
          },
          {
            "name": "maxFreeTicketsPerEntrant",
            "type": "u16"
          },
          {
            "name": "pricePerTicket",
            "type": "u64"
          },
          {
            "name": "paymentTokenMint",
            "type": "publicKey"
          },
          {
            "name": "entrants",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "inviteCode",
            "type": "string"
          },
          {
            "name": "currentSessionId",
            "type": "u16"
          },
          {
            "name": "totalInvites",
            "type": "u16"
          },
          {
            "name": "totalFreeTickets",
            "type": "u16"
          },
          {
            "name": "totalPaidTickets",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughTicketsLeft",
      "msg": "Not Enough Tickets Left"
    },
    {
      "code": 6001,
      "name": "SessionNotStarted",
      "msg": "Session hasn't started yet."
    },
    {
      "code": 6002,
      "name": "SessionEnded",
      "msg": "Session ended"
    },
    {
      "code": 6003,
      "name": "PaidTicketLimitReached",
      "msg": "Paid tickets limit reached"
    },
    {
      "code": 6004,
      "name": "InvalidInviter",
      "msg": "Invalid Inviter"
    },
    {
      "code": 6005,
      "name": "InviterSessionIdNotMatched",
      "msg": "Inviter session id not matched"
    },
    {
      "code": 6006,
      "name": "InviterLimitReached",
      "msg": "Inviter limit reached"
    },
    {
      "code": 6007,
      "name": "InvalidCalculation",
      "msg": "Invalid calculation"
    },
    {
      "code": 6008,
      "name": "RaffleStillRunning",
      "msg": "Raffle still running"
    },
    {
      "code": 6009,
      "name": "WinnersAlreadyDrawn",
      "msg": "Winner already drawn"
    },
    {
      "code": 6010,
      "name": "WinnerNotDrawn",
      "msg": "Winner not drawn yet"
    },
    {
      "code": 6011,
      "name": "InvalidWinner",
      "msg": "Not a valid winner"
    },
    {
      "code": 6012,
      "name": "PrizeAlreadyClaimed",
      "msg": "Prize already claimed"
    },
    {
      "code": 6013,
      "name": "PrizeAirdropFailed",
      "msg": "Prize airdrop failed"
    },
    {
      "code": 6014,
      "name": "InvalidQuantity",
      "msg": "Invalid quantity"
    }
  ]
};

export const IDL: Potluck = {
  "version": "0.1.0",
  "name": "potluck",
  "instructions": [
    {
      "name": "initPotSession",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "maxEntrants",
          "type": "u32"
        },
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "maxPaidTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "maxFreeTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "pricePerTicket",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_user_account"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamTreasuryAssociatedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "quantity",
          "type": "u16"
        }
      ]
    },
    {
      "name": "revealWinner",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "_session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentBlockhashes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sessionTreasury",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_treasury"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PotSession",
                "path": "pot_session_acc"
              }
            ]
          }
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "paymentTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sessionBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updatePotSession",
      "accounts": [
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "_session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        },
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "maxPaidTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "maxFreeTicketsPerEntrant",
          "type": "u16"
        },
        {
          "name": "pricePerTicket",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeUserAccount",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_user_account"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "potSessionAcc",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "pot_session_acc"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "session_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "sessionId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "entrants",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u32"
          },
          {
            "name": "max",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "potSession",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sessionId",
            "type": "u16"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "winner",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "randomness",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "potClaimed",
            "type": "bool"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "maxPaidTicketsPerEntrant",
            "type": "u16"
          },
          {
            "name": "maxFreeTicketsPerEntrant",
            "type": "u16"
          },
          {
            "name": "pricePerTicket",
            "type": "u64"
          },
          {
            "name": "paymentTokenMint",
            "type": "publicKey"
          },
          {
            "name": "entrants",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "inviteCode",
            "type": "string"
          },
          {
            "name": "currentSessionId",
            "type": "u16"
          },
          {
            "name": "totalInvites",
            "type": "u16"
          },
          {
            "name": "totalFreeTickets",
            "type": "u16"
          },
          {
            "name": "totalPaidTickets",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughTicketsLeft",
      "msg": "Not Enough Tickets Left"
    },
    {
      "code": 6001,
      "name": "SessionNotStarted",
      "msg": "Session hasn't started yet."
    },
    {
      "code": 6002,
      "name": "SessionEnded",
      "msg": "Session ended"
    },
    {
      "code": 6003,
      "name": "PaidTicketLimitReached",
      "msg": "Paid tickets limit reached"
    },
    {
      "code": 6004,
      "name": "InvalidInviter",
      "msg": "Invalid Inviter"
    },
    {
      "code": 6005,
      "name": "InviterSessionIdNotMatched",
      "msg": "Inviter session id not matched"
    },
    {
      "code": 6006,
      "name": "InviterLimitReached",
      "msg": "Inviter limit reached"
    },
    {
      "code": 6007,
      "name": "InvalidCalculation",
      "msg": "Invalid calculation"
    },
    {
      "code": 6008,
      "name": "RaffleStillRunning",
      "msg": "Raffle still running"
    },
    {
      "code": 6009,
      "name": "WinnersAlreadyDrawn",
      "msg": "Winner already drawn"
    },
    {
      "code": 6010,
      "name": "WinnerNotDrawn",
      "msg": "Winner not drawn yet"
    },
    {
      "code": 6011,
      "name": "InvalidWinner",
      "msg": "Not a valid winner"
    },
    {
      "code": 6012,
      "name": "PrizeAlreadyClaimed",
      "msg": "Prize already claimed"
    },
    {
      "code": 6013,
      "name": "PrizeAirdropFailed",
      "msg": "Prize airdrop failed"
    },
    {
      "code": 6014,
      "name": "InvalidQuantity",
      "msg": "Invalid quantity"
    }
  ]
};
