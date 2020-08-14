export class Publication{
    constructor(
        public _id: string,
        public text: string,
        public file: string,
        public crated_at: number,
        public user: string
    ){}
}