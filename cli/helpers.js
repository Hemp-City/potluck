import * as web3 from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import fs from 'fs';
import {APP_CONFIG} from "./config.js";

//  from '@metaplex-foundation/mpl-token-metadata';

import {PROGRAM_ID,Metadata}  from "@metaplex-foundation/mpl-token-metadata";
import * as spl from '@solana/spl-token';

export function loadWalletKey(keypair){
    // console.log("Keypair path:",keypair)
    if (!keypair || keypair == '') {
      throw new Error('Keypair is required!');
    }
    const loaded = web3.Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
    );

    console.log(`wallet public key: ${loaded.publicKey}`);
    return loaded;
  }

export default class AnchorClient {
    constructor({ programId, config, keypair,idlPath } ) {
        this.programId = programId ;
        this.config = config ;
        this.connection = new anchor.web3.Connection(this.config.httpUri,'finalized');
        console.log('\n\nConnected to', this.config.httpUri);

        const keypair_priv = loadWalletKey(keypair);
        const wallet = new anchor.Wallet(keypair_priv);
        // maps anchor calls to Phantom direction
        // const idl = require(idlPath);
        const idl = JSON.parse(fs.readFileSync(APP_CONFIG.idlPath).toString())
        // console.log(idl)
        this.provider = new anchor.AnchorProvider(this.connection, wallet,{commitment:"finalized"});
        this.program = new anchor.Program(idl, this.programId, this.provider);
        this.eventManager = new anchor.EventManager(programId,this.provider);

    }
}

export function initAnchorClient(keypairPath,appConfig){
  let wallet = loadWalletKey(keypairPath);

  let anchorClient = new AnchorClient({
      programId:appConfig.programId,
      config:{httpUri:appConfig.rpcEndpoint},
      keypair:keypairPath,
      idlPath:appConfig.idlPath
  })
  console.log("anc:",anchorClient.programId);
  return anchorClient
}


/**
 * 
 * @param {web3.Connection} connection 
 * @param {string} mint 
 */
export async function getVerifiedCreator(connection,mint){

  mint = typeof(mint) == "string" ? new web3.PublicKey(mint) : mint
  // await (await spl.getMint(connection,mint)).mintAuthority
  // let mintAuthority = await spl.getMint(connection,mint).mintAuthority.toBase58()
  let metadataPda = await getMetadataPDA(mint)
  let metadata = await Metadata.fromAccountAddress(connection,metadataPda)

  
  return  metadata.data.creators[0] 
}

export async function getMetadataPDA(mint){
  const [publicKey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("metadata"), 
    PROGRAM_ID.toBuffer(), 
    mint.toBuffer()],
    PROGRAM_ID
  );
  return publicKey;
}


/* const getDevPgmId = () => {
    // get the program ID from the solblog-keyfile.json
    let pgmKeypair = anchor.web3.Keypair.fromSecretKey(
        new Uint8Array(solblog_keypair)
    )
    return new anchor.web3.PublicKey(pgmKeypair.publicKey) // Address of the deployed program
} */