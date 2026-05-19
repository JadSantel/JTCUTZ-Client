const express = require('express');

const router = express.Router();

// Gallery data with 13 haircut styles
const galleryData = [
  {
    id: 1,
    name: '16 Guard',
    image: '/images/gallery/16 Guard.jpg',
    description: 'Classic short cut with even length throughout',
  },
  {
    id: 2,
    name: 'Burst Fade',
    image: '/images/gallery/Burst Fade.jpg',
    description: 'Faded sides with burst design at the back',
  },
  {
    id: 3,
    name: 'Buzz Cut',
    image: '/images/gallery/Buzz Cut.jpg',
    description: 'Clean, uniform short cut',
  },
  {
    id: 4,
    name: 'Curtains',
    image: '/images/gallery/Curtains.jpg',
    description: 'Longer on top, styled to the sides',
  },
  {
    id: 5,
    name: 'French Crop',
    image: '/images/gallery/French Crop.jpg',
    description: 'Textured top with short faded sides',
  },
  {
    id: 6,
    name: 'High Fade',
    image: '/images/gallery/High Fade.jpg',
    description: 'Dramatic fade starting high on the sides',
  },
  {
    id: 7,
    name: 'High Taper',
    image: '/images/gallery/High Taper.jpg',
    description: 'Gradual taper starting high up',
  },
  {
    id: 8,
    name: 'Low Fade',
    image: '/images/gallery/Low Fade.jpg',
    description: 'Subtle fade starting low on the sides',
  },
  {
    id: 9,
    name: 'Low Taper',
    image: '/images/gallery/Low Taper.jpg',
    description: 'Gradual taper starting low up',
  },
  {
    id: 10,
    name: 'Mid Fade',
    image: '/images/gallery/Mid Fade.jpg',
    description: 'Medium fade for balanced look',
  },
  {
    id: 11,
    name: 'Mid Taper',
    image: '/images/gallery/Mid Taper.jpg',
    description: 'Gradual taper in the middle',
  },
  {
    id: 12,
    name: 'Modern Mullet',
    image: '/images/gallery/Modern Mullet.jpg',
    description: 'Contemporary take on the classic mullet',
  },
  {
    id: 13,
    name: 'Slick Back',
    image: '/images/gallery/Slick Back.jpg',
    description: 'Sleek, styled-back look',
  },
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    gallery: galleryData,
  });
});

router.get('/:id', (req, res) => {
  const style = galleryData.find((s) => s.id === parseInt(req.params.id, 10));
  if (!style) {
    return res.status(404).json({ success: false, message: 'Style not found' });
  }
  res.json({ success: true, style });
});

module.exports = router;
