import "@radix-ui/themes/styles.css";
import "./styles.css";

import * as Toast from "@radix-ui/react-toast";
import { Theme } from "@radix-ui/themes";
import { ThirdwebProvider, smartWallet } from "@thirdweb-dev/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ChainId } from "@thirdweb-dev/sdk";

// Initialize Thirdweb Smart Wallet
const root = ReactDOM.createRoot(document.getElementById("root")!);

function Root() {
  const desiredChainId = ChainId.Optimism;

  return (
    <Theme accentColor="iris" radius="large" panelBackground="translucent">
      <BrowserRouter>
        <ThirdwebProvider
          desiredChainId={desiredChainId}
          clientId={process.env.THIRDWEB_CLIENT_ID}
          sdkOptions={{
            gasless: true,
            wallet: new smartWallet({
              chainId: desiredChainId,
              factoryAddress: process.env.SMART_WALLET_FACTORY,
              owner: process.env.OWNER_WALLET_ADDRESS,
            }),
          }}
        >
          <Toast.Provider swipeDirection="right">
            <App />
          </Toast.Provider>
        </ThirdwebProvider>
      </BrowserRouter>
    </Theme>
  );
}

root.render(<Root />);
