/**
 * A constant list of pitches
 */
const pitchTable = [
  {
    "id" : "a",
    "name" : "A",
    "natural" : true,
  },
  {
    "id" : "a#", 
    "name" : "A♯/B♭",
    "natural" : false,
  },
  {
    "id" : "b", 
    "name" : "B", 
    "natural" : true,
  },
  {
    "id" : "c", 
    "name" : "C", 
    "natural" : true,
  },
  {
    "id" : "c#", 
    "name" : "C♯/D♭", 
    "natural" : false,
  },
  {
    "id" : "d",
    "name" : "D",
    "natural" : true,
  },
  {
    "id" : "d#", 
    "name" : "D♯/E♭", 
    "natural" : false,
  },
  {
    "id" : "e",
    "name" : "E",
    "natural" : true,
  },
  {
    "id" : "f", 
    "name" : "F", 
    "natural" : true,
  },
  {
    "id" : "f#",
    "name" : "F♯/G♭",
    "natural" : false,
  }, 
  {
    "id" : "g", 
    "name" : "G", 
    "natural" : true,
  },
  {
    "id" : "g#",
    "name" : "G♯/A♭",
    "natural" : false,
  }
];


/**
 * A class to represent a pitch
 */
class Pitch {

  /**
   * Construct the pitch
   * @param index The pitch index
   * @param id The pitch id
   * @param name The pitch name
   * @param natural Natural or flat/sharp
   */
  constructor(index, id, name, natural) {
    this.index = index;
    this.id = id;
    this.name = name;
    this.natural = natural;
  }

  /**
   * Get the difference between pitches
   * @param a The first pitch
   * @param b The second pitch
   * @returns The difference a - b wrapped
   */
  static getDiffByIndex(a, b) {
    var d = a - b;
    var n = Pitch.numPitches;
    return d > n / 2 ? d-n : d < -6 ? -n - d : d;
  }

  /**
   * Get the pitch by id
   * @param id The pitch id
   * @returns The pitch
   */
  static getPitchById(id) {
    for (var i = 0; i < pitchTable.length; ++i) {
      if (id == pitchTable[i]["id"]) {
        return new Pitch(
          i, 
          id, 
          pitchTable[i]["name"], 
          pitchTable[i]["natural"]);
      }
    }
  }

  /**
   * Get the pitch by index
   * @param index The pitch index
   * @returns The pitch
   */
  static getPitchByIndex(index) {
    index = (index+Pitch.numPitches) % Pitch.numPitches;
    return new Pitch(
      index, 
      pitchTable[index]["id"], 
      pitchTable[index]["name"],
      pitchTable[index]["natural"]);
  }
}


// The number of pitches
Pitch.numPitches = pitchTable.length;


/**
 * A class to represent a note
 */
class Note {
  
  /**
   * Construct the note
   * @param base The base pitch
   * @param shift The number of semitones to shift
   */
  constructor(base, shift=0) {
    this.base = base;
    this.shift = shift;
  }

  /**
   * @returns Get the pitch of the note
   */
  get pitch() {
    return Pitch.getPitchByIndex(this.index);
  }

  /**
   * @returns Get the pitch index of the note
   */
  get index() {
    return (this.base.index + this.shift + Pitch.numPitches) % Pitch.numPitches;
  }

  /**
   * @returns Get the name of the note
   */
  get name() {
    return this.natural + this.accidental;
  }

  /**
   * @returns Get the name of the natural note
   */
  get natural() {
    return this.base.name;
  }

  /**
   * @returns Get the accidental component of the name
   */
  get accidental() {
    return Note.getAccidentalByShift(this.shift);
  }

  /**
   * Get the accidental symbol from a shift
   * @param shift The number of semitones
   * @returns Get the accidental component
   */
  static getAccidentalByShift(shift) {
    return {
      '-2' : "𝄫",
      '-1' : "♭",
      '0' : "",
      '1' : "♯",
      '2' : "𝄪"
    }[shift];
  }

