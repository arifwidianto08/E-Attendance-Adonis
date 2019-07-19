'use strict';

const Route = use('Route');

Route.group(() => {
  Route.get('/', 'Api/AttendanceController.index');

  //   Example Data
  Route.get('/example', 'Api/AttendanceController.exampleAttendance');

  Route.get('/:id', 'Api/AttendanceController.getAttendanceById');

  Route.delete('/:id', 'Api/AttendanceController.destroy');

  Route.put('/:id', 'Api/AttendanceController.update');

  Route.post('/login', 'Api/AttendanceController.login');
  Route.post('/login-nis', 'Api/AttendanceController.loginNIS');
  Route.post('/login-with-imei', 'Api/AttendanceController.loginWithIMEI');

  Route.post('/check-in', 'Api/AttendanceController.checkIn');
  Route.post('/logout', 'Api/AttendanceController.logout');
  Route.put('/:id/check-out', 'Api/AttendanceController.checkOut');
  Route.post('/try-form-data', 'Api/AttendanceController.tryFormData');
}).prefix('/api/attendance');
