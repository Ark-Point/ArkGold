import type { ExternalProvider } from "@ethersproject/providers";
import { providers } from "ethers"; // v5 방식
import * as React from "react";
import { type Account, type Chain, type Client, type Transport } from "viem";
import { type Config, useConnectorClient } from "wagmi";
/**
 * viem Client -> ethers.js v5 Signer
 */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(
    transport as ExternalProvider,
    network
  );

  const signer = provider.getSigner(account.address);
  return signer;
}

/**
 *
 * Wagmi(viem) -> Ethers v5 Signer
 */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });

  return React.useMemo(
    () => (client ? clientToSigner(client) : undefined),
    [client]
  );
}
