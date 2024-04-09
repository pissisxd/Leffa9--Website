const express = require('express');
const router = express.Router();
const profileService = require('./profileService');
const { auth } = require('../middleware/auth');


router.get('/profile', async (req, res) => {
    const result = await profileService.getAllProfiles();
    if (result.success) {
        res.status(200).json(result.message);
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.get('/profile/id/:profileid', async (req, res) => {
    const profileid = req.params.profileid;
    const result = await profileService.getProfileById(profileid);
    if (result.success) {
        res.status(200).json(result.message);
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.get('/profile/:profilename', async (req, res) => {
    const profilename = req.params.profilename;
    const result = await profileService.getProfileByName(profilename);
    if (result.success) {
        res.status(200).json(result.message);
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.delete('/profile/:profileid', async (req, res) => {
    const profileid = req.params.profileid;
    const result = await profileService.deleteProfileById(profileid);
    if (result.success) {
        res.status(200).json({ message: `Tietue poistettu onnistuneesti: ${result.message}` });
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.put('/profile/:profileid', async (req, res) => {
    const profileid = req.params.profileid;
    const { profilename, email, profilepicurl, description } = req.body;
    const result = await profileService.updateProfileById(profileid, profilename, email, profilepicurl, description);
    if (result.success) {
        res.status(200).json({ message: `Tietue päivitetty onnistuneesti: ${result.message}` });
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.get('/profile/:timestamp', async (req, res) => {
    const profileId = req.params.profileid;
    try {
      const timestamp = await profileService.getProfileTimestamp(profileId);
      if (timestamp === null) {
        return res.status(404).json({ error: 'Profiilia ei löydy' });
      }
      res.json({ timestamp });
    } catch (error) {
      console.error('Virhe haettaessa profiilitietoja:', error);
      res.status(500).json({ error: 'Virhe haettaessa profiilitietoja' });
    }
  });
module.exports = router;