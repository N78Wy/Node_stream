import * as crypto from "crypto"
import * as forge from "node-forge"

const private_key_A = Buffer.from(`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCuodBFomzGE94eWG7hYLX4AAbbvn0BT7eJUqNz3bLpWv0nv7m7
BzIoqM9szRbCZzZvFjZqeYqmF/8Py/UqaYfLnNU4f9wHbe7Ubkevvvlq9xC6+xNX
ZAu22YVjWE79sE6yg3SMPZoYyEFaz89KnugTDS1J8U19IWvGWFmQAYUtJQIDAQAB
AoGAL1kOKCMuzNHMMnwVrCPVkqUnNuNB714WzDPMv3iHrr+Nzf4stGnyDpYej0hX
+GOVna7vGBVWI0x0SmspUNOGDpsLdEjEpEIJXq45LUl0qzKJ+PJgiCNaJmjEJQjy
BCczUhTP1+3KEb1zi/MQGYO+CUsUob9mcvUuC4QCCi/EgqECQQDYE+vBhLT7b5/W
gFUzPD6tztdHPcpGc/DRM+DaOixbB0rq7/27OiHeIfnkEyl3ZsVw3oct6R7DBGHX
OgU6tMd5AkEAzuWWKLILFDyMPLpSgxEHAxA//UoGe5hacP4UvOGVp946ivY312Qp
7DFsyJSwXQFTAvWcr05DUUsZ9hJ417BsDQJAe/ZBxI27vpv1WPva5T/kvZXyj151
kyGkwIBAuTGyjK6MXmg8apMZJvTbBeuwWF3PW8duSfp5uWvkLbONmHZqEQJBAKLd
7DSg40PM3gA4FBgE4WYx9o1nJm9I4XktKhn94pdAwwj9BbxSpwW9aosDMUolbrlX
qz3899UYr5kbtXDk+kkCQQCzKRc1of8nyc+9LD2cTKp3AITHl88DJCPkArl0gHGu
EbjcZOrDO+XedmKgQrFHxU8k3Fs37OtuUVFbaNgMPjI4
-----END RSA PRIVATE KEY-----`)

const public_key_A = Buffer.from(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuodBFomzGE94eWG7hYLX4AAbb
vn0BT7eJUqNz3bLpWv0nv7m7BzIoqM9szRbCZzZvFjZqeYqmF/8Py/UqaYfLnNU4
f9wHbe7Ubkevvvlq9xC6+xNXZAu22YVjWE79sE6yg3SMPZoYyEFaz89KnugTDS1J
8U19IWvGWFmQAYUtJQIDAQAB
-----END PUBLIC KEY-----`)

const private_key_B = Buffer.from(`-----BEGIN PRIVATE KEY-----
kOhgawdgesghbmFdthtdhtwaQECAwQF
-----END PRIVATE KEY-----`)

const public_key_B = Buffer.from(`AAAthfhftsefcseFD4rOCCtw== A@tuzhanai.com`)

function rsaEncrypt(data: Buffer, key: Buffer) {
  return crypto.publicEncrypt(key, data).toString("base64")
}

function rsaDecrypt(data: Buffer, key: Buffer) {
  return crypto.privateDecrypt(key, data).toString()
}

// console.log(rsaEncrypt(Buffer.from("test_buff"), public_key_A))
// console.log(rsaDecrypt(Buffer.from(`LnlVUrTPD0nog0ZdQoFvYUtwS9VXV80o9I3EL9hVUVuu1D1VD885O7Zr2Yd/SLPPgO74SbnPYH0x/kcElGBUbkjzWPzHAv8JiUzfRVlouSpvyAX9fb9255SKJmaivAz8d7Tbz8XV4KIQa5I9VuAFhOPLKwdLUM4ckOw9tioYeiA=`, "base64"), private_key_A))

const res = forge.pki.decryptRsaPrivateKey(private_key_A.toString())
console.log(res.decrypt(Buffer.from(`LnlVUrTPD0nog0ZdQoFvYUtwS9VXV80o9I3EL9hVUVuu1D1VD885O7Zr2Yd/SLPPgO74SbnPYH0x/kcElGBUbkjzWPzHAv8JiUzfRVlouSpvyAX9fb9255SKJmaivAz8d7Tbz8XV4KIQa5I9VuAFhOPLKwdLUM4ckOw9tioYeiA=`, "base64").toString()))