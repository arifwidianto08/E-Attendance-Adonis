'use strict';

/*
|--------------------------------------------------------------------------
| User Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route');

Route.group('user', () => {
  /**
   * @\swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - $ref: '#/components/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/components/schemas/User'
   */
  Route.get('/', 'Api/UsersController.index');

  /**
   * \@swagger
   * /users:
   *   post:
   *     tags:
   *       - User
   *     summary: Create user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/components/schemas/User'
   */
  Route.post('/', 'Api/UsersController.store');

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags:
   *       - User
   *     summary: Returns user
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *       - $ref: '#/components/parameters/SingleQuery'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/components/schemas/User'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  Route.get('/:id', 'Api/UsersController.show');

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *       - User
   *     summary: Update users
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       202:
   *         description: user
   *         schema:
   *           $ref: '#/components/schemas/User'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   */
  Route.put('/:id', 'Api/UsersController.update')
    //.middleware(['auth:jwt'])

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags:
   *       - User
   *     summary: Delete users
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       202:
   *         description: delete success
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.delete('/:id', 'Api/UsersController.destroy')
    //.middleware(['auth:jwt'])


}).prefix('/api/users');
