/**
 * @category Client
 * @module
 */


/**
 * @description 
 * @returns 
 */
const parseSsotToBpmn = (modeler, ssot) => {
    const modeling = modeler.get('cli');
    console.log(modeling);
    //console.log(cli.append('Event_13c1i8b', 'bpmn:ExclusiveGateway', '150,0'));
    /*
    const gateway = cli.createShape('Event_13c1i8b', 'bpmn:ExclusiveGateway', '150,0');
    const test = cli.elements();
    console.log(cli.createShape('Event_13c1i8b', 'bpmn:ExclusiveGateway', '150,0'););
    */
    return 'Your BPMN could be here';
};

module.exports = { parseSsotToBpmn };