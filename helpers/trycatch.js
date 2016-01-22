




module.exports.trycatch = function(process, success, exception) {
    var sign;
    try {
        process();
        sign = true;
    } catch (error) {
        sign = false;
        exception(error);
    }
    if(sign) {
        success();
    }
};