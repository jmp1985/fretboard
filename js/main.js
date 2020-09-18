/**
 * Generate the input form from the scale tables
 */
function loadInputForm() {

  function addOption(select, value, data) {
    var option = document.createElement("option");
    option.setAttribute("value", value);
    option.innerHTML = data;
    select.appendChild(option);
    return option;
  }

  function addScaleOptGroup(select, label, modes) {
    var group = document.createElement("optgroup");
    group.setAttribute("label", label);
    for (var i = 0; i < modes.length; ++i) {
      addOption(group, modes[i]["id"], modes[i]["name"]);
    }
    select.appendChild(group);
    return group;
  }
  
  function addScaleSelect() {
    var select = document.getElementById("select-scale");
    for (var i = 0; i < scaleTable.length; ++i) {
      addScaleOptGroup(select, scaleTable[i]["name"], scaleTable[i]["modes"]);
    }
    return select;
  }

  function addKeySelect() {
    var select = document.getElementById("select-tonic");
    for (var i = 0; i < Pitch.numPitches; ++i) {
      var pitch = Pitch.getPitchByIndex(i);
      var option = addOption(select, pitch.id, pitch.name)
      if (pitch.id == "c") {
        option.setAttribute("selected", "selected");
      }
    }
    return select;
  }

  // Create the form and add to the tree
  addScaleSelect();
  addKeySelect();
}

/**
 * Draw the fretboard diagram
 */
function drawFretboardDiagram(canvas, scale, tonic, firstFret=0, lastFret=12, label='none') {

  // Get the document elements
  var context = canvas.getContext("2d");
  var tuning = ["e", "a", "d", "g", "b", "e"].reverse();

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
    
  // Get the notes in the scale and tonic
  var scale = Scale.getScaleById(scale, tonic);

  // Draw the fretboard
  var fretboard = new FretboardDiagram(context, tuning, firstFret, lastFret);
  fretboard.drawFretboard();
  fretboard.drawScale(scale, label);

}


/**
 * Draw the scale diagram
 */
function drawScaleDiagrams() {

  // Get the document elements
  var scale = document.getElementById("scale-select").value;
  var tonic = document.getElementById("tonic-select").value;
  var tuning = ["e", "a", "d", "g", "b", "e"].reverse();

  // Get the scale patterns
  var scalePatternList = ScalePattern.fromKnownScale(Scale.getScaleById(scale), tuning);
  
  // Create the document fragment to contain the canvas
  var tree = document.createDocumentFragment();

  // Loop through the scale patterns and display
  for (var i = 0; i < scalePatternList.length; ++i) {

    // Create the canvas for the diagram
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", `scale-pattern-${i}`);
    canvas.setAttribute("width", 1200);
    canvas.setAttribute("height", 512);
    canvas.setAttribute("style", "border:1px solid black");
    tree.appendChild(canvas);
  }

  // Add all the scale diagrams to the document
  document.getElementById("scale-patterns").appendChild(tree);

  // Loop through the scale patterns and display
  for (var i = 0; i < scalePatternList.length; ++i) {

    // Create the canvas for the diagram
    var canvas = document.getElementById(`scale-pattern-${i}`);

    // Get the context and clear
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the fretboard
    var fretboard = new FretboardDiagram(context, tuning);
    fretboard.drawFretboard();
    //fretboard.drawScalePattern(scalePatternList[i]);
  }

}


/**
 * Generate a table with scale information
 */
function loadScaleInformationTable() {
  
  function addHeader(tr, a) {
    var th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.setAttribute("align", "left");
    th.innerHTML = a;
    tr.appendChild(th);
  }

  function addData(tr, a) {
    var td = document.createElement("td");
    td.innerHTML = a;
    tr.appendChild(td);
  }

  function addRow(table, a, b) {
    var tr = document.createElement("tr");
    addHeader(tr, a);
    addData(tr, b);
    table.appendChild(tr);
  }
 
  // Get the input from the form
  var scale = document.getElementById("select-scale").value;
  var tonic = document.getElementById("select-tonic").value;

  // Get the notes in the scale and tonic
  var scale = Scale.getScaleById(scale, tonic);

  // Add the rows in the table
  var table = document.getElementById("scale-information-table");
  table.innerHTML = "";
  addRow(table, "Name", scale.name);
  addRow(table, "Family", scale.family);
  addRow(table, "Type", scale.type);
  addRow(table, "Number", scale.number);
  addRow(table, "Semitones", scale.semitones.join(" "));
  addRow(table, "Steps", scale.steps.join(" "));
  addRow(table, "Intervals", scale.intervals.join(" "));
  addRow(table, "Formula", scale.formula.join(" "));
  addRow(table, "Notes", scale.notesHumanReadable);
}


/**
 * Generate the fretboard diagram
 */
function loadFretboardDiagram() {
  
  // Get the input from the form
  var scale = document.getElementById("select-scale").value;
  var tonic = document.getElementById("select-tonic").value;
  var firstFret = parseInt(document.getElementById("select-first-fret").value);
  var lastFret = parseInt(document.getElementById("select-last-fret").value);
  var noteLabels = document.getElementById("select-note-labels").value;

  // The fretboard diagram
  var content = document.getElementById("fretboard-diagram")
  var canvas = document.createElement("canvas");
  content.innerHTML = "";
  canvas.setAttribute("width", 1200);
  canvas.setAttribute("height", canvas.width / 3.0);
  drawFretboardDiagram(canvas, scale, tonic, firstFret, lastFret, noteLabels);
  content.appendChild(canvas);
}


/**
 * Generate a table with chord information
 */
function loadChordTable() {

  function addCell(tr, data) {
    var td = document.createElement("td");
    td.innerHTML = data;
    tr.appendChild(td);
  }

  function addRow(tbody, chord) {
    var tr = document.createElement("tr");
    addCell(tr, chord.root.name);
    addCell(tr, chord.name);
    addCell(tr, chord.formula.join(" "));
    addCell(tr, chord.notes.map(note => note.name).join(" "));
    tbody.appendChild(tr);
  }

  function addTableBody(table, chordList) {
    var tbody = document.createElement("tbody");
    for (var i = 0; i < chordList.length; ++i) {
      addRow(tbody, chordList[i]);
    }
    table.appendChild(tbody);
  }

  function addHead(tr, name) {
    var th = document.createElement("th");
    th.innerHTML = name;
    tr.appendChild(th);
  }

  function addTableHead(table) {
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    addHead(tr, "Root");
    addHead(tr, "Name");
    addHead(tr, "Formula");
    addHead(tr, "Notes");
    thead.appendChild(tr);
    table.appendChild(thead);
  }
  
  // Get the input from the form
  var scale = document.getElementById("select-scale").value;
  var tonic = document.getElementById("select-tonic").value;

  // Construct the scale object and get the chord list
  var scale = Scale.getScaleById(scale, tonic);
  var chordList = getChordListFromScale(scale);

  // Get the chord table
  var table = document.getElementById("chord-information-table");
  table.innerHTML = "";
  addTableHead(table);
  addTableBody(table, chordList);
}


/**
 * Load the content
 */
function loadContent() {
  loadScaleInformationTable();
  loadFretboardDiagram();
  loadChordTable();
}

/**
 * Load the header
 */
function loadHeader() {
  loadInputForm();
}

/**
 * Load everything
 */
function load() {
  loadHeader();
  loadContent();
}
