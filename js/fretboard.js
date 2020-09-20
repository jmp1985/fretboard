/**
 * A class to represent the notes on the fretboard
 */
class Fretboard {

  /**
   * Construct the fretboard
   * @param tuning
   */
  constructor(tuning, numFrets=12) {
    
    // Save the tuning
    this.tuning = tuning

    // Save the number of strings
    this.numStrings = tuning.length
    this.numFrets = numFrets;
    
  }

  /**
   * @param string The string number (high to low)
   * @returns The open note index of the string
   */
  openNoteIndex(string) {
    return Note.getNoteByPitchId(this.tuning[string]).index;
  }

  /**
   * @param string The string number (high to low)
   * @returns The open note name of the string
   */
  openNote(string) {
    return this.tuning[string];
  }

  /**
   * @param string The string number (high to low)
   * @param fret The fret number (0 for open)
   * @returns The note index of the string and fret
   */
  noteIndex(string, fret) {
    return (this.openNoteIndex(string) + fret) % Note.numPitches;
  }

  /**
   * @param string The string number (high to low)
   * @param fret The fret number (0 for open)
   * @returns The note name of the string and fret
   */
  note(string, fret) {
    return Note.getNoteByPitchIndex(this.noteIndex(string, fret));
  }

  /**
   * @param string The string number (high to low)
   * @param pitchIndex The pitch index
   * @returns The fret number
   */
  fret(string, pitchIndex) {
    return (Pitch.getDiffByIndex(pitchIndex, this.openNoteIndex(string))+Pitch.numPitches) % Pitch.numPitches;
  }

}
