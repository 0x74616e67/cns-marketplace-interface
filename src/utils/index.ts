import { Conflux } from "js-conflux-sdk";
import { CONFIG } from "./const";
import Wallet, { provider } from "@cfxjs/use-wallet";
import { ABI } from "./const";

export const wallet = new Wallet("conflux", { mustBeFluent: true });

export const conflux = new Conflux({
  networkId: CONFIG.networkId,
  url: CONFIG.rpc,
});

conflux.provider = provider;

export const namewrapper = conflux.Contract({
  address: CONFIG.contracts.CNS,
  abi: ABI.NameWrapper,
});

export const formatAddress = (
  address: string,
  networkId?: 1 | 1029
): string => {
  if (networkId === 1029) {
    return address.replace(/(.*:.{3}).*(.{8})/, "$1...$2");
  } else {
    return address.replace(/(.*:.{3}).*(.{4})/, "$1...$2");
  }
};

// @see http://www.tcpipguide.com/free/t_DNSNameNotationandMessageCompressionTechnique.htm#:~:text=Instead,%20DNS%20uses%20a%20special,are%20encoded,%20one%20per%20byte.
// '\x05hello\x03com\x00' => hello.com
export function dnsNameNotationDecode(message: string) {
  let tmp = Array.from(message).slice(1);
  tmp = tmp.slice(0, tmp.length - 1);
  const dot = tmp.findIndex((c) => c === "\x04" || c === "\x03");
  return tmp.slice(0, dot).join("") + "." + tmp.slice(dot + 1).join("");
}
