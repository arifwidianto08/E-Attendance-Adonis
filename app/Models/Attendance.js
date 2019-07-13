'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Attendance extends Model {
  static boot() {
    super.boot();
  }

  // token() {
  //   return this.hasMany('App/Models/Token');
  // }

  // static get hidden() {
  //   return ['password'];
  // }
}

module.exports = Attendance;
