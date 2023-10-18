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