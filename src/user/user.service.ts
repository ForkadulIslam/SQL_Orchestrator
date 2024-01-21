import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async addMultiple(userData){
        
        const transactionalEntityManager = this.userRepository.manager.connection.createQueryRunner();

        try {
            await transactionalEntityManager.connect();
            await transactionalEntityManager.startTransaction();

            const dbState = [];

            for (const userDataItem of userData) {
                const [Uid, Username, City, Friend] = userDataItem;

                const existingUser = await this.userRepository.findOne({ where: { Uid } });

                if (existingUser) {
                    throw new HttpException(
                        {
                            error: 'Duplicate',
                            dbState: existingUser,
                        },
                        HttpStatus.BAD_REQUEST
                    );
                } else {
                    const newUser = this.userRepository.create({
                        Uid,
                        Username,
                        City,
                        Friend,
                    });

                    await transactionalEntityManager.manager.save(User, newUser);
                    dbState.push(newUser);
                }
            }

            await transactionalEntityManager.commitTransaction();

            return {
                status: 'OK',
                dbState,
            };
        } catch (error) {
            await transactionalEntityManager.rollbackTransaction();

            if (error instanceof HttpException) {
                throw error; // Re-throw HttpException to propagate it to the controller
            } else {
                return {
                    error: error.message || error,
                };
            }
        } finally {
            await transactionalEntityManager.release();
        }
        
    }
}
