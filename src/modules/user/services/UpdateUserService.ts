import { UpdateUserDTO } from '@user/infra/dtos/UpdateUserDTO';
import { User } from '@user/infra/schema/User';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFound } from '@/errors/NotFound';

export class UpdateUserService {
  private readonly acceptedFields = ['name', 'username', 'password'];
  readonly userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async execute(user: UpdateUserDTO): Promise<User> {
    const { id, ...userData } = user;

    if (!id) {
      throw new Error('User id is required');
    }

    const userId = new ObjectId(id);
    const keys = Object.keys(userData);

    if (keys.length === 0) {
      throw new Error('No data to update');
    }

    const isValidFields = keys.every(key => this.acceptedFields.includes(key));

    if (!isValidFields) {
      throw new Error('Invalid field');
    }

    let updatedUser = await this.userRepository.findOneBy({
      _id: new ObjectId(userId),
    });

    if (!updatedUser) {
      throw new NotFound('User not found');
    }

    const updatedFields = {
      ...userData,
      updated_at: new Date(),
    };

    this.userRepository.merge(updatedUser, updatedFields);
    return await this.userRepository.save(updatedUser);
  }
}
