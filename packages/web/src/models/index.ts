import * as yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

interface IScript {
  title: string;
  characters: ICharacter[];
  story: string;
  scenes: IScene[];
}

interface ICharacter {
  name: string;
  description: string;
}

interface IScene {
  scene_number: number;
  location: string;
  time: string;
  description: string;
  layers: ILayer[];
  story: string;
  pov: string;
}

interface ILayer {
  name: string;
  character?: string;
  distance?: string;
  altitude?: string;
  sound?: string;
  description?: string;
}

interface IAsset {
  type: 'image' | 'audio';
  data: string;
}

export class Script implements IScript {
  title: string;
  characters: Character[];
  scenes: Scene[];
  story: string;
  constructor(data: IScript) {
    this.title = data.title;
    this.characters = data.characters.map((char: ICharacter) => new Character(char.name, char.description));
    this.story = data.story;
    this.scenes = data.scenes.map(
      (scene: IScene) =>
        new Scene(
          scene.scene_number,
          scene.location,
          scene.time,
          scene.description,
          scene.layers.map(
            (layer: ILayer) =>
              new Layer(
                layer.name,
                layer.character,
                layer.distance,
                layer.altitude,
                layer.sound,
                layer.description
              )
          ),
          scene.story,
          scene.pov
        )
    );
  }

  static fromYAML(yamlData: string): Script {
    try {
      const jsonData = yaml.load(yamlData) as IScript;
      return new Script(jsonData);
    } catch (error) {
      console.error('Error parsing YAML:', error);
      throw new Error('Failed to parse YAML data');
    }
  }

  static yamlToJSON(yamlData: string): string {
    try {
      const jsonData = yaml.load(yamlData);
      return JSON.stringify(jsonData, null, 2);
    } catch (error) {
      console.error('Error converting YAML to JSON:', error);
      throw new Error('Failed to convert YAML to JSON');
    }
  }

  toJSON(): IScript {
    return {
      title: this.title,
      characters: this.characters.map((char) => char.toJSON()),
      scenes: this.scenes.map((scene) => scene.toJSON()),
      story: this.story,
    };
  }

  static fromJSON(json: IScript): Script {
    return new Script(json);
  }
}

export class Character implements ICharacter {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  toJSON(): ICharacter {
    return {
      name: this.name,
      description: this.description,
    };
  }

  static fromJSON(json: ICharacter): Character {
    return new Character(json.name, json.description);
  }
}

export class Scene implements IScene {
  scene_number: number;
  location: string;
  time: string;
  description: string;
  layers: Layer[];
  story: string;
  pov: string;

  constructor(
    scene_number: number,
    location: string,
    time: string,
    description: string,
    layers: Layer[],
    story: string,
    pov: string
  ) {
    this.scene_number = scene_number;
    this.location = location;
    this.time = time;
    this.description = description;
    this.layers = layers;
    this.story = story;
    this.pov = pov;
  }

  toJSON(): IScene {
    return {
      scene_number: this.scene_number,
      location: this.location,
      time: this.time,
      description: this.description,
      layers: this.layers.map((layer) => layer.toJSON()),
      story: this.story,
      pov: this.pov,
    };
  }

  static fromJSON(json: IScene): Scene {
    return new Scene(
      json.scene_number,
      json.location,
      json.time,
      json.description,
      json.layers.map(Layer.fromJSON),
      json.story,
      json.pov
    );
  }
}
export class Layer implements ILayer {
  name: string;
  character?: string;
  distance?: string;
  altitude?: string;
  sound?: string;
  description?: string;

  constructor(
    name: string,
    character?: string,
    distance?: string,
    altitude?: string,
    sound?: string,
    description?: string
  ) {
    this.name = name;
    this.character = character;
    this.distance = distance;
    this.altitude = altitude;
    this.sound = sound;
    this.description = description;
  }

  toJSON(): ILayer {
    return {
      name: this.name,
      character: this.character,
      distance: this.distance,
      altitude: this.altitude,
      sound: this.sound,
      description: this.description,
    };
  }

  static fromJSON(json: ILayer): Layer {
    return new Layer(
      json.name,
      json.character,
      json.distance,
      json.altitude,
      json.sound,
      json.description
    );
  }
}

export class Asset implements IAsset {
  type: 'image' | 'audio';
  data: string;
  id: string;

  constructor(data: string) {
    this.type = 'image';
    this.data = data;
    this.id = uuidv4();
  }
}
