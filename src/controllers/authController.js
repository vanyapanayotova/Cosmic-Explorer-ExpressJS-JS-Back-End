import { Router } from 'express';
import validator from 'validator';

import authService from '../services/authService.js';
import { getErrorMessage } from '../utils/errorUtils.js';

const router = Router();

router.get('/register', (req, res) => {
    if (req.isAuthenticated) {
       return res.redirect('/404');
    }
    res.render('auth/register', { title: 'Register Page' });
});

router.post('/register', async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    try {
        await authService.register(username, email, password, rePassword);
    } catch (err) {
        let viewData = { error: getErrorMessage(err), email, username, title: 'Register Page' };
        return res.render('auth/register', viewData);
    }

    const token = await authService.login(username, password);

    res.cookie('auth', token, { httpOnly: true });

    res.redirect('/');
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect('/404');
    }
    res.render('auth/login', { title: 'Login Page' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password);
        res.cookie('auth', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        let viewData = { username, error: getErrorMessage(error), title: 'Login Page' };
        return res.render('auth/login', viewData);
    }
});

router.get('/logout', (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect('/404');
    }
    res.clearCookie('auth');
    res.redirect('/');
});

export default router;
