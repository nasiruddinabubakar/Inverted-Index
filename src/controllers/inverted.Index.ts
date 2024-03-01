import { invertedIndex } from '../types';
import { stopWords, testArr } from '../utils/filesArray';
import { PreProcessor } from './preProcesser';

export class InvertedIndex {
  lexicon: string[] | undefined;
  table: invertedIndex[] = [];
  constructor() {
    this.lexicon = [];
  }

  async BuildIndex() {
    await Promise.all(
      testArr.map(async (FileObject) => {
        const tokenizedArray = await PreProcessor.fileReader(
          FileObject.fileName
        );

        tokenizedArray.forEach((word: string) => {
          if (!this.lexicon?.includes(word) && !stopWords.includes(word)) {
            this.lexicon?.push(word);
          }
        });

        for (const word of this.lexicon?.sort() || []) {
          let postings: number[] = [];

          if (!this.table.find((obj) => obj.word === word)) {
            postings.push(FileObject.docID);
            this.table.push({ word, postings });
          } else {
            let index = this.table.findIndex((obj) => obj.word === word);
            this.table[index].postings.push(FileObject.docID);
          }
        }
      })
    );

    return this.table;
  }

  async returnIndex() {
    return this.table;
  }
}
