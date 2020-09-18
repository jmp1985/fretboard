
class Chord {

  constructor(id, name, notes) {
    this.id = id;
    this.name = name;
    this.notes = notes;
  }

  get root() {
    return this.notes[0];
  }

  get pitchIndices() {
    return this.notes.map(note => note.index);
  }

  get chordIndices() {
    return this.pitchIndices.map(index => (index + Note.numPitches - this.root.index) % Note.numPitches);
  }

  get formula() {
    
    // Get the chord indices
    var majorIndices = [ 0, 2, 4, 5, 7, 9, 11 ];
    var chordIndices = this.chordIndices;
   
    // Construct the formula
    var formula = [];
    for (var j = 0; j < chordIndices.length; ++j) {
      var index = this.chordIndices[j];
      var minIndex = -1;
      var minDiffIndex = 0;
      for (var i = 0; i < majorIndices.length; ++i) {
        var majorIndex = majorIndices[i];
        var diffIndex = index - majorIndex;
        if (minIndex == -1 || (Math.abs(diffIndex) <= Math.abs(minDiffIndex))) {
          minIndex = i;
          minDiffIndex = diffIndex;
        }
      }
      if (minDiffIndex == 0) {
        formula.push(`${minIndex+1}`)
      } else if (minDiffIndex < 0) {
        formula.push(`♭${minIndex+1}`)
      } else {
        formula.push(`♯${minIndex+1}`)
      }
    }
    return formula;
  }

  static getChordByNotes(notes) {

    function getChordNameFromFormula(tonic, formula) {

      // Check root and length
      if (formula[0] != "1") {
        throw `Bad root ${formula}`;
      }
      if (formula.length < 3) {
        throw `Too few notes ${formula}`;
      }
      if (formula.length > 7) {
        throw `Too many notes ${formula}`;
      }

      // The tonic of the chord
      var tonic = tonic.name;
      var triad = "";
      var last = "";
      var modifiers = "";
    
      // Get the triad
      if (formula.length >= 3) {
        if (formula[1] == "3" && formula[2] == "5") {
          // Do nothing
        } else if (formula[1] == "♭3" && formula[2] == "5") {
          triad = "m";
        } else if (formula[1] == "♭3" && formula[2] == "♭5") {
          triad = "dim";
        } else if (formula[1] == "3" && formula[2] == "♭6") {
          triad = "aug";
        } else {
          throw `Bad triad ${formula}`;
        }
      } 
    
      // Check the 7th
      if (formula.length >= 4) {
        if (formula[3] == "7") {
          triad += " maj";
          last = "7";
        } else if (formula[3] == "♭7") {
          last = "7";
        } else if (formula[3] == "6") {
          triad += " dim";
          last = "7";
        } else {
          throw `Bad 7th ${formula}`;
        }
      } 
      
      // Check the 9th
      if (formula.length >= 5) {
        if (formula[4] == "2") {
          last = "9" 
        } else if (formula[4] == "♭2") {
          modifiers += "♭9";
        } else if (formula[4] == "♭3") {
          modifiers += "♯9";
        } else {
          throw `Bad 9th ${formula}`;
        }
      } 

      // Check the 11th
      if (formula.length >= 6) {
        if (formula[5] == "4") {
          last = "11" 
        } else if (formula[5] == "3") {
          modifiers += "add3";
        } else if (formula[5] == "♭4") {
          modifiers += "♭11";
        } else if (formula[5] == "♭5") {
          modifiers += "♯11";
        } else {
          throw `Bad 11th ${formula}`;
        }
      } 

      // Check the 13th
      if (formula.length >= 7) {
        if (formula[6] == "6") {
          last = "13" 
        } else if (formula[6] == "♭6") {
          modifiers += "♭13";
        } else if (formula[6] == "♭7") {
          modifiers += "♯13";
        } else {
          throw `Bad 13th ${formula}`;
        }
      } 

      // Construct and return the name
      return tonic + triad + last + modifiers;
    }

    // Init the new chord
    var chord = new Chord(0, 0, notes);
    var name = getChordNameFromFormula(chord.root, chord.formula);
    chord.name = name;
    return chord;
  }
}

function getChordListFromScale(scale) {
  var chordList = [];
  for (var i = 0; i < scale.length; ++i) {
    var root = scale.notes[i];
    var third = scale.notes[(i+2) % scale.length];
    var fifth = scale.notes[(i+4) % scale.length];
    var seventh = scale.notes[(i+6) % scale.length];
    var ninth = scale.notes[(i+8) % scale.length];
    var eleventh = scale.notes[(i+10) % scale.length];
    var n13 = scale.notes[(i+12) % scale.length];
    chordList.push(Chord.getChordByNotes([root, third, fifth]));
    chordList.push(Chord.getChordByNotes([root, third, fifth, seventh]));
    chordList.push(Chord.getChordByNotes([root, third, fifth, seventh, ninth]));
    chordList.push(Chord.getChordByNotes([root, third, fifth, seventh, ninth, eleventh]));
    chordList.push(Chord.getChordByNotes([root, third, fifth, seventh, ninth, eleventh, n13]));
  }
  return chordList;
}
