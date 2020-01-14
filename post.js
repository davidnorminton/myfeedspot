/**
 * @class PostLogic
 * logic for individual post
 */
var PostLogic = /** @class */ (function () {
    function PostLogic(data) {
        this.id = data.id;
        this.title = data.title;
        this.link = data.link;
        this.domain = data.domain;
        this.url = data.url;
        this.snippet = data.snippet;
        this.date = data.date;
        this.type = data.type;
        // array of months
        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
    }

    // return four digit format of current month
    PostLogic.prototype.currentYear = function () {
        return new Date().getFullYear();
    };

    // get id
    PostLogic.prototype.getId = function () {
        return this.id;
    };

    // article title
    PostLogic.prototype.getTitle = function () {
        return this.title;
    };

    // address of article
    PostLogic.prototype.getLink = function () {
        return this.link;
    };

    // address of homepage
    PostLogic.prototype.getUrl = function () {
        return this.url;
    };

    // domain name format google
    PostLogic.prototype.getDomain = function () {
        return this.domain;
    };

    // restrict snippet based on title length  
    PostLogic.prototype.getSnippet = function () {
        return (
            this.title.length > 55
                ? this.snippet.substring(0, 170)
                : this.snippet.substring(0, 250)
        ).replace('...', '');
    };
    
    PostLogic.prototype.getType = function () {
        return this.type;
    };

    PostLogic.prototype.fmtYear = function (year) {
        return (Number(year) !== this.currentYear() ? ", " + Number(year) : '');
    };
    
    PostLogic.prototype.fmtMnth = function (month) {
        return (this.months[Number(month) - 1]);
    };
    
    PostLogic.prototype.fmtDay = function (day) {
        return day;
    };

    PostLogic.prototype.getDateParts = function () {
        const dateSplit = this.date.split('-');
        return {
            year: dateSplit[0],
            month: dateSplit[1],
            day: dateSplit[2]
        };   
    };
    
    // format the date for post  
    PostLogic.prototype.getDate = function () {
        const date = this.getDateParts();
        const month = this.fmtMnth(date.month);
        const day = this.fmtDay(date.day);
        const year = this.fmtYear(date.year);
        return `${month} ${day} ${year}`;
    };
    
    return PostLogic;

}());

/**
 * @function Post
 * @return an instance of PostLogic
 */
var Post = (function (data) {
    return new PostLogic(data);
});
