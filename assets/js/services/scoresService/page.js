export default class Page {
    constructor(pageNumber, pageSize, scores) {
        this.pageNumber = pageNumber;

        this.scores = scores.map(scoreRow => {
            return {
                place: 0,
                nickname: scoreRow.nickname,
                scores: scoreRow.scores,
            };
        });

        this.scores.reduce((place, current) => {
            current.place = place;
            return ++place;
        }, pageNumber * pageSize + 1);
        console.log(scores);
        this.endMarker = this.scores ? this.scores[this.scores.length - 1].scoreId : null;
        this.beginMarker = this.scores ? this.scores[0].scoreId : null;
    }

}
