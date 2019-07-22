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
    classroom: 'required|min:3'
  };
}

function checkOutValidation() {
  return {
    checkOutTime: 'required'
  };
}

module.exports = {
  storeAttendance,
  checkInValidation,
  checkOutValidation
};
