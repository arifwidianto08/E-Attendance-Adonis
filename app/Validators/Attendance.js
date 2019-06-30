function storeAttendance() {
  return {
    user_id: 'required',
    checkInTime: 'required',
    checkOutTime: 'required',
    status: 'required'
  };
}

function checkInValidation() {
  return {
    user_id: 'required',
    checkInTime: 'required',
    status: 'required',
    token: 'required'
  };
}

function checkOutValidation() {
  return {
    checkOutTime: 'required',
    status: 'required'
  };
}

module.exports = {
  storeAttendance,
  checkInValidation,
  checkOutValidation
};
