import { create } from 'ipfs-http-client';

const client = create({ host: 'localhost', port: '5001', protocol: 'http' });

export async function uploadToIPFS(file) {
  const result = await client.add(file);
  return result.cid.toString();
}

export async function getFromIPFS(cid) {
  const content = await client.cat(cid);
  return content;
}
