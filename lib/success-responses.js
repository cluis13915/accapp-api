const successRes = (res, message = null) => res.status(200).json({
  message: message || 'ok'
});


export default {
  successRes
};
