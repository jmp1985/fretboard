/**
 * A class to represent the fretboard diagram
 *
 * Draw a diagram line this
 *  1 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *  2 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *  3 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *  4 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *  5 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *  6 ---||---|---|---|---|---|---|---|---|---|---|---|---|
 *          1   2   3   4   5   6   7   8   9   10  11  12
 */
class FretboardDiagram {
  
  /**
   * Initialise the diagram
   * @param context The canvas context
   * @oaram tuning The guitar tuning (high to low)
   */
  constructor(context, tuning, firstFret=0, lastFret=12) {

    // Save the context
    this.context = context;

    // Create the fretboard
    this.fretboard = new Fretboard(tuning, lastFret);

    // Set the fretboard parameters
    this.firstFret = firstFret;
    this.lastFret = lastFret;
    this.numFrets = lastFret - firstFret;
    this.numStrings = this.fretboard.numStrings;

    // Set the drawing area parameters
    this.border = 0;
    this.xOffset = this.border;
    this.yOffset = this.border;
    this.width = this.context.canvas.width - 2 * this.xOffset;
    this.height = this.context.canvas.height - 2 * this.yOffset;

    // The grid specification
    this.gridNumX = this.numFrets + 2;
    this.gridNumY = this.numStrings + 1;
    this.gridXStart = this.xOffset;
    this.gridYStart = this.yOffset;
    this.gridXSpacing = this.width / this.gridNumX;
    this.gridYSpacing = this.height / this.gridNumY;
    this.gridXStop = this.gridXStart + this.gridNumX * this.gridXSpacing;
    this.gridYStop = this.gridYStart + this.gridNumY * this.gridYSpacing;

    // Where to draw the fretboard lines
    this.fretboardXStart = this.firstFret == 0 ? 2 : 1;
    this.fretboardYStart = 1;
    this.fretboardXStop = this.numFrets + 2;
    this.fretboardYStop = this.numStrings;

    // Where to draw the nut, fret and string numbers
    this.nutX = 2;
    this.fretNumberY = this.gridNumY;
    this.stringNumberX = 0;

    // The font size and note radius
    this.noteRadius = Math.min(this.gridXSpacing, this.gridYSpacing) / 3; 
    this.textSize = this.noteRadius;
  }

  /**
   * Convert from fret to grid x coordinate
   * @param x The fret number
   * @returns The grid x coordinate
   */
  fretToGridX(x) {
    return x - this.firstFret + 1;
  }
  
  /**
   * Convert from string to grid y coordinate
   * @param y The string number
   * @returns The grid y coordinate
   */
  stringToGridY(y) {
    return y + this.fretboardYStart;
  }

  /**
   * Convert from grid to canvas x coordinate
   * @param x The grid x coordinate
   * @returns The canvas x coordinate
   */
  gridToCanvasX(x) {
    return this.gridXStart + x * this.gridXSpacing;
  }
  
  /**
   * Convert from grid to canvas y coordinate
   * @param x The grid y coordinate
   * @returns The canvas y coordinate
   */
  gridToCanvasY(y) {
    return this.gridYStart + y * this.gridYSpacing;
  }

  /**
   * Draw the fretboard grid
   */
  drawGrid() {
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    this.context.beginPath();
    for (var j = this.fretboardYStart; j < this.fretboardYStop+1; ++j) {
      var y = this.gridToCanvasY(j);
      this.context.moveTo(this.gridToCanvasX(this.fretboardXStart), y);
      this.context.lineTo(this.gridToCanvasX(this.fretboardXStop), y);
    }
    for (var i = this.fretboardXStart; i < this.fretboardXStop+1; ++i) {
      var x = this.gridToCanvasX(i);
      this.context.moveTo(x, this.gridToCanvasY(this.fretboardYStart));
      this.context.lineTo(x, this.gridToCanvasY(this.fretboardYStop));
    }
    this.context.stroke();
  }

  /**
   * Draw the nut
   */
  drawNut() {
    if (this.firstFret == 0) {
      this.context.lineWidth = 10;
      this.context.strokeStyle = "black";
      this.context.beginPath();
      var x = this.gridToCanvasX(this.nutX);
      this.context.moveTo(x, this.gridToCanvasY(this.fretboardYStart));
      this.context.lineTo(x, this.gridToCanvasY(this.fretboardYStop));
      this.context.stroke();
    }
  }

  /**
   * Draw the fret numbers
   */
  drawFretNumbers() {
    this.context.font = `${this.textSize}px Helvetica`;
    this.context.textAlign = "center";
    this.context.fillStyle = "black";
    var y = this.gridToCanvasY(this.fretNumberY);
    for (var i = this.firstFret; i < this.lastFret+1; ++i) {
      this.context.fillText(i, this.gridToCanvasX(this.fretToGridX(i+0.5)), y);
    }
  }

  /**
   * Draw the string numbers
   */
  drawStringNumbers() {
    this.context.font = `${this.textSize}px Helvetica`;
    this.context.textBaseline = "middle";
    this.context.textAlign = "centre";
    this.context.fillStyle = "black";
    var x = this.gridToCanvasX(this.stringNumberX+0.5);
    for (var j = 0; j < this.numStrings; ++j) {
      this.context.fillText(j+1, x, this.gridToCanvasY(1+j));
    }
  }

  /**
   * Draw the fretboard
   */
  drawFretboard() {
    this.drawGrid();
    this.drawNut();
    this.drawFretNumbers();
    this.drawStringNumbers();
  }

  /**
   * Draw the notes
   * @param scale
   */
  drawScale(scale, label='none') {
    var notes = scale.notes;
    for (var k = 0; k < notes.length; ++k) {
      for (var j = 0; j < this.numStrings; ++j) {
        for (var i = this.firstFret; i < this.lastFret+1; ++i) {
          var note = notes[k];
          if (note.index == this.fretboard.note(j,i).index) {
 
            // Draw a circle for the note
            this.context.beginPath();
            if (note.index == scale.tonic.index) {
              this.context.fillStyle="red";
            } else {
              this.context.fillStyle="black";
            }
            var x = this.gridToCanvasX(this.fretToGridX(i+0.5));
            var y = this.gridToCanvasY(this.stringToGridY(j));
            this.context.arc(x, y, this.noteRadius, 0, 2 * Math.PI);
            this.context.fill();
           
            // Draw some note labels
            if (label != 'none') {
              this.context.font = `${this.textSize}px Helvetica`;
              this.context.textBaseline = "middle";
              this.context.textAlign = "centre";
              this.context.fillStyle = "white";
              
              if (label == 'degree') {
                var text = k+1;
              } else if (label == 'intervals') {
                var  text = scale.formula[k];
              } else if (label == 'notes') {
                var text = note.name;
              }
              this.context.fillText(text, x, y);
            }
          }
        }
      }
    }
  }

}
