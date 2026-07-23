// const mongoose = require('mongoose');
import mongoose from 'mongoose';

// const dns = require('dns');
import dns from 'dns';
dns.setServers(["1.1.1.1","8.8.8.8"]);


async function main(){
    await mongoose.connect(process.env.DB_CONNECT);

}


export default main;