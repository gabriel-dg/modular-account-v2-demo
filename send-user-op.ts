import { createModularAccountV2Client } from "@account-kit/smart-contracts";
import { LocalAccountSigner } from "@aa-sdk/core";
import { sepolia, alchemy } from "@account-kit/infra";
import { parseEther } from "viem";
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

// Get the private key from environment variables
const PRIVATE_KEY = process.env.MODULAR_ACCOUNT_PRIVATE_KEY;

// Check if private key is provided
if (!PRIVATE_KEY) {
  console.error("\n❌ ERROR: MODULAR_ACCOUNT_PRIVATE_KEY is not set in the .env file");
  console.error("\nPlease run 'npx tsx get-account-address.ts' first to generate a private key");
  console.error("Then add the displayed private key to your .env file");
  throw new Error("MODULAR_ACCOUNT_PRIVATE_KEY is not set in the .env file");
}

// The address you want to interact with (Vitalik's address in this example)
const TARGET_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

// The amount of ETH to send (0 for this example)
const ETH_AMOUNT = "0";

// Optional: The data to include in the transaction (empty for this example)
const CALL_DATA = "0x";

// Main function to send a user operation
async function main() {
  console.log("=== SENDING USER OPERATION ===");
  console.log("Initializing with the private key from environment variables...");

  // Create the signer from the private key
  const signer = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY as `0x${string}`);
  const signerAddress = await signer.getAddress();
  console.log("Signer EOA address:", signerAddress);

  // Initialize the Modular Account V2 client
  console.log("\nCreating Modular Account V2 client...");
  const accountClient = await createModularAccountV2Client({
    chain: sepolia,
    transport: alchemy({ apiKey }),
    signer: signer,
  });

  // Get and display the account address
  const smartAccountAddress = await accountClient.account.address;
  console.log("Modular Account V2 Address:", smartAccountAddress);
  
  // Prepare to send the user operation
  console.log("\nPreparing to send User Operation:");
  console.log(`Target: ${TARGET_ADDRESS}`);
  console.log(`Value: ${ETH_AMOUNT} ETH`);
  console.log(`Data: ${CALL_DATA}`);

  try {
    // Send the user operation
    console.log("\nSending user operation...");
    const operation = await accountClient.sendUserOperation({
      uo: {
        target: TARGET_ADDRESS,
        data: CALL_DATA,
        value: parseEther(ETH_AMOUNT),
      },
    });
    
    console.log("\n✅ USER OPERATION SENT SUCCESSFULLY!");
    console.log("User Operation Hash:", operation.hash);
    console.log("Account Address:", operation.request.sender);
    console.log("\nYou can view this transaction on Sepolia Etherscan:");
    console.log(`https://sepolia.etherscan.io/tx/${operation.hash}`);
    console.log(`https://sepolia.etherscan.io/address/${smartAccountAddress}`);
    
    return operation;
  } catch (error: any) {
    console.error("\n❌ ERROR SENDING USER OPERATION:");
    if (error.details && typeof error.details === 'string' && error.details.includes("sender balance and deposit together is 0")) {
      console.error("The account doesn't have enough funds. Please fund the account address shown above.");
      const match = error.details.match(/must be at least (\d+)/);
      if (match && match[1]) {
        console.error("Required funds:", match[1], "wei (approximately", (parseInt(match[1]) / 1e18).toFixed(6), "ETH)");
      }
    } else {
      console.error(error);
    }
    throw error;
  }
}

// Execute the main function
main()
  .then(() => {
    console.log("\nScript completed successfully!");
  })
  .catch((error) => {
    console.error("\nScript failed with error:", error);
    process.exit(1);
  }); 