import yaml from 'js-yaml';
import { Script, Asset } from '@/models';

const data = `
title: "Iskay Kimsa Tawa"
characters:
  - name: Hand
    description: A hand
story: |+
  Iskay
  Kimsa
  Tawa
scenes:
  - scene_number: 1
    location: "A mountain trail in the Peruvian Andes"
    time: "13:00:00 12/02/1480"
    pov: "public"
    story: "Iskay"
    layers:
      - name: "Counting"
        character: "Hand"
        distance: 10m
        sound: "Iskay"
        description: "A detailed image of a human hand with fingers extended to show the number 1. The hand is positioned in front of a neutral background, with the index finger pointing upward, while the other fingers are closed into the palm. The skin tone is natural, and the lighting highlights the contours and details of the hand. The image focuses on the hand, with no other elements distracting from the gesture."
      - name: "The bird"
        distance: 200m
        altitude: 100m
        description: "A bird flying, casting a shadow briefly."
      - name: "The river"
        distance: 1km
        description: "A river runs along the edge of a mountain trail, its sound barely audible."
      - name: "Environmental Cues"
        sound: "The wind picks up, rustling the leaves of nearby trees."
      - name: "The Wind"
        sound: "A sound of wind"
      - name: "The Stones"
        description: "A collection of stones on the mountain trail."
      - name: "The Trees"
        description: "A collection of trees on the mountain trail."
      - name: "The Sky"
        description: "The sky is blue, with a few clouds."
      - name: "The Sun"
        description: "The sun is shining down on the mountain trail."
      - name: "The Inca City"
        distance: 1km
        description: "An active Inca city."
      - name: "A mountain"
        distance: 1km
        description: "A mountain."
  - scene_number: 2
    location: "A mountain trail in the Peruvian Andes"
    time: "13:00:10 12/02/1480"
    pov: "public"
    story: "Kimsa"
    layers:
      - name: "Counting"
        character: "Hand"
        distance: 10m
        sound: "Kimsa"
        description: "A detailed image of a human hand showing the number 2 by holding the index and middle fingers up, while the other fingers are curled into the palm. The hand is positioned in front of a neutral background with soft lighting, highlighting the texture of the skin and the smooth lines of the fingers. The gesture is clear and central to the image, with no other distractions."
      - name: "The bird"
        distance: 200m
        altitude: 100m
        description: "A bird flying, casting a shadow briefly."
      - name: "The river"
        distance: 1km
        description: "A river runs along the edge of a mountain trail, its sound barely audible."
      - name: "Environmental Cues"
        sound: "The wind picks up, rustling the leaves of nearby trees."
      - name: "The Wind"
        sound: "A sound of wind"
      - name: "The Stones"
        description: "A collection of stones on the mountain trail."
      - name: "The Trees"
        description: "A collection of trees on the mountain trail."
      - name: "The Sky"
        description: "The sky is blue, with a few clouds."
      - name: "The Sun"
        description: "The sun is shining down on the mountain trail."
      - name: "The Inca City"
        distance: 1km
        description: "An active Inca city."
      - name: "A mountain"
        distance: 1km
        description: "A mountain."
  - scene_number: 3
    location: "A mountain trail in the Peruvian Andes"
    time: "13:00:20 12/02/1480"
    pov: "public"
    story: "Tawa"
    layers:
      - name: "Counting"
        character: "Hand"
        distance: 10m
        sound: "Tawa"
        description: "A detailed image of a human hand showing the number 3 by holding the index, middle, and ring fingers up, while the thumb and pinky are curled into the palm. The hand is positioned in front of a neutral background with soft lighting, emphasizing the skin's natural texture and the clarity of the gesture. The focus is entirely on the hand and its position, with no other distracting elements."
      - name: "The bird"
        distance: 200m
        altitude: 100m
        description: "A bird flying, casting a shadow briefly."
      - name: "The river"
        distance: 1km
        description: "A river runs along the edge of a mountain trail, its sound barely audible."
      - name: "Environmental Cues"
        sound: "The wind picks up, rustling the leaves of nearby trees."
      - name: "The Wind"
        sound: "A sound of wind"
      - name: "The Stones"
        description: "A collection of stones on the mountain trail."
      - name: "The Trees"
        description: "A collection of trees on the mountain trail."
      - name: "The Sky"
        description: "The sky is blue, with a few clouds."
      - name: "The Sun"
        description: "The sun is shining down on the mountain trail."
      - name: "The Inca City"
        distance: 1km
        description: "An active Inca city."
      - name: "A mountain"
        distance: 1km
        description: "A mountain."
`;

export const fetchScript = async (): Promise<Script> => {
  const script = yaml.load(data) as Script;
  return script;
};

export const mockAssets: Record<string, Asset> = {
  [`A detailed image of a human hand with fingers extended to show the number 1. The hand is positioned in front of a neutral background, with the index finger pointing upward, while the other fingers are closed into the palm. The skin tone is natural, and the lighting highlights the contours and details of the hand. The image focuses on the hand, with no other elements distracting from the gesture.`]:
    {
      type: 'image',
      data: '/mocks/counting_1.png',
    },
  [`A detailed image of a human hand showing the number 2 by holding the index and middle fingers up, while the other fingers are curled into the palm. The hand is positioned in front of a neutral background with soft lighting, highlighting the texture of the skin and the smooth lines of the fingers. The gesture is clear and central to the image, with no other distractions.`]:
    {
      type: 'image',
      data: '/mocks/counting_2.png',
    },
  [`A detailed image of a human hand showing the number 3 by holding the index, middle, and ring fingers up, while the thumb and pinky are curled into the palm. The hand is positioned in front of a neutral background with soft lighting, emphasizing the skin's natural texture and the clarity of the gesture. The focus is entirely on the hand and its position, with no other distracting elements.`]:
    {
      type: 'image',
      data: '/mocks/counting_3.png',
    },
  [`A bird flying, casting a shadow briefly.`]: {
    type: 'image',
    data: '/mocks/the_bird.png',
  },
  [`A collection of trees on the mountain trail.`]: {
    type: 'image',
    data: '/mocks/the_tree.png',
  },
  [`The sun is shining down on the mountain trail.`]: {
    type: 'image',
    data: '/mocks/the_sun.png',
  },
  [`An active Inca city.`]: {
    type: 'image',
    data: '/mocks/the_inca.png',
  },
  [`A mountain.`]: {
    type: 'image',
    data: '/mocks/the_mountain.png',
  },
};

export const fetchAsset = async ({
  prompt,
}: {
  prompt: string;
}): Promise<Asset> => {
  return mockAssets[prompt] as Asset;
};
