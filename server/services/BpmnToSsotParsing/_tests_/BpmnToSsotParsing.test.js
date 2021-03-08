const parser = require('../BpmnToSsotParsing');
const BPMN_JSON = require('./BpmnJsonForTesting').BPMN_XML_AS_JSON;
const testSsot = require('./SsotForTesting').SSOT_JSON_STRING;

const Ssot = JSON.parse(parser.parseBpmnToSsot(BPMN_JSON));

describe('Parsing Tests', () => {

  test('bpmn fully parsed to Ssot', () => {
    expect(JSON.stringify(Ssot, null, 2)).toMatch(JSON.stringify(testSsot, null, 2));
  });

  test('Ssot contains instructions', () => {
    expect(Ssot.elements[1]).toHaveProperty("type", "INSTRUCTION");
    expect(Ssot.elements[1]).not.toHaveProperty("rpaApplication");
  })

  test('Ssot contains RPA isntructions', () => {
    expect(Ssot.elements[2]).toHaveProperty("rpaApplication", "Excel.Files");
    expect(Ssot.elements[2]).toHaveProperty("rpaTask", "Set Worksheet Value");
    expect(Ssot.elements[2].rpaParameters[0]).toHaveProperty("name", "row");
    expect(Ssot.elements[2].rpaParameters[0]).toHaveProperty("value", 69);
  })

  test('Ssot contains marker', () => {
    expect(Ssot.elements[0]).toHaveProperty("type", "MARKER");
    expect(Ssot.elements[3]).toHaveProperty("type", "MARKER");
  })

  test('Ssot contains flow', () => {
    Ssot.elements.forEach((element => {
      expect((element.predecessorIds.length) + (element.successorIds.length)).toBeGreaterThan(0);
    }))
  })

});
