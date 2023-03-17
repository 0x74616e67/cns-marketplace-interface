import { conflux, dnsNameNotationDecode } from "./index";
import { CONFIG, ABI } from "./const";
import BigNumber from "bignumber.js";
import SDK, { Drip } from "js-conflux-sdk";
import { NameType } from "./interface";

// @ts-ignore
window.BigNumber = BigNumber;
// @ts-ignore
window.SDK = SDK;

const cMarketplace = conflux.Contract({
  address: CONFIG.contracts.marketplace,
  abi: ABI.marketplace,
});

const cNamewrapper = conflux.Contract({
  address: CONFIG.contracts.CNS,
  abi: ABI.NameWrapper,
});

const cCNSUtils = conflux.Contract({
  address: CONFIG.contracts.CNSUtils,
  abi: ABI.CNSUtils,
});

export interface SellType {
  price: number;
  name?: string;
  tokenId?: string;
}

export async function listItem({
  account,
  price,
  tokenId,
}: SellType & { account: string }): Promise<undefined> {
  return await cMarketplace
    .listItem(tokenId, Drip.fromCFX(price))
    .sendTransaction({
      from: account,
    })
    .executed();
}

export async function setApproved(account: string) {
  return await cNamewrapper
    .setApprovalForAll(CONFIG.contracts.marketplace, true)
    .sendTransaction({
      from: account,
    })
    .executed();
}

export const isApproved = async (owner: string): Promise<boolean> => {
  return cNamewrapper.isApprovedForAll(owner, CONFIG.contracts.marketplace);
};

export const getSellingNFTs = async (
  skip: number,
  limit: number
): Promise<NameType[]> => {
  return (await cCNSUtils.getListingNames(skip, limit)).map((n: any) => ({
    price: new Drip(n[0]).toCFX(),
    seller: n[1].toString(),
    tokenId: n[2].toString(),
    name: dnsNameNotationDecode(n[3]),
  }));
};

export const getOwnedNFTs = async (owner: string): Promise<NameType[]> => {
  return (await cCNSUtils.getOwnedNames(owner)).map((n: any) => ({
    price: new Drip(n[0]).toCFX(),
    seller: n[1].toString(),
    tokenId: n[2].toString(),
    name: dnsNameNotationDecode(n[3]),
  }));
};

export async function getListing(tokenId: string) {
  return await cMarketplace.getListing(tokenId);
}

export async function cancelListing(account: string, tokenId: string) {
  return await cMarketplace
    .cancelListing(tokenId)
    .sendTransaction({
      from: account,
    })
    .executed();
}

export async function updateListing({
  account,
  price,
  tokenId,
}: SellType & { account: string }): Promise<undefined> {
  return await cMarketplace
    .updateListing(tokenId, Drip.fromCFX(price))
    .sendTransaction({
      from: account,
    })
    .executed();
}

export async function buyItem({
  account,
  tokenId,
  price,
}: Pick<SellType, "tokenId"> & {
  account: string;
  price: BigNumber;
}): Promise<undefined> {
  console.log(123, price);
  return await cMarketplace
    .buyItem(tokenId)
    .sendTransaction({
      from: account,
      value: Drip.fromCFX(price.toString()),
    })
    .executed();
}

// TODO
// export async function transfer({
//   account,
//   owner,
//   tokenId,
// }: {
//   account: string;
//   owner: string;
//   tokenId: string;
// }): Promise<undefined> {
//   return await cNamewrapper
//     .safeTransferFrom()
//     .sendTransaction({
//       from: account,
//     })
//     .executed();
// }
