

import { PDFParse } from 'pdf-parse';
// import { readFile } from 'node:fs/promises';


const resumeParser=async(link)=>{
const parser = new PDFParse({ url: link });
const result = await parser.getInfo({ parsePageInfo: true });
await parser.destroy();

console.log(`Total pages: ${result.total}`);
console.log(`Title: ${result.info?.Title}`);
console.log(`Author: ${result.info?.Author}`);
console.log(`Creator: ${result.info?.Creator}`);
console.log(`Producer: ${result.info?.Producer}`);
}
export {resumeParser};