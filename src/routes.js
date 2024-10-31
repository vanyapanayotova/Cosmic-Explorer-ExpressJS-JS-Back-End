import { Router } from 'express';

import homeController from './controllers/homeController.js';
import itemController from './controllers/itemController.js';
import authController from './controllers/authController.js';
import { isAuth } from './middlewares/authMiddleware.js';

const router = Router();

router.use(homeController);
router.use('/planets', itemController);
router.use('/auth', authController);

router.all('*', (req, res) => {
    res.render('404', {title: '404 Page'});
});

export default router;
