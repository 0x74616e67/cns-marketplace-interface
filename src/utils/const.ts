import StoreABI from "../../contracts/abi/IStore.json";
import MarketplaceABI from "../../contracts/abi/Marketplace.json";
import NameWrapperABI from "../../contracts/abi/NameWrapper.json";
import CNSUtilsABI from "../../contracts/abi/CNSUtils.json";

export const NETWORK = "testnet";

export const CONFIG = {
  testnet: {
    networkId: 1,
    rpc: "https://test.confluxrpc.com",
    contracts: {
      store: "cfxtest:achcazfj1k4xbyt6psg24fxd57nzar0tv2f4k81y2r",
      marketplace: "cfxtest:acdz9urb2f2j12ec6k2v1ub3teyz0y4jwjajh9bdte",
      CNS: "cfxtest:acapc3y2j7atme3bawvaex18hs36tn40uu5h6j3mtu",
      CNSUtils: "cfxtest:achmezcg08v6t9p1nr887182epmtdfn66j9jh9xgn7",
    },
  },
}[NETWORK];

export const ABI = {
  store: StoreABI,
  marketplace: MarketplaceABI,
  NameWrapper: NameWrapperABI,
  CNSUtils: CNSUtilsABI,
};

export const DEFAULT_PRICE = 1;
export const DEFAULT_FEE = 0.025; // 2.5%, should retrieve from cns marketplace contract

export const DEFAULT_SKIP = 0;
export const DEFAULT_LIMIT = 10000;
