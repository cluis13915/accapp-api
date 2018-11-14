import createError from 'http-errors';

const incompleDataError = () => createError(400, 'Incomplete data provided.');

const resourceNotFoundError = (resourceName = null) => createError(
  404,
  `${resourceName || 'Resource'} not found.`
);


export default {
  incompleDataError,
  resourceNotFoundError
};
