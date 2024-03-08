import { InvertedIndex } from './controllers/inverted.Index';

async function main() {
  const invertedIndex = new InvertedIndex();
  const res = await invertedIndex.BuildIndex();
  // console.log(res);
const result= await invertedIndex.runAndQuery('transformer AND model');
console.log(result);
}

main();


