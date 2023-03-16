import { Button } from "antd";
import Wallet from "@cfxjs/use-wallet";
import { useCallback, useMemo } from "react";
import { formatAddress } from "../utils";

const wallet = new Wallet("conflux", { mustBeFluent: true });

export default function ConnectWalletButton() {
  const status = wallet.useStatus();
  const account = wallet.useAccount();
  const chainId = wallet.useChainId();

  const handleClick = useCallback(() => {
    if (status === "not-active") {
      wallet.connect();
    } else {
      if (chainId !== "1") {
        wallet.switchChain("0x1");
      }
    }
  }, [status, chainId]);

  const text = useMemo(() => {
    let text: React.ReactNode = "";

    if (status === "active" && chainId !== "1") {
      text = "Switch Network";
    } else {
      text = {
        "in-detecting": "",
        "not-installed": (
          <a href="https://fluentwallet.com/" target="_blank">
            Install Wallet
          </a>
        ),
        "not-active": "Login",
        "in-activating": "Connecting",
        active: account,
      }[status];
    }

    return text;
  }, [status]);

  return (
    <Button
      className="float-right mt-3"
      type="primary"
      onClick={handleClick}
      size="large"
    >
      {typeof text === "string" ? formatAddress(text) : text}
    </Button>
  );
}
