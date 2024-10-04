import * as yaml from 'js-yaml';

interface IScript {
  title: string;
  characters: ICharacter[];
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
  end_scene: boolean;
}

interface ILayer {
  layer_name: string;
  dialogues?: IDialogue[];
  events?: IEvent[];
}

interface IDialogue {
  character: string;
  action: string;
  line: string;
}

interface IEvent {
  description: string;
}

export class Script implements IScript {
  title: string;
  characters: Character[];
  scenes: Scene[];

  constructor(data: IScript) {
    this.title = data.title;
    this.characters = data.characters.map((char: ICharacter) => new Character(char.name, char.description));
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
                layer.layer_name,
                layer.dialogues?.map(
                  (dialogue: IDialogue) => new Dialogue(dialogue.character, dialogue.action, dialogue.line)
                ) || [],
                layer.events?.map((event: IEvent) => new Event(event.description)) || []
              )
          ),
          scene.end_scene
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
  end_scene: boolean;

  constructor(
    scene_number: number,
    location: string,
    time: string,
    description: string,
    layers: Layer[],
    end_scene: boolean
  ) {
    this.scene_number = scene_number;
    this.location = location;
    this.time = time;
    this.description = description;
    this.layers = layers;
    this.end_scene = end_scene;
  }

  toJSON(): IScene {
    return {
      scene_number: this.scene_number,
      location: this.location,
      time: this.time,
      description: this.description,
      layers: this.layers.map((layer) => layer.toJSON()),
      end_scene: this.end_scene,
    };
  }

  static fromJSON(json: IScene): Scene {
    return new Scene(
      json.scene_number,
      json.location,
      json.time,
      json.description,
      json.layers.map(Layer.fromJSON),
      json.end_scene
    );
  }
}

export class Layer implements ILayer {
  layer_name: string;
  dialogues?: Dialogue[];
  events?: Event[];

  constructor(layer_name: string, dialogues?: Dialogue[], events?: Event[]) {
    this.layer_name = layer_name;
    this.dialogues = dialogues;
    this.events = events;
  }

  toJSON(): ILayer {
    return {
      layer_name: this.layer_name,
      dialogues: this.dialogues?.map((dialogue) => dialogue.toJSON()),
      events: this.events?.map((event) => event.toJSON()),
    };
  }

  static fromJSON(json: ILayer): Layer {
    return new Layer(json.layer_name, json.dialogues?.map(Dialogue.fromJSON), json.events?.map(Event.fromJSON));
  }
}

export class Dialogue implements IDialogue {
  character: string;
  action: string;
  line: string;

  constructor(character: string, action: string, line: string) {
    this.character = character;
    this.action = action;
    this.line = line;
  }

  toJSON(): IDialogue {
    return {
      character: this.character,
      action: this.action,
      line: this.line,
    };
  }

  static fromJSON(json: IDialogue): Dialogue {
    return new Dialogue(json.character, json.action, json.line);
  }
}

export class Event implements IEvent {
  description: string;

  constructor(description: string) {
    this.description = description;
  }

  toJSON(): IEvent {
    return {
      description: this.description,
    };
  }

  static fromJSON(json: IEvent): Event {
    return new Event(json.description);
  }
}
