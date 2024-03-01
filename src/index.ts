import { InvertedIndex } from './controllers/inverted.Index';

const invertedIndex = new InvertedIndex();

invertedIndex.BuildIndex().then((res) => {
//   console.log(res);
invertedIndex.runQuery('feature AND selection');
});

