import * as yaml from "js-yaml";

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
    this.scenes = data.scenes.map((scene: IScene) => new Scene(
      scene.scene_number,
      scene.location,
      scene.time,
      scene.description,
      scene.layers.map((layer: ILayer) => new Layer(
        layer.layer_name,
        layer.dialogues?.map((dialogue: IDialogue) => new Dialogue(
          dialogue.character,
          dialogue.action,
          dialogue.line
        )) || [],
        layer.events?.map((event: IEvent) => new Event(event.description)) || []
      )),
      scene.end_scene
    ));
  }

  static fromYAML(yamlData: string): Script {
    try {
      const jsonData = yaml.load(yamlData) as any;
      return new Script(jsonData);
    } catch (error) {
      console.error("Error parsing YAML:", error);
      throw new Error("Failed to parse YAML data");
    }
  }

  static yamlToJSON(yamlData: string): string {
    try {
      const jsonData = yaml.load(yamlData);
      return JSON.stringify(jsonData, null, 2);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
      throw new Error("Failed to convert YAML to JSON");
    }
  }
}

export class Character implements ICharacter {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
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
}

export class Event implements IEvent {
  description: string;

  constructor(description: string) {
    this.description = description;
  }
}