  /**
   * Get a note from the pitch
   * @param pitch The pitch
   * @param shift The number of semitones
   * @returns Get the note object
   */
  static getNoteByPitch(pitch, shift=0) {

    // Get the id and shift
    var [ id, shift ] = {
      'a' : ['a', shift],
      'a#' : ['a', shift+1],
      'b' : ['b', shift],
      'c' : ['c', shift],
      'c#' : ['c', shift+1],
      'd' : ['d', shift],
      'd#' : ['d', shift+1],
      'e' : ['e', shift],
      'f' : ['f', shift],
      'f#' : ['f', shift+1],
      'g' : ['g', shift],
      'g#' : ['g', shift+1],
    }[pitch.id];

    // Check the size of the shift
    if (Math.abs(shift) > 2) {
      throw `Shift ${shift} is too large`;
    }

    // Return the new note
    return new Note(Pitch.getPitchById(id), shift);
  }

  /**
   * Get a note from the pitch id
   * @param id The pitch id
   * @param shift The number of semitones
   * @returns Get the note object
   */
  static getNoteByPitchId(id, shift=0) {
    return Note.getNoteByPitch(Pitch.getPitchById(id), shift);
  }

  /**
   * Get a note from the pitch index
   * @param index The pitch index
   * @param shift The number of semitones
   * @returns Get the note object
   */
  static getNoteByPitchIndex(index, shift=0) {
    return Note.getNoteByPitch(Pitch.getPitchByIndex(index), shift);
  }

};


Note.maxIndex = Pitch.numPitches;


/**
 * Store a dictionary of scales
 */
const scaleTable = [
  {
    "id" : "major",
    "name" : "Diatonic family",
    "steps" : [ 2, 2, 1, 2, 2, 2, 1 ],
    "modes" : [
      {
        "id" : "ionian",
        "name" : "Ionian (Major)",
      },
      {
        "id" : "dorian",
        "name" : "Dorian",
      },
      {
        "id" : "phrygian",
        "name" : "Phrygian",
      },
      {
        "id" : "lydian",
        "name" : "Lydian",
      },
      {
        "id" : "mixolydian",
        "name" : "Mixolydian",
      },
      {
        "id" : "aeolian",
        "name" : "Aeolian (Minor)",
      },
      {
        "id" : "locrian",
        "name" : "Locrian",
      },
    ],
  }, 
  {
    "id" : "harmonic_minor",
    "name" : "Harmonic Minor family",
    "steps" : [ 2, 1, 2, 2, 1, 3, 1 ],
    "modes" : [
      {
        "id" : "harmonic_minor",
        "name" : "Harmonic Minor",
      },
      {
        "id" : "locrian_6",
        "name" : "Locrian ♮6",
      },
      {
        "id" : "ionian_#5",
        "name" : "Ionian ♯5",
      },
      {
        "id" : "dorian_#4",
        "name" : "Dorian ♯4 (Ukrainian Dorian)",
      },
      {
        "id" : "phrygian_3",
        "name" : "Phrygian ♮3 (Phrygian Dominant)",
      },
      {
        "id" : "lydian_#2",
        "name" : "Lydian ♯2 (Hungarian Major)",
      },
      {
        "id" : "super_locrian_bb7",
        "name" : "Super Locrian 𝄫7",
      },
    ],
  },
  {
    "id" : "melodic_minor",
    "name" : "Melodic Minor family",
    "steps" : [ 2, 1, 2, 2, 2, 2, 1 ],
    "modes" : [
      {
        "id" : "melodic_minor",
        "name" : "Melodic Minor",
      },
      {
        "id" : "phrygian_#6",
        "name" : "Phrygian ♯6 (Assyrian)",
      },
      {
        "id" : "lydian_#5",
        "name" : "Lydian ♯5",
      },
      {
        "id" : "mixolydian_#4",
        "name" : "Mixolydian ♯4 (Overtone)",
      },
      {
        "id" : "mixoylydian_b6",
        "name" : "Mixolydian ♭6 (Melodic Major)",
      },
      {
        "id" : "locrian_2",
        "name" : "Locrian ♮2 (Half-Diminished)",
      },
      {
        "id" : "super_locrian",
        "name" : "Super Locrian (Altered Dominant)",
      },
    ],
  },
  {
    "id" : "double_harmonic",
    "name" : "Double Harmonic family",
    "steps" : [ 1, 3, 1, 2, 1, 3, 1 ],
    "modes" : [
      {
        "id" : "double_harmonic_major",
        "name" : "Double Harmonic (Gypsy) Major",
      },
      {
        "id" : "lydian_#2_#6",
        "name" : "Lydian ♯2 ♯6",
      },
      {
        "id" : "ultraphrygian",
        "name" : "Ultraphrygian",
      },
      {
        "id" : "hungarian_minor",
        "name" : "Hungarian (Gypsy) Minor",
      },
      {
        "id" : "oriental",
        "name" : "Oriental",
      },
      {
        "id" : "ionian_#2_#5",
        "name" : "Ionian ♯2 ♯5",
      },
      {
        "id" : "locrain_bb3_bb7",
        "name" : "Locrian 𝄫3 𝄫7",
      },
    ],
  },
  {
    "id" : "major_pentatonic",
    "name" : "Major Pentatonic family",
    "steps" : [ 2, 2, 3, 2, 3 ],
    "modes" : [
      {
        "id" : "major_pentatonic",
        "name" : "Major Pentatonic (Ionian)",
      },
      {
        "id" : "egyptian_suspended",
        "name" : "Egyptian Suspended (Dorian)",
      },
      {
        "id" : "blues_minor",
        "name" : "Blues Minor (Phrygian)",
      },
      {
        "id" : "blues_major",
        "name" : "Blues Major (Mixolydian)",
      },
      {
        "id" : "minor_pentatonic",
        "name" : "Minor Pentatonic (Aeolian)",
      },
    ],
  },
  {
    "id" : "hexatonic_blues_scale",
    "name" : "Hexatonic Blues Family",
    "steps" : [ 3, 2, 1, 1, 3, 2 ],
    "modes" : [
      {
        "id" : "minor_hexatonic_blues",
        "name" : "Minor Hexatonic Blues",
      },
      {
        "id" : "major_hexatonic_blues",
        "name" : "Major Hexatonic Blues",
      },
    ]
  },
  {
    "id" : "diminished",
    "name" : "Diminished (Whole-Half) family",
    "steps" : [ 2, 1, 2, 1, 2, 1, 2, 1 ],
    "modes" : [
      {
        "id" : "diminished_mode_1",
        "name" : "Diminished (Whole-Half) mode 1",
      },
      {
        "id" : "diminished_mode_2",
        "name" : "Diminished (Whole-Half) mode 2",
      },
    ]
  },
  {
    "id" : "whole_tone",
    "name" : "Whole Tone family",
    "steps" : [ 2, 2, 2, 2, 2, 2 ],
    "modes" : [
      {
        "id" : "whole_tone",
        "name" : "Whole Tone",
      },
    ]
  },
];


