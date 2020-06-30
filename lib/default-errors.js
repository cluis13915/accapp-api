import createError from 'http-errors';

const incompleteDataError = () => createError(400, 'Incomplete data provided.');

const resourceNotFoundError = (resourceName = null) => createError(
  404,
  `${resourceName || 'Resource'} not found.`
);


export default {
  incompleteDataError,
  resourceNotFoundError
};
