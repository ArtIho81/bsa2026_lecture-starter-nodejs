import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  #defaultHealth = 85;

  search(search) {
    const item = fighterRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }

  add(candidate) {
    candidate.health = candidate.health ?? this.#defaultHealth;
    candidate.name = candidate.name.toLowerCase();
    const fighter = fighterRepository.create(candidate);
    return fighter;
  }

  getAll() {
    return fighterRepository.getAll();
  }

  update(id, update) {
    if (update.name) {
      update.name = update.name.toLowerCase();
    }
    const updatedFighter = fighterRepository.update(id, update);
    if (!updatedFighter) {
      throw new Error(`Fighter wasn't found`);
    }
    return updatedFighter;
  }

  delete(id) {
    const deletedFighter = fighterRepository.delete(id);
    if (deletedFighter.length === 0) {
      throw new Error(`Fighter wasn't found`);
    }
    return deletedFighter;
  }
}

const fighterService = new FighterService();

export { fighterService };
