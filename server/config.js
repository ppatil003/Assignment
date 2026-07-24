import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI, PORT, DNS_SERVERS } = process.env;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment variables');
}

export default {
  mongodbUri: MONGODB_URI,
  port: PORT ? Number(PORT) : 4000,
  dnsServers: DNS_SERVERS
    ? DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
    : [],
};
