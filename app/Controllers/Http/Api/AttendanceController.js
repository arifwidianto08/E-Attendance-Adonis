'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

const BaseController = require('./BaseController');
/** @type {typeof import('../../../Models/Attendance')} */
const Attendance = use('App/Models/Attendance');
const User = use('App/Models/User');
const Hash = use('Hash');
const LoginFailedException = use('App/Exceptions/LoginFailedException');
const {
  storeAttendance,
  checkInValidation,
  checkOutValidation
} = require('../../../Validators/Attendance');
/**
 *
 * @class AttendanceController
 */
class AttendanceController extends BaseController {
  /**
   * Index
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, decodeQuery }) {
    const attendances = await Attendance.all();

    return response.apiCollection(attendances);
  }

  async getAttendanceById({ response, params }) {
    const attendance = await Attendance.find(params.id);
    return response.apiItem(attendance);
  }

  async store({ request, response }) {
    const attendances = new Attendance(request.all());
    const username = request.input('username');

    // validate body
    await this.validate(request.all(), storeAttendance());

    const usernameExsist = await Attendance.findBy({ username });
    if (usernameExsist) {
      return response.unprocessableEntity('Username already exist');
    }

    const password = await Hash.make(request.input('password'));
    attendances.set({
      password: password
    });
    const jwt = await auth.attempt(username, password);
    await attendances.save();
    return response.apiCollection({ ...request.all(), jwt });
  }

  async update({ response, request, params }) {
    // obj.response.apiCollection(JSON.stringify(obj));
    const attendance = await Attendance.find(params.id);
    instance.merge(request.all());
    await instance.save();
    response.apiUpdated(attendance);
  }

  async destroy({ response, params }) {
    const attendance = await Attendance.find(params.id);
    await attendance.delete();
    response.apiDeleted();
  }

  async login({ request, response, auth }) {
    const username = request.input('username');
    const password = request.input('password');
    await this.validate(request.all(), {
      username: 'required',
      password: 'required'
    });
    // Attempt to login with username and password
    let data = null;
    let userData = null;
    try {
      userData = await User.findBy({ username });
      const checkPassword = await Hash.verify(password, userData.password);
      if (checkPassword) {
        const jwt = await auth.attempt(username, password);
        data = {
          user: userData,
          token: jwt.token
        };
        response.apiSuccess(data);
      } else {
        throw LoginFailedException.invoke('Invalid username or password');
      }
    } catch (error) {
      throw LoginFailedException.invoke(`${error}`);
    }
  }

  async logout({ auth, response }) {
    try {
      await auth.logout();
      response.apiSuccess();
    } catch (error) {
      console.log(error);
    }
  }

  async checkIn({ request, response }) {
    await this.validate(request.all(), checkInValidation());
    const user_id = request.input('user_id');
    const attendance = new Attendance({
      ...request.all(),
      checkOutTime: 'unset'
    });

    const existingCheckin = await Attendance.findBy({
      user_id: user_id,
      status: 'Checkin'
    });
    if (existingCheckin) {
      return response.unprocessableEntity("the user hasn't checkout");
    }
    await attendance.save();
    return response.apiCreated(attendance);
  }

  async checkOut({ request, response, params }) {
    await this.validate(request.all(), checkOutValidation());
    const attendance = await Attendance.find(params.id);
    attendance.merge(request.all());
    await attendance.save();
    return response.apiUpdated(attendance);
  }
}

module.exports = AttendanceController;
