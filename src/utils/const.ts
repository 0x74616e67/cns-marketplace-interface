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
      store: "cfxtest:acgm0mug062vbgnvx5kpcm1cey4k2wfvb6s7ewzfth",
      marketplace: "cfxtest:aca7e820j4eypvdbm2069e2cthsu05fzf2z0z32ky3",
      CNS: "cfxtest:acapc3y2j7atme3bawvaex18hs36tn40uu5h6j3mtu",
      CNSUtils: "cfxtest:acfukm0f4whwmtf2y8ehxx44ydptywveay9dsy99aw",
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
