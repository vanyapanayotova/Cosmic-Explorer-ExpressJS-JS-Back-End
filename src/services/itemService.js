import Item from '../models/Planet.js';

// TODO: Filter in db not in memory
const getAll = (filter = {}) => {
    let itemsQuery = Item.find();

    if (filter.name) {
        itemsQuery.find({ name: { $regex: filter.name, $options: 'i' } });
    }

    if (filter.solarSystem) {
        itemsQuery.find({ solarSystem: { $regex: filter.solarSystem, $options: 'i' } });
    }

    return itemsQuery;
};

const create = (item, ownerId) => Item.create({ ...item, owner: ownerId })

const getOne = (itemId) => Item.findById(itemId);

const remove = (itemId) => Item.findByIdAndDelete(itemId);

const edit = (itemId, data) => Item.findByIdAndUpdate(itemId, data, { runValidators: true });

const like = (itemId, ownerId) => Item.findByIdAndUpdate(itemId, { $push: { likedList: ownerId } });

export default {
    getAll,
    create,
    getOne,
    remove,
    edit,
    like
}
