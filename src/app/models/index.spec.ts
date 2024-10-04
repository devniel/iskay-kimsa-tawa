import { readFileSync } from 'fs';
import { join } from 'path';
import { Script, Character, Scene, Layer, Dialogue, Event } from './index';

describe('Script', () => {
  let yamlData: string;

  beforeAll(() => {
    const filePath = join(__dirname, '../fixtures/script.yml');
    yamlData = readFileSync(filePath, 'utf8');
  });

  it('should create a Script instance from YAML data', () => {
    const script = Script.fromYAML(yamlData);

    expect(script).toBeInstanceOf(Script);
    expect(script.title).toBe('The Hidden Path');
    expect(script.characters).toHaveLength(2);
    expect(script.scenes).toHaveLength(1);
  });

  it('should correctly parse characters', () => {
    const script = Script.fromYAML(yamlData);

    expect(script.characters[0]).toBeInstanceOf(Character);
    expect(script.characters[0].name).toBe('Sumaq');
    expect(script.characters[0].description).toBe('A young explorer');

    expect(script.characters[1]).toBeInstanceOf(Character);
    expect(script.characters[1].name).toBe('Rumi');
    expect(script.characters[1].description).toBe("Sumaq's friend");
  });

  it('should correctly parse scenes', () => {
    const script = Script.fromYAML(yamlData);
    const scene = script.scenes[0];

    expect(scene).toBeInstanceOf(Scene);
    expect(scene.scene_number).toBe(1);
    expect(scene.location).toBe('EXT. MOUNTAIN TRAIL');
    expect(scene.time).toBe('DAY');
    expect(scene.description).toBe(
      'Sumaq and Rumi are walking along a rugged mountain trail. The sun is shining, and the path ahead is narrow and filled with stones.'
    );
    expect(scene.layers).toHaveLength(3);
    expect(scene.end_scene).toBe(true);
  });

  it('should correctly parse layers', () => {
    const script = Script.fromYAML(yamlData);
    const layers = script.scenes[0].layers;

    expect(layers[0]).toBeInstanceOf(Layer);
    expect(layers[0].layer_name).toBe('Foreground - Main Dialogue');
    expect(layers[0].dialogues).toHaveLength(2);

    expect(layers[1]).toBeInstanceOf(Layer);
    expect(layers[1].layer_name).toBe('Background - Nature Movement');
    expect(layers[1].events).toHaveLength(2);

    expect(layers[2]).toBeInstanceOf(Layer);
    expect(layers[2].layer_name).toBe('Background - Environmental Cues');
    expect(layers[2].events).toHaveLength(2);
  });

  it('should correctly parse dialogues', () => {
    const script = Script.fromYAML(yamlData);
    const dialogues = script.scenes[0].layers[0].dialogues;

    expect(dialogues![0]).toBeInstanceOf(Dialogue);
    expect(dialogues![0].character).toBe('Rumi');
    expect(dialogues![0].action).toBe('(looking around)');
    expect(dialogues![0].line).toBe('Are you sure this is the right way, Sumaq?');

    expect(dialogues![1]).toBeInstanceOf(Dialogue);
    expect(dialogues![1].character).toBe('Sumaq');
    expect(dialogues![1].action).toBe('(smiling)');
    expect(dialogues![1].line).toBe(
      'The elders say there are signs in the numbers, Rumi. We just have to look carefully.'
    );
  });

  it('should correctly parse events', () => {
    const script = Script.fromYAML(yamlData);
    const events = script.scenes[0].layers[1].events;

    expect(events![0]).toBeInstanceOf(Event);
    expect(events![0].description).toBe('A bird is seen flying above the characters, casting a shadow briefly.');

    expect(events![1]).toBeInstanceOf(Event);
    expect(events![1].description).toBe('A river runs along the edge of the trail, its sound barely audible.');
  });

  it('should convert YAML to JSON', () => {
    const jsonString = Script.yamlToJSON(yamlData);
    const jsonData = JSON.parse(jsonString);

    expect(jsonData).toHaveProperty('title', 'The Hidden Path');
    expect(jsonData).toHaveProperty('characters');
    expect(jsonData).toHaveProperty('scenes');
  });

  it('should convert Script to JSON and back to Script', () => {
    const originalScript = Script.fromYAML(yamlData);
    const jsonData = originalScript.toJSON();
    const reconstructedScript = Script.fromJSON(jsonData);

    expect(reconstructedScript).toBeInstanceOf(Script);
    expect(reconstructedScript).toEqual(originalScript);
  });

  it('should convert Character to JSON and back to Character', () => {
    const originalCharacter = new Character('Test', 'Test Description');
    const jsonData = originalCharacter.toJSON();
    const reconstructedCharacter = Character.fromJSON(jsonData);

    expect(reconstructedCharacter).toBeInstanceOf(Character);
    expect(reconstructedCharacter).toEqual(originalCharacter);
  });

  it('should convert Scene to JSON and back to Scene', () => {
    const originalScene = new Scene(1, 'Test Location', 'Test Time', 'Test Description', [], true);
    const jsonData = originalScene.toJSON();
    const reconstructedScene = Scene.fromJSON(jsonData);

    expect(reconstructedScene).toBeInstanceOf(Scene);
    expect(reconstructedScene).toEqual(originalScene);
  });

  it('should convert Layer to JSON and back to Layer', () => {
    const originalLayer = new Layer('Test Layer', [], []);
    const jsonData = originalLayer.toJSON();
    const reconstructedLayer = Layer.fromJSON(jsonData);

    expect(reconstructedLayer).toBeInstanceOf(Layer);
    expect(reconstructedLayer).toEqual(originalLayer);
  });

  it('should convert Dialogue to JSON and back to Dialogue', () => {
    const originalDialogue = new Dialogue('Test Character', 'Test Action', 'Test Line');
    const jsonData = originalDialogue.toJSON();
    const reconstructedDialogue = Dialogue.fromJSON(jsonData);

    expect(reconstructedDialogue).toBeInstanceOf(Dialogue);
    expect(reconstructedDialogue).toEqual(originalDialogue);
  });

  it('should convert Event to JSON and back to Event', () => {
    const originalEvent = new Event('Test Description');
    const jsonData = originalEvent.toJSON();
    const reconstructedEvent = Event.fromJSON(jsonData);

    expect(reconstructedEvent).toBeInstanceOf(Event);
    expect(reconstructedEvent).toEqual(originalEvent);
  });
});
