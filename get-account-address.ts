import { createModularAccountV2Client } from "@account-kit/smart-contracts";
import { LocalAccountSigner } from "@aa-sdk/core";
import { sepolia, alchemy } from "@account-kit/infra";
import { generatePrivateKey } from "viem/accounts";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the API key from environment variables
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Check if API key is provided
if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set in the .env file");
}

// Now TypeScript knows ALCHEMY_API_KEY is definitely a string
const apiKey: string = ALCHEMY_API_KEY;

// Get the private key from environment variables or generate a new one
const ENV_PRIVATE_KEY = process.env.MODULAR_ACCOUNT_PRIVATE_KEY;

// Main function to calculate and display the account address
async function main() {
  // Generate or use an existing private key
  let privateKey;
  if (ENV_PRIVATE_KEY) {
    privateKey = ENV_PRIVATE_KEY as `0x${string}`;
    console.log("\n=== USING EXISTING ACCOUNT ===");
    console.log("Using private key from environment variables");
    console.log("Make sure your .env file is secure and not committed to version control");
  } else {
    privateKey = generatePrivateKey();
    console.log("\n=== GENERATING NEW ACCOUNT ===");
    console.log("Generated new private key:");
    console.log(privateKey);
    console.log("\n⚠️ IMPORTANT: Add this private key to your .env file to reuse this account");
    console.log("MODULAR_ACCOUNT_PRIVATE_KEY=" + privateKey);
  }

  // Create the private key signer using the official pattern
  const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
  const signerAddress = await signer.getAddress();
  console.log("\nSigner EOA address (the owner):", signerAddress);

  // Initialize the Modular Account V2 client to calculate the address
  console.log("\nCalculating Modular Account V2 address...");
  const accountClient = await createModularAccountV2Client({
    chain: sepolia,
    transport: alchemy({ apiKey }),
    signer: signer,
  });

  // Get the smart account address
  const smartAccountAddress = await accountClient.account.address;
  
  console.log("\n==================================================");
  console.log("📋 MODULAR ACCOUNT V2 ADDRESS: " + smartAccountAddress);
  console.log("==================================================");
  console.log("⚠️ IMPORTANT: Fund this address with Sepolia ETH before running the sendUserOp script");
  console.log("You can get Sepolia ETH from a faucet like https://sepoliafaucet.com/");
  console.log("Recommended amount: 0.0001 ETH\n");
  
  return {
    privateKey,
    signerAddress,
    smartAccountAddress
  };
}

// Execute the main function
main()
  .then(() => {
    console.log("Account address calculation complete!");
  })
  .catch((error) => {
    console.error("Error:", error);
  }); 