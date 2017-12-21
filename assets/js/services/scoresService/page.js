export default class Page {
    constructor(pageNumber, pageSize, scores, begin = 0, end = 0) {
        this.pageNumber = pageNumber;

        this.scores = scores.map(scoreRow => {

            return {
                scoreId: scoreRow.scoreId,
                place: 0,
                nickname: scoreRow.nickname,
                scores: scoreRow.scores,
            };
        });

        this.scores.reduce((place, current) => {
            current.place = place;
            return ++place;
        }, pageNumber * pageSize + 1);

        this.endMarker = this.scores.length ? this.scores[this.scores.length - 1].scoreId : end;
        this.beginMarker = this.scores.length ? this.scores[0].scoreId : begin;
    }
}
