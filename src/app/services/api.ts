import yaml from 'js-yaml';
import { Script } from 'app/models';

const data = `
title: "The Hidden Path"
characters:
  - name: Sumaq
    description: A young explorer
  - name: Rumi
    description: Sumaq's friend
scenes:
  - scene_number: 1
    location: "EXT. MOUNTAIN TRAIL"
    time: "DAY"
    description: "Sumaq and Rumi are walking along a rugged mountain trail. The sun is shining, and the path ahead is narrow and filled with stones."
    layers:
      - layer_name: "Foreground - Main Dialogue"
        dialogues:
          - character: "Rumi"
            action: "(looking around)"
            line: "Are you sure this is the right way, Sumaq?"
          - character: "Sumaq"
            action: "(smiling)"
            line: "The elders say there are signs in the numbers, Rumi. We just have to look carefully."
      - layer_name: "Background - Nature Movement"
        events:
          - description: "A bird is seen flying above the characters, casting a shadow briefly."
          - description: "A river runs along the edge of the trail, its sound barely audible."
      - layer_name: "Background - Environmental Cues"
        events:
          - description: "The wind picks up, rustling the leaves of nearby trees."
          - description: "Small stones tumble down the mountain slope, dislodged by the movement of animals unseen."
`;

export const fetchScript = async (): Promise<Script> => {
  const script = yaml.load(data) as Script;
  return script;
};
