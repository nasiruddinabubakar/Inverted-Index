import { InvertedIndex } from './controllers/inverted.Index';

async function main() {
  const invertedIndex = new InvertedIndex();
  // const res = await invertedIndex.BuildIndex();
  const res = await invertedIndex.buildIndexFromFiles();
  // console.log(res);
  const proximity = 3;
  const term1 = 'artificial';
  const term2 = 'intelligence';
  console.log(invertedIndex.getPostings(term1));
  const result = await invertedIndex.proximityQuery(term1, term2, proximity);
  console.log(
    `Documents where '${term1}' and '${term2}' occur within ${proximity} words of each other:`,
    result
  );
  //   res.forEach((postings, term) => {
  //     console.log(term + ":");
  //     postings.forEach(posting => {
  //         console.log(`  Document ${posting.docID}: positions ${posting.positions.join(', ')}`);
  //     });
  // });
  // const result = await invertedIndex.runAndQuery('abduct');
  // console.log(result);
}

main();
