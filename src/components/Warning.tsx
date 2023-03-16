import Wallet from "@cfxjs/use-wallet";
import { useCallback, useMemo } from "react";

const wallet = new Wallet("conflux", { mustBeFluent: true });

export default function Warning() {
  const status = wallet.useStatus();
  const chainId = wallet.useChainId();

  const handleClick = useCallback(() => {
    if (status === "not-active") {
      wallet.connect();
    }
  }, [status]);

  const handleSwitch = useCallback(() => {
    if (chainId !== "1") {
      wallet.switchChain("0x1");
    }
  }, [chainId]);

  const text = useMemo(() => {
    let text: React.ReactNode = "";

    if (status === "active" && chainId !== "1") {
      text = (
        <div>
          Please{" "}
          <a
            href="javascript:void(0);"
            className="text-blue-300"
            onClick={handleSwitch}
          >
            switch
          </a>{" "}
          network to Conflux Testnet
        </div>
      );
    } else {
      text = {
        "in-detecting": "",
        "not-installed": (
          <a href="https://fluentwallet.com/" target="_blank">
            Install Wallet
          </a>
        ),
        "not-active": (
          <div>
            Please{" "}
            <a
              href="javascript:void(0);"
              className="text-blue-300"
              onClick={handleClick}
            >
              login
            </a>{" "}
            first
          </div>
        ),
        "in-activating": "Connecting",
        active: "",
      }[status];
    }

    return text;
  }, [status]);

  return text ? <div className="p-3 bg-orange-200">{text}</div> : null;
}
