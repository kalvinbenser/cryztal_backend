/* eslint-disable require-jsdoc */
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);
    async register(req: Record<string, any>) {
        // TODO: check if email already exists
        // and if yes return a meaningful error
        // it would make sense to add a general error
        // handling middleware to the server
        // I omitted this to not make the tutorial too complex

        // const userRepo = getRepository(User);
        const user = new User();
        user.firstName = req.firstName;
        user.age = req.age;
        user.lastName = req.lastName;
        return this.userRepository.save(user);
    }
}

// async all(request: Request, response: Response, next: NextFunction) {
//     return this.userRepository.find();
// }

// async one(request: Request, response: Response, next: NextFunction) {
//     return this.userRepository.findOne(request.params.id);
// }

// async save(request: Request, response: Response, next: NextFunction) {
//     return this.userRepository.save(request.body);
// }

// async remove(request: Request, response: Response, next: NextFunction) {
//     let userToRemove = await this.userRepository.findOne(request.params.id);
//     await this.userRepository.remove(userToRemove);
// }
