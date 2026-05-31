import { userRepository } from "../repositories/userRepository.js";

class UserService {

  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }

  add(candidate) {
    candidate.email = candidate.email.toLowerCase();
    const user = userRepository.create(candidate);
    return user;
  }

  getAll() {
    return userRepository.getAll();
  }

  update(id, update) {
    if (update.email) {
      update.email = update.email.toLowerCase();
    }
    const updatedUser = userRepository.update(id, update);
    return updatedUser;
  }

  delete(id) {
    const deletedUser = userRepository.delete(id);
    if (deletedUser.length === 0) {
      throw new Error(`User wasn't found`);
    }
    return deletedUser;
  }
}

const userService = new UserService();

export { userService };
