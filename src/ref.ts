// *! Reference Don't remove it

// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))

// console.log('Inserting a new user into the database...');
// const user = new User()
// user.firstName = "Timber"
// user.lastName = "Saw"
// user.age = 25
// await AppDataSource.manager.save(user)
// console.log("Saved a new user with id: " + user.id)

// console.log('Loading users from the database...');
// const users = await AppDataSource.manager.find(User)
// console.log("Loaded users: ", users)

// console.log("Here you can setup and run express / fastify / any other framework.")

// await connection.runMigrations();
// tests out repo functionality
// might be commented out
// await smokeTest(connection);

// start server

// *! Reference do not remove
// router.post('/register', async (req: Request, res: Response) => {
//     // TODO add request body validation middleware
//     // I omitted this to not make the tutorial too complex
//     const userService = new UserController();
//     try {
//         await userService.register(req.body);
//         res.sendStatus(201);
//     } catch (err) {
//         res.status(500).json('something went wrong');
//     }
// });
