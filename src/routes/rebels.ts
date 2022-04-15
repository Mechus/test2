import express from 'express';
import * as rebelsServices from '../services/rebelsService'
//import { Satellites } from '../types';
import { parseSatelliteName, validateSatellite } from "../utils";
import config from 'config';

const router = express.Router();

router.post(config.get<string>('paths.topSecretPath'), (req,res) => {
    try {
        if(req.body && !validateSatellite(req.body.satellites)) return res.status(404).send();
        const position = rebelsServices.getTopSecret(req.body.satellites);
        return (position) ? res.send(position) : res.status(404).send();
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
});

router.get(config.get<string>('paths.topSecretSplitGPath'), (_req,res) => {
    try {
        const position = rebelsServices.getTopSecretSplit();
        return (position) ? res.send(position) : res.status(404).send('There is not enough information');
    } catch (error) {
        return res.status(500).send()
    }
});

router.post(config.get<string>('paths.topSecretSplitPPath'), (req,res) => {
    try {
        if(req.body && !validateSatellite(req.body)) return res.status(404).send();
        const result = rebelsServices.postTopSecretSplit(req.body,parseSatelliteName(req.params.name));
        return result ? res.send('Information send correctly') : res.status(500).send();
    } catch (error) {
        return res.status(500).send()
    }
});

export default router;
