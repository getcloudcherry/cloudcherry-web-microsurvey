class TriggerUtils {


    public static checkInUrl(inUrl : RegExp) {
        return window.location.href.match(inUrl) != null && window.location.href.match(inUrl).length > 0;
    }

    public static checkTimeCondition(pageTime : number, pageStartTime : number, minPageTime : number) {
        return Math.round((pageTime - pageStartTime) / 1000) > minPageTime;
    }

    public static checkScroll(scrollNow : number, minScrollPixels : number) {
        return scrollNow > minScrollPixels;
    }

    public static checkPageCount(pageCount : number, minPageCount : number) {
        return pageCount >= minPageCount;
    }
}

export { TriggerUtils };