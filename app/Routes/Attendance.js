'use strict';

const Route = use('Route');

Route.group(() => {
  Route.get('/', 'Api/AttendanceController.index');

  //   Example Data
  Route.get('/example', 'Api/AttendanceController.exampleAttendance');

  Route.post('/', 'Api/AttendanceController.store');

  Route.get('/:id', 'Api/AttendanceController.getAttendanceById').instance(
    'App/Models/Attendance'
  );

  Route.delete('/:id', 'Api/AttendanceController.destroy').instance(
    'App/Models/Attendance'
  );

  Route.put('/:id', 'Api/AttendanceController.update').instance(
    'App/Models/Attendance'
  );

  Route.post('/login', 'Api/AttendanceController.login');

  Route.post('/check-in', 'Api/AttendanceController.checkIn');

  Route.put('/:id/check-out', 'Api/AttendanceController.checkOut').instance(
    'App/Models/Attendance'
  );
}).prefix('/api/attendance');
