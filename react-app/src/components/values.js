let newTemplateId = 0;

export const getNewTemplateId = () => {
  return newTemplateId;
};

export const setNewTemplateId = (newTId) => {
  newTemplateId = newTId;
};

let templateId = 0;

export const getTemplateId = () => {
  return templateId;
};

export const setTemplateId = (newTemplateId) => {
  templateId = newTemplateId;
};

let DId = 0;

export const getDId = () => {
  return DId;
};

export const setDId = (newDId) => {
  DId = newDId;
};

let stateInformation = {};

export const getStateValue = (key) => {
  return stateInformation[key];
};

export const setStateValue = (key, value) => {
  stateInformation[key] = value;
};

export const resetStateValues = () => {
  stateInformation = {};
};

let fieldValues = {};

export const getFieldValue = (field) => {
  return fieldValues[field];
};

export const setFieldValue = (field, value) => {
  fieldValues[field] = value;
};

export const getAllFieldValues = () => {
  return fieldValues;
};

export const resetFieldValues = () => {
  fieldValues={};
};

let filledMandatoryFieldsIndicator = {};

export const checkIfMandatoryField = (field) => {
  if (field in filledMandatoryFieldsIndicator)
  return true;
  return false;
};

export const getFilledMandatoryFieldIndicator = (field) => {
  return filledMandatoryFieldsIndicator[field];
};

export const setFilledMandatoryFieldIndicator = (field, value) => {
  filledMandatoryFieldsIndicator[field] = value;
};

export const resetFilledMandatoryFieldIndicator = () => {
  filledMandatoryFieldsIndicator={};
};

// let mandatoryFields

// export const isMandatoryField = (field) => {
//   if (mandatoryFields[field])
//   return 1;
//   return 0;
// };