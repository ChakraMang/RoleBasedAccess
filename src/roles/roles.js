const accessControl = require('accesscontrol');
const access = new accessControl();

module.exports.roles = (function(){
    access.grant('intern').readOwn("deatils").updateOwn("details");
    access.grant("SDE1").extend("intern").readOwn("details").updateOwn("details");
    access.grant("SDE2").extend(["intern","SDE1"]).readOwn("details").updateOwn("details");
    access.grant("SDE3").extend(["intern","SDE1","SDE2"]).readOwn("details").updateOwn("details");
    access.grant("Admin").extend(["intern","SDE1","SDE2","SDE3"]).readAny("details").updateAny("details")

    return access;
})();