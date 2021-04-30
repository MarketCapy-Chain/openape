import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { supportedIds } from 'lib/supportedIds';

const nodemailer = require('nodemailer');

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, publicAddress, contractAddress, chainId, txNonce } = req.body;

    let provider: any;

    switch (chainId) {
        case 1:
            provider = new ethers.providers.JsonRpcProvider(
                `https://eth-mainnet.alchemyapi.io/v2/7kwH0c_l1lJSG-8-ty4yzt_JrUSyPcPS`,
                'mainnet',
            );
            break;
        case 3:
            provider = new ethers.providers.JsonRpcProvider(
                `https://eth-ropsten.alchemyapi.io/v2/7kwH0c_l1lJSG-8-ty4yzt_JrUSyPcPS`,
                'ropsten',
            );
            break;
        case 137:
            provider = new ethers.providers.JsonRpcProvider(
                'https://rpc.maticvigil.com/?jwt=eyJhbGciOiJIUzI1NiJ9.a3Jpc2hhbmcubm90ZUBnbWFpbC5jb20.VM9Ae_oaBmEPbhAKH9nxq-ZwhAVlIEx_XhLirvfvswc',
                chainId,
            );
            break;
        case 80001:
            provider = new ethers.providers.JsonRpcProvider(
                'https://rpc-mumbai.maticvigil.com',
                chainId,
            );
            break;
        default:
            provider = new ethers.providers.JsonRpcProvider(
                `https://eth-mainnet.alchemyapi.io/v2/7kwH0c_l1lJSG-8-ty4yzt_JrUSyPcPS`,
            );
    }

    let txConfirmed = false;
    let count = 0;
    console.log('Nonce to check for: ', txNonce);

    while (!txConfirmed) {
        count += 1;
        if (count >= 120) {
            break;
        }

        const receiptPromise = new Promise((resolve, reject) => {
            console.log('Checking');
            setTimeout(() => {
                resolve('');
            }, 5000);
        });

        const newNonce = await provider.getTransactionCount(publicAddress);
        const formatted = parseInt(newNonce.toString());
        console.log('New nonce on checking: ', formatted);

        if (newNonce >= txNonce) {
            txConfirmed = true;
            console.log('Transaction mined!');
        } else {
            await receiptPromise;
        }
    }

    console.log('Sending email now');
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',

        auth: {
            user: 'nobsnfts@gmail.com',
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const successHTML = `
    <h1>No bullshit NFTs</h1>
    <b>Your tokens have been successfully uploaded to your NFT collection!</b>
    <span>View your collection: <a href="${
        supportedIds[chainId].contractExplorer + contractAddress
    }">${contractAddress}</a></span>`;
    const successSubject = 'Your transactions on NoBullshitNFTs are complete!';

    const failureHTML = `
  <h1>No bullshit NFTs</h1>
  <b>Sorry, but looks like something went wrong with your transactions. You can contact krishang@nftlabs.co for support.</b>
  <span>View your collection: <a href="${
      supportedIds[chainId].contractExplorer + contractAddress
  }">${contractAddress}</a></span>`;
    const failureSubject = 'Something went wrong with your transactions on NoBullshitNFTs.';

    try {
        const info = await transporter.sendMail({
            from: '"Krishang" <nobsnfts@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: txConfirmed ? successSubject : failureSubject, // Subject line
            text: txConfirmed ? successSubject : failureSubject, // plain text body
            html: txConfirmed ? successHTML : failureHTML, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.log(err);
    }

    res.end();
};