/**
 * A class to represent a scale
 */
class Scale {
  
  /**
   * Initialise the scale
   * @param id The scale id
   * @param name The name of the scale
   * @param family The scale family
   * @param steps The steps defining the scale
   * @param tonic  The name of the tonic
   */
  constructor(id, name, family, steps, tonic="c") {

    // Check that the steps add up
    if (steps.reduce((a,b) => a + b, 0) != 12) {
      throw 'Intervals do not sum to 12';
    }

    // Save the name and steps
    this.id = id;
    this.name = name;
    this.family = family;
    this.steps = steps;
    this.tonic = Note.getNoteByPitchId(tonic);
    this.length = steps.length;

  }

  /**
   * Get the type of scale
   */
  get type() {
    return {
      12 : "Chromatic",
      8 : "Octatonic",
      7 : "Heptatonic",
      6 : "Hexatonic",
      5 : "Pentatonic",
    }[this.length];
  }

  /**
   * @returns The number identifying the scale
   */
  get number() {
    var n = (this.semitones.map(index => (1 << index)).reduce((a,b) => a | b, 0) >>> 0).toString(2);
    return "000000000000".substr(n.length) + n;
  }

  /**
   * @returns The number of semitones from the tonic
   */
  get semitones() {
    let sum = 0;
    return [0].concat(this.steps.map(s => sum += s).slice(0, -1));
  }

  /**
   * @returns The note indices of the scale
   */
  get pitchIndices() {
    return this.semitones.map(index => (index + this.tonic.index) % Note.maxIndex);
  }

