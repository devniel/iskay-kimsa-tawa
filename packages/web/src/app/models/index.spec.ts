import { readFileSync } from 'fs';
import { join } from 'path';
import { Script, Character, Scene, Layer } from './index';

describe('Script', () => {
  let yamlData: string;

  beforeAll(() => {
    const filePath = join(__dirname, '../../../../fixtures/scripts/script_small.yml');
    yamlData = readFileSync(filePath, 'utf8');
  });

  it('should create a Script instance from YAML data', () => {
    const script = Script.fromYAML(yamlData);

    expect(script).toBeInstanceOf(Script);
    expect(script.title).toBe('Iskay Kimsa Tawa');
    expect(script.characters).toHaveLength(4);
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

    expect(script.characters[2]).toBeInstanceOf(Character);
    expect(script.characters[2].name).toBe('Merchant');
    expect(script.characters[2].description).toBe('A street vendor selling goods in the background');

    expect(script.characters[3]).toBeInstanceOf(Character);
    expect(script.characters[3].name).toBe('Customer');
    expect(script.characters[3].description).toBe('A street vendor selling goods in the background');
  });

  it('should correctly parse scenes', () => {
    const script = Script.fromYAML(yamlData);
    const scene = script.scenes[0];

    expect(scene).toBeInstanceOf(Scene);
    expect(scene.scene_number).toBe(1);
    expect(scene.location).toBe('A mountain trail in the Peruvian Andes');
    expect(scene.time).toBe('13:00:00 12/02/1480');
    expect(scene.description).toBe('Rumi is looking around, appearing uncertain about their path.');
    expect(scene.layers).toHaveLength(10);
  });

  it('should correctly parse layers', () => {
    const script = Script.fromYAML(yamlData);
    const layers = script.scenes[0].layers;

    expect(layers[0]).toBeInstanceOf(Layer);
    expect(layers[0].name).toBe('Rumi');
    expect(layers[0].character).toBe('Rumi');
    expect(layers[0].distance).toBe('10m');
    expect(layers[0].sound).toBe('/Are you sure this is the right way, Sumaq?/');

    expect(layers[1]).toBeInstanceOf(Layer);
    expect(layers[1].name).toBe('The bird');
    expect(layers[1].distance).toBe('200m');
    expect(layers[1].altitude).toBe('100m');
    expect(layers[1].description).toBe('A bird flying, casting a shadow briefly.');

    expect(layers[2]).toBeInstanceOf(Layer);
    expect(layers[2].name).toBe('The river');
    expect(layers[2].distance).toBe('1km');
    expect(layers[2].description).toBe('A river runs along the edge of a mountain trail, its sound barely audible.');
  });

  it('should convert YAML to JSON', () => {
    const jsonString = Script.yamlToJSON(yamlData);
    const jsonData = JSON.parse(jsonString);

    expect(jsonData).toHaveProperty('title', 'Iskay Kimsa Tawa');
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
    const originalScene = new Scene(1, 'Test Location', 'Test Time', 'Test Description', [], 'Test Story');
    const jsonData = originalScene.toJSON();
    const reconstructedScene = Scene.fromJSON(jsonData);

    expect(reconstructedScene).toBeInstanceOf(Scene);
    expect(reconstructedScene).toEqual(originalScene);
  });

  it('should convert Layer to JSON and back to Layer', () => {
    const originalLayer = new Layer('Test Layer', 'Test Character', 'Test Distance', 'Test Altitude', 'Test Sound', 'Test Description');
    const jsonData = originalLayer.toJSON();
    const reconstructedLayer = Layer.fromJSON(jsonData);

    expect(reconstructedLayer).toBeInstanceOf(Layer);
    expect(reconstructedLayer).toEqual(originalLayer);
  });
});
