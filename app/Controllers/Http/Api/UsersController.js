'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const BaseController = require('./BaseController');
/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User');
const Hash = use('Hash');
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException');
const { storeUser } = require('../../../Validators/User');
/**
 *
 * @class UsersController
 */
class UsersController extends BaseController {
  /**
   * Index
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, decodeQuery }) {
    // const users = await User.query(decodeQuery()).fetch();
    const users = await User.all();
    console.log(process.env);
    return response.apiCollection(users);
  }

  /**
   * Store
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    await this.validate(request.all(), storeUser());
    const user = new User(request.all());
    const username = request.input('username');

    // validate body
    const usernameExsist = await User.findBy({ username });
    if (usernameExsist) {
      return response.unprocessableEntity('Username already exist');
    }

    const password = await Hash.make(request.input('password'));
    user.set({
      password: password
    });

    await user.save();
    return response.apiCreated(user);
  }

  /**
   * Show
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ request, response, params, decodeQuery }) {
    const user = await User.find(params.id);
    // await user.related(decodeQuery().with).load()
    return response.apiItem(user);
  }

  /**
   * Update
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   */
  async update({ request, response, params, auth }) {
    const user = await User.find(params.id);
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke();
    }
    user.merge(request.only(['name', 'locale']));
    await user.save();
    return response.apiUpdated(user);
  }

  /**
   * Destroy
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ request, response, auth, params }) {
    const user = await User.find(params.id);

    await user.delete();
    return response.apiDeleted();
  }
}

module.exports = UsersController;
