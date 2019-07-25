"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

const BaseController = require("./BaseController");
/** @type {typeof import('../../../Models/Attendance')} */
const Attendance = use("App/Models/Attendance");
const User = use("App/Models/User");
const Hash = use("Hash");
const LoginFailedException = use("App/Exceptions/LoginFailedException");
const {
  storeAttendance,
  checkInValidation
} = require("../../../Validators/Attendance");
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
    const username = request.input("username");

    // validate body
    await this.validate(request.all(), storeAttendance());

    const usernameExsist = await Attendance.findBy({ username });
    if (usernameExsist) {
      return response.unprocessableEntity("Username already exist");
    }

    const password = await Hash.make(request.input("password"));
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

  async tryFormData({ request, response }) {
    console.log("Request", request.all());
    response.apiSuccess(request.all());
    console.log(request.input("username"));
  }

  async login({ request, response, auth }) {
    const username = request.input("username");
    const password = request.input("password");
    await this.validate(request.all(), {
      username: "required",
      password: "required"
    });
    // Attempt to login with username and password
    let data = null;
    let userData = null;

    try {
      userData = await User.findBy({ username });
      const passwordIsMatch = await Hash.verify(password, userData.password);
      if (passwordIsMatch) {
        const jwt = await auth.attempt(username, password);
        data = {
          id: userData._id,
          username: userData.username,
          name: userData.name,
          grade: userData.grade,
          nis: userData.nis,
          imei: userData.imei,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          token: jwt.token
        };
        response.apiSuccess(data);
      } else {
        throw LoginFailedException.invoke("Invalid username or password");
      }
    } catch (error) {
      throw LoginFailedException.invoke(`${error}`);
    }
  }

  async loginWithIMEI({ request, response, auth }) {
    const imei = request.input("imei");
    const password = request.input("password");
    await this.validate(
      { imei, password },
      {
        imei: "required",
        password: "required"
      }
    );
    // Attempt to login with imei and password
    let data = null;
    let userData = null;
    try {
      userData = await User.findBy({
        imei: imei
      });
      const passwordIsMatch = await Hash.verify(password, userData.password);
      if (passwordIsMatch) {
        const jwt = await auth.authenticator("withImei").generate(userData);
        data = {
          id: userData._id,
          username: userData.username,
          name: userData.name,
          grade: userData.grade,
          nis: userData.nis,
          imei: userData.imei,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          token: jwt.token
        };
        response.apiSuccess(data);
      } else {
        throw LoginFailedException.invoke("Invalid imei or password");
      }
    } catch (error) {
      throw LoginFailedException.invoke(`${error}`);
    }
  }

  async loginNIS({ request, response, auth }) {
    const nis = request.input("nis");
    const password = request.input("password");
    await this.validate(
      { nis, password },
      {
        nis: "required",
        password: "required"
      }
    );
    // Attempt to login with nis and password
    let data = null;
    let userData = null;
    try {
      userData = await User.findBy({
        nis: typeof nis === "string" ? Number(nis) : nis
      });
      const passwordIsMatch = await Hash.verify(password, userData.password);
      if (passwordIsMatch) {
        const jwt = await auth.authenticator("withNis").generate(userData);
        data = {
          id: userData._id,
          username: userData.username,
          name: userData.name,
          grade: userData.grade,
          nis: userData.nis,
          imei: userData.imei,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          token: jwt.token
        };
        response.apiSuccess(data);
      } else {
        throw LoginFailedException.invoke("Invalid nis or password");
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
      throw LoginFailedException.invoke(`${error}`);
    }
  }

  async checkIn({ request, response }) {
    const user_id = request.input("user_id");
    const classroom = request.input("classroom");
    const attendance = new Attendance({
      user_id,
      classroom,
      status: "Checkin",
      checkInTime: new Date().toISOString()
    });
    const existingAttendance = await Attendance.findBy({
      status: "Checkin",
      user_id: user_id
    });
    await this.validate(request.all(), checkInValidation());

    if (existingAttendance) {
      return response.unprocessableEntity("User still hasn't checkout");
    } else {
      await attendance.save();

      return response.apiCreated({
        user_id: attendance.user_id,
        classroom: classroom,
        status: attendance.status,
        checkInTime: attendance.checkInTime,
        created_at: attendance.created_at,
        updated_at: attendance.updated_at,
        id: attendance._id
      });
    }
  }

  async checkOut({ response, params }) {
    const attendance = await Attendance.find(params.id);
    await attendance.save();

    if (attendance.status === "Checkout") {
      return response.unprocessableEntity("User already doing checkout");
    } else {
      attendance.status = "Checkout";
      attendance.checkOutTime = new Date();

      return response.apiUpdated({
        user_id: attendance.user_id,
        classroom: attendance.classroom,
        status: attendance.status,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        created_at: attendance.created_at,
        updated_at: attendance.updated_at,
        id: attendance._id
      });
    }
  }
}

module.exports = AttendanceController;
