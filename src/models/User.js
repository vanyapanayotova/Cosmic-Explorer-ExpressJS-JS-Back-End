import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: [2, 'The username should be between 2 and 20 characters long.'],
        maxLength: [20, 'The username should be between 2 and 20 characters long.']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [/@[A-Za-z0-9]+.[A-Za-z0-9]+$/, 'Invalid email address!'],
        minLength: [10, 'The email should be at least 10 characters long'],
    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'The password should be at least 4 characters long!'],
    },
});

userSchema.virtual('rePassword')
    .set(function(value) {
        if (value !== this.password) {
            throw new Error('The repeat password should be equal to the password');
        }
    });

// Hash password before save
userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model('User', userSchema);

export default User;
