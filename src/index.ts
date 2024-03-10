import { InvertedIndex } from './controllers/inverted.Index';

async function main() {
  const invertedIndex = new InvertedIndex();
  const InvertedIndexResult = await invertedIndex.BuildIndex();
  const PositionalIndexResult = await invertedIndex.buildIndexFromFiles();
  console.log(
    'NUMBER OF TOKENS IN INVERTED INDEX : ',
    InvertedIndexResult.length
  );
  console.log(
    'NUMBER OF TERMS IN POSITIONAL INDEX : ',
    PositionalIndexResult.size
  );

  const orQuery = await invertedIndex.runOrQuery('transformer OR model');
  const andQuery = await invertedIndex.runAndQuery(
    'feature AND selection AND redundancy'
  );
  const notQuery = await invertedIndex.runNotQuery('NOT model');
  console.log('OR QUERY RESULTS : ', orQuery);
  console.log('AND QUERY RESULTS : ', andQuery);
  console.log('NOT QUERY RESULTS : ', notQuery);
  const proximity = 3;
  const term1 = 'artificial';
  const term2 = 'intelligence';
    console.log("Proximity Query: ", term1, term2, proximity);
  const result = await invertedIndex.proximityQuery(term1, term2, proximity);
  console.log(
    `Documents where '${term1}' and '${term2}' occur within ${proximity} words of each other:`,
    result
  );
}

main();