  /**
   * @returns The scale intervals
   */
  get intervals() {
    const lookup = {
      0 : 'P1',
      1 : 'm2',
      2 : 'M2',
      3 : 'm3',
      4 : 'M3',
      5 : 'P4',
      6 : 'd5',
      7 : 'P5',
      8 : 'm6',
      9 : 'M6',
      10 : 'm7',
      11 : 'M7',
    };
    return this.semitones.map(semitone => lookup[semitone]);
  }

  /**
   * @returns The formula of the scale
   */
  get formulaNumeric() {
  
    function intervalShifts(semitones) {
      const majorIndices = [ 0, 2, 4, 5, 7, 9, 11 ];
      return semitones.map((index, i) => (index - majorIndices[i]));
    }
    
    function getFormulaNonHeptatonic(semitones) {
      const lookup = {
        0 : [1, 0],
        1 : [2, -1],
        2 : [2, 0],
        3 : [3, -1],
        4 : [3, 0],
        5 : [4, 0],
        6 : [5, -1],
        7 : [5, 0],
        8 : [6, -1],
        9 : [6, 0],
        10 : [7, -1],
        11 : [7, 0],
      };
      return semitones.map(semitone => lookup[semitone]);
    }
    
    function getFormulaHeptatonic(semitones) {
      return intervalShifts(semitones).map((shift, index) => [index+1, shift]);
    }

    // If non-heptatonic just use intervals otherwise use A-G
    return (this.intervals.length == 7
      ? getFormulaHeptatonic(this.semitones)
      : getFormulaNonHeptatonic(this.semitones));
  }

  /**
   * Get a string formula
   */
  get formula() {
    return this.formulaNumeric.map(item => Note.getAccidentalByShift(item[1]) + item[0]);
  }
  
  /**
   * @returns The note names of the scale
   */
  get notes() {

    // A lookup of natural notes
    var lookup = [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ];

    // Get the notes by the following algorithm
    // - Get the number of roots to try
    // - For each root compute the notes by converting the formula to notes
    // - Select the notes from the root with the fewest shifts
    function getNotes(formulaNumeric, pitchIndices) {

      // Get the roots to check
      var root = Pitch.getPitchByIndex(pitchIndices[0]);
      if (root.natural) {
        var rootsToTest = [root];
      } else {
        var rootsToTest = [
          Pitch.getPitchByIndex((pitchIndices[0]+Pitch.numPitches-1) % Pitch.numPitches),
          Pitch.getPitchByIndex((pitchIndices[0]+Pitch.numPitches+1) % Pitch.numPitches),
        ];
      }

      // Try the two roots
      var notesToTest = [];
      var cost = [];
      for (var j = 0; j < rootsToTest.length; ++j) {
        var notes = [];
        var count = 0;
        var tonicNoteIndex = lookup.indexOf(rootsToTest[j].id);
        for (var i = 0; i < formulaNumeric.length; ++i) {
          var item = formulaNumeric[i];
          var noteIndex = (tonicNoteIndex + item[0]-1) % 7;
          var noteId = lookup[noteIndex];
          var pitchIndex = Pitch.getPitchById(noteId).index;
          var shift = Pitch.getDiffByIndex(pitchIndices[i], pitchIndex);
          notes.push(Note.getNoteByPitchId(noteId, shift)); 
          count += shift*shift;
        }
        notesToTest.push(notes);
        cost.push(count);
      }
      console.log(cost);

      // Select the notes from the root with the fewest shifts
      return notesToTest[cost.indexOf(Math.min(...cost))];
    }

    // Get the notes in the scale
    return getNotes(this.formulaNumeric, this.pitchIndices);
  }

  /**
   * @returns The note names in human readable form
   */
  get notesHumanReadable() {
    return this.notes.map(note => note.name).join(" ");
  }

  /**
   * Initialise the scale
   * @param id The name of the scale
   * @param tonic  The name of the tonic
   */
  static getScaleById(id, tonic="c") {
    for (var j = 0; j < scaleTable.length; ++j) {
      var family = scaleTable[j];
      for (var i = 0; i < family["modes"].length; ++i) {
        var mode = family["modes"][i];
        if (mode["id"] == id) {
          return new Scale(
            id, 
            mode["name"], 
            family["name"], 
            rotate_left(family["steps"], i),
            tonic);
        }
      }
    }
  }

}  


