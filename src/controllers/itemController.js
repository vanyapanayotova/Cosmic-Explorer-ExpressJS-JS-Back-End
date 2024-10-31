import { query, Router } from "express";
import itemService from "../services/itemService.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import Planet from "../models/Planet.js";

const router = Router();

router.get('/', async (req, res) => {
    const planets = await itemService.getAll().lean();
    res.render('planets/catalog', { planets, title: 'Catalog Page' });
});

router.get('/search', async (req, res) => {
    const query = req.query;
    const planets = await itemService.getAll(query).lean();
    res.render('planets/search', { planets, title: 'Search Page', query });
});

router.get('/create', isAuth, (req, res) => {
    res.render('planets/create', { title: 'Create Page', planetTypes: getPlanetTypeViewData(), planetRings:getPlanetRingsViewData() });
});

router.post('/create', isAuth, async (req, res) => {
    const itemData = req.body;
    const ownerId = req.user?._id;
    const planetType = itemData.type;
    const ringsType = itemData.rings;

    try {
        await itemService.create(itemData, ownerId);
    } catch (err) {
        console.log(itemData);
        
        const errorMessage = getErrorMessage(err);
        return res.render('planets/create', {
            error: errorMessage,
            planet: itemData,
            planetTypes: getPlanetTypeViewData(planetType),
            planetRings: getPlanetRingsViewData(ringsType),
            title: 'Create Page'
        });
    }

    res.redirect('/planets');
});

router.get('/:planetId', async (req, res) => {
    const planetId = req.params.planetId;
    const planet = await itemService.getOne(planetId).lean();
    const isOwner = planet.owner && planet.owner.toString() === req.user?._id;
    const hasLiked = planet.likedList.some(userID => userID == req.user?._id);

    res.render('planets/details', { planet: planet, isOwner, title: 'Details Page', hasLiked });
});

router.get('/:planetId/delete', isAuth, isOwner, async (req, res) => {
    const planetId = req.params.planetId;

    await itemService.remove(planetId);

    res.redirect('/planets');
});

router.get('/:planetId/edit', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const planet = await itemService.getOne(planetId).lean();

    if (planet.owner?.toString() !== req.user._id) {
        res.setError('You cannot edit this planet!');
        return res.redirect('/404');
    }

    res.render('planets/edit', {
        planet: planet,
        planetTypes: getPlanetTypeViewData(planet.type),
        planetRings: getPlanetRingsViewData(planet.rings),
        title: 'Edit Page'
    });
});

router.post('/:planetId/edit', isAuth, async (req, res) => {
    const itemData = req.body;
    const planetId = req.params.planetId;
    const planetType = itemData.type;
    const planetRings = itemData.rings;
    try {
        await itemService.edit(planetId, itemData);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('planets/edit', {
            error: errorMessage,
            planet: itemData,
            planetTypes: getPlanetTypeViewData(planetType),
            planetRings: getPlanetRingsViewData(planetRings),
            title: 'Edit Page'
        });
    }

    res.redirect(`/planets/${planetId}`);
});


router.get('/:planetId/like', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const planet = await itemService.getOne(planetId).lean();
    const hasLiked = planet.likedList.some(userID => userID == req.user?._id);

    if (planet.owner?.toString() === req.user._id || hasLiked ) {
        res.setError('You cannot like this planet!');

        return res.redirect(`/planets/${planetId}`);
    }

    const userID = req.user._id;
    await itemService.like(planetId, userID);
    res.redirect(`/planets/${planetId}`);
});


function getPlanetRingsViewData(ringPlanet = null) {
    let rings = ['Yes', 'No'];

    const viewData = rings.map(type => ({
        value: type,
        label: type,
        selected: ringPlanet === type ? 'selected' : ''
    }));

    return viewData;
}

function getPlanetTypeViewData(typePlanet = null) {
    let planetTypes = ['Inner', 'Outer', 'Dwarf'];

    const viewData = planetTypes.map(type => ({
        value: type,
        label: type,
        selected: typePlanet === type ? 'selected' : ''
    }));

    return viewData;
}

export default router;
