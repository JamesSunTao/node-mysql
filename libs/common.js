function tDou(n){
     return n<10?'0'+n:''+n;
}
module.exports = {
    timeDate(timestamp){
        var oDate = new Date();
        oDate.setTime(timestamp*1000);
        return oDate.getFullYear() +"-" + tDou(oDate.getMonth()+1) +"-"+ tDou(oDate.getDate())
    }
}