import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from '@web3-react/core';

import React, { createContext, useContext, useState, useEffect } from "react";
import { useDefaultSkyDB } from "lib/useSkyDB";

export const ContractContext = createContext<any>('');

export function ContractWrapper({ NFT, BidExecutor, children }: any) {
  
  const context = useWeb3React<Web3Provider>()
  const { account, chainId } = context

  const { logContractAddress, getDataFromSkyDB, onboardUser } = useDefaultSkyDB();

  const [contracts, setContracts] = useState<any[]>([]);
  const [contractAddress, setContractAddress] = useState<string>('');

  const [uploadTokenLoading, setUploadTokenLoading] = useState<boolean>(false);
  const [newContractAdded, setNewContractAdded] = useState<boolean>(false);

  useEffect(() => {
    
    const onboard = async (acc: string) => {
      try {
        await onboardUser(acc);
      } catch(err) {
        console.log(err);
      }
    }
    
    if(account) onboard(account);
  }, [account])

  useEffect(() => {
    const getTxs = async () => {
      const data = await getDataFromSkyDB();
      if(data) {
        if (data[account as string]) {
          
          if(data[account as string].NFTs) {
            const addressesInContracts = contracts.map((contract: any) => contract.address);
            const addressesToAdd = data[account as string].NFTs.filter((contract: any) => contract.chainId == chainId && !addressesInContracts.includes(contract.address))
            setContracts([...addressesToAdd])
          };
        }
      }
    }

    if(account && chainId) {
      getTxs()
    } else {
      setContracts([]);
    }
  }, [account, chainId])

  const handleNewContract = async () => {
    setNewContractAdded(true);

    const wait = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('');
      }, 5000)
    })

    await wait;
    setNewContractAdded(false);
  }

  const logNewContract = async (acc: string, contractAddr: string) => {
    setContracts([...contracts, {
      address: contractAddr,
      chainId: chainId
    }])

    // console.log("Loggin new contract: ", contractAddr);
    try {
      await logContractAddress(acc, {
        address: contractAddr,
        chainId: chainId
      })
    } catch(err) {
      console.log(err)
    }
  }

  let sharedState = {
    NFT, 
    BidExecutor,
    contracts,
    setContracts,
    logNewContract,
    contractAddress,
    setContractAddress,
    uploadTokenLoading,
    setUploadTokenLoading,
    newContractAdded,
    handleNewContract
  };


  return (
    <ContractContext.Provider value={sharedState}>
      {children}
    </ContractContext.Provider>
  );
}