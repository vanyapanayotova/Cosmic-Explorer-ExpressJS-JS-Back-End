import { Schema, model, Types } from 'mongoose';

const planetSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The Name should be at least 2 characters!'],
        minLength: 2
    },
    age: {
        type: Number,
        required: [true, 'The Age should be a positive number!'],
        min: 1
    },
    solarSystem: {
        type: String,
        required: true,
        minLength: [2, 'The Solar System should be at least 2 characters!'],
    },
    type: {
        type: String,
        required: true,
        enum: ['Inner', 'Outer', 'Dwarf']
    },
    moons: {
        type: Number,
        required: true,
        min: [1, 'The Moons should be a positive number!']
    },
    size: {
        type: Number,
        required: true,
        min: [1, 'The Size should be a positive number!']
    },
    rings: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The Description should be minimum 10 characters long!'],
        maxLength: [100, 'The Description should be maximum 100 characters long!']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://!'],
    },
    likedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    }
});

const Planet = model('Planet', planetSchema);

export default Planet;
