let action = new Creep.Action('travelling');
module.exports = action;
action.isValidTarget = function(target){ return target != null; };
action.isAddableAction = function(){ return true; };
action.isAddableTarget = function(){ return true; };
action.newTarget = function(creep){
    // TODO trace it: console.log(creep.strategy([action.name]).key);
    return creep.getStrategyHandler([action.name], 'newTarget', creep);
};
action.step = function(creep){
    if(CHATTY) creep.say(this.name, SAY_PUBLIC);
    if( creep.target ){
        let pos;
        let targetRange = this.targetRange;
        if( creep.target.id == creep.id) {
            if( creep.data.travelPos ) {
                pos = new RoomPosition(creep.data.travelPos.x, creep.data.travelPos.y, creep.data.travelPos.roomName);
            } else if( !creep.data.travelRoom ) {
                logError('no travel room', {creepName:creep.name, roomName:creep.room.name, Behaviour:creep.data.creepType, Action:'travelling'});
            } else if( creep.room.getBorder(creep.data.travelRoom) ) {
                if (Game.rooms[creep.data.travelRoom]) {
                    logError('bad border target', {creepName:creep.name, roomName:creep.room.name, Behaviour:creep.data.creepType, Action:'travelling'});
                }
                targetRange = 24;
                pos = new RoomPosition(25, 25, creep.data.travelRoom);
            } else {
                targetRange = 24;
                pos = new RoomPosition(25, 25, creep.data.travelRoom);
            }
            if( creep.pos.roomName === pos.roomName ) {
                delete creep.target;
                delete creep.data.travelRoom;
                delete creep.data.travelPos;
            }
        }
        else pos = creep.target.pos;
        creep.drive( pos, this.reachedRange, targetRange, Infinity );
    }
    if( !creep.target || creep.target !== creep && creep.target.pos.roomName == creep.pos.roomName ){
        // unregister
        delete creep.action;
        delete creep.target;
        delete creep.data.actionName;
        delete creep.data.targetId;
        delete creep.data.travelRoom;
    }
}
action.onAssignment = function(creep, target) {
    if( SAY_ASSIGNMENT ) creep.say(String.fromCharCode(9784), SAY_PUBLIC);
};
action.defaultStrategy.newTarget = function(creep) {
    if( creep.data.travelPos || creep.data.travelRoom ) {
        return creep;
    }
    return null;
};
