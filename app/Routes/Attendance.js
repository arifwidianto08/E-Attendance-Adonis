'use strict';

const Route = use('Route');

Route.group(() => {
  Route.get('/', 'Api/AttendanceController.index');

  //   Example Data
  Route.get('/example', 'Api/AttendanceController.exampleAttendance');

  Route.post('/', 'Api/AttendanceController.store');

  Route.get('/:id', 'Api/AttendanceController.getAttendanceById');

  Route.delete('/:id', 'Api/AttendanceController.destroy');

  Route.put('/:id', 'Api/AttendanceController.update');

  Route.post('/login', 'Api/AttendanceController.login');

  Route.post('/check-in', 'Api/AttendanceController.checkIn');

  Route.put('/:id/check-out', 'Api/AttendanceController.checkOut');
}).prefix('/api/attendance');
