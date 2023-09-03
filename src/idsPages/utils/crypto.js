//引用AES进行数据加密
import CryptoJS from 'crypto-js';
const key = CryptoJS.enc.Utf8.parse("holdingbigscreen");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('xinaoscreens2021');   //十六位十六进制数作为密钥偏移量
//加密
export function Encrypt(content) {
  let encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString()
}
//解密
export function Decrypt(content) {
  let bytes = CryptoJS.AES.decrypt(content.toString(), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  let decryptResult = CryptoJS.enc.Utf8.stringify(bytes).toString();
  return decryptResult
}

