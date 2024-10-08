### 🖐🏽 Iskay Kimsa Tawa

An interactive spatial story about numbers in Quechua.

Each scene is described in layers, each layer is explorable and can be another dimension of the story.

Goals are:

- Details from atoms to galaxies.
- Infinite points of view.
- No dialogs but sounds.
- Spatial interactions.
- Scenarios based on location and time.

```yaml
title: "Iskay Kimsa Tawa"
characters:
  - name: Sumaq
    description: Human, a young explorer
  - name: Rumi
    description: Human, Sumaq’s friend

scenes:
  - scene_number: 1
    # Based on location we can generate a map, sounds, scenery, etc.
    location: "A mountain trail in the Peruvian Andes"
    # Based on time we can generate the weather, light, etc.
    time: "13:00:00 12/02/1480"
    # A brief description of the scene, used to draft layers or as meta data.
    description: "Sumaq and Rumi are walking along a rugged mountain trail. The sun is shining, and the path ahead is narrow and filled with stones."
    # Each point of view represents a different dimension of the scene, it can be
    # the public point of view, a character's point of view, etc.
    pov: "public"
    # Each layer is a dimension of the scene as exposed to a point of view.
    layers:
      - name: "Rumi"
        # Distance from the pov and to calculate layer merging.
        distance: 10m
        description: "Rumi is looking around, appearing uncertain about their path."
        sound: "/ɑː juː ʃʊə ðɪs ɪz ðə raɪt weɪ, suːmæk?/"
      - name: "Sumaq"
        distance: 10m
        description: "Sumaq is smiling, exuding confidence in their journey."
        sound: "/ðə ɛldəz seɪ ðeə ɑː saɪnz ɪn ðə nʌmbəz, ruːmiː. wiː dʒʌst hæv tuː lʊk keəfʊli./"
      - name: "The bird"
        distance: 200m
        # Altitude from the pov and to calculate layer merging.
        altitude: 100m
        description: "A bird flying, casting a shadow briefly."
      - name: "The river"
        distance: 1km
        description: "A river runs along the edge of a mountain trail, its sound barely audible."
      - name: "Environmental Cues"
        description: "The wind picks up, rustling the leaves of nearby trees."
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
        description: "An active inca city."
```

### Tech Stack

- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: 
  - API: Go, Chi
  - AI: Python, Flask
- Build: A basic monorepo.
- Package manager: PNPM (to easy have isolated node_modules hence easy dockerization)
