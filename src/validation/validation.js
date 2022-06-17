
function isName(str){
    if(typeof str != 'string' || !str.trim().length){
        return false;
    }
    return /^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(str);
}

function isEmail(str){
    if(typeof str != 'string' || !str.trim().length){
        return false;
    }
    
    return /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(str)
    
}
function isPassword(str){
    if(typeof str != 'string' || !str.trim().length){
        return false;
    };
    if(str.length > 15 || str.length < 8){
        return false;
    }

    if(str.search(/[a-z]/) < 0 || str.search(/[A-Z]/) < 0 || str.search(/[0-9]/) < 0) {
        return false;
    }

    return true;
}
module.exports.isName = isName;
module.exports.isEmail = isEmail;
module.exports.isPassword = isPassword;