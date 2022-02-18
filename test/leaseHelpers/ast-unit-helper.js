// Novel way to drive behavior of Smart Contract.

//
const CDTYPE = "ContractDefinition";
const CNAME = "Rentals";
const contractDefn = (ca) =>
  ca.ast.nodes.find((n) => n.nodeType === CDTYPE && n.name === CNAME);

const units = (ca) => {
  const unit = contractDefn(ca).nodes.find((n) => n.name === "Unit");
  if (!unit) return null;

  return unit.members.map((t) => ({
    name: t.name,
    nodeType: t.nodeType,
    stateVariable: t.stateVariable,
    type: t.typeName.name || t.typeName.pathNode.name,
    mutability: t.typeName.stateMutability,
  }));
};

const isDefinedUnit = (members) => (variableName) => {
  return members ? members.find((unit) => unit.name === variableName) : null;
};

const isPayableUnit = (members) => (variableName) => {
  if (members === undefined) return false;
  const definition = members.find((unit) => unit.name === variableName);
  return definition && definition.mutability === "payable";
};

const isTypeUnit = (members) => (variableName) => (type) => {
  if (members === undefined) return false;
  const definition = members.find((unit) => unit.name === variableName);
  return definition && definition.type === type;
};

module.exports = {
  units,
  isDefinedUnit,
  isPayableUnit,
  isTypeUnit,
};
