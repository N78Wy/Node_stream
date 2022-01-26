import * as crypto from "crypto"
import { v4 as uuidv4 } from "uuid"

const random_iv = uuidv4().replace(/-/g, "").slice(0, 16)
const random_key = "205b26af6c4c4303"

const iv = crypto.createCipheriv("aes-128-cbc", random_key, random_iv)
iv.update("dadada")
const res = iv.final()

const upiv = crypto.createDecipheriv("aes-128-cbc", random_key, random_iv)
upiv.update(res)
const unres = upiv.final()



console.log(unres.toString("utf-8"))