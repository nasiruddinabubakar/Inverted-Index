export type invertedIndex = {

    word: string;
    postings: number[];
    
}
export type positionIndex = {
    word: string;
    postings:{
        docID: number;
        positions: number[];
    }[];
    
}
export type Posting ={
    docID: number;
    positions: number[];
}
