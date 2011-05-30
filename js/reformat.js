function get(id) {
  return document.getElementById(id);
};

function reformat(button) {
  var breaks = get("breaks").value;
  var ignores = get("ignores").value;
  var preserve = get("preserve").checked;
  var minChars = get("min-chars").value;
  var removeStartSpaces = get("remove-start-spaces").checked;
  var removeSymbolsSpaces = get("remove-symbols-spaces").checked;
  var noSpaceSymbols = get("no-space-symbols").value;
  var removeEmptyLines = get("remove-empty-lines").checked;
  var maxEmptyLines = get("max-empty-lines").value;
  var replaceSymbols = get("replace-symbols").checked;
  var symbolsToReplace = get("symbols-to-replace").value;
  
  function isBroken(line) {
    for (var i = line.length - 1; i >= 0; --i) {
      var c = line[i];
      if (ignores.indexOf(c) == -1) {
        return breaks.indexOf(c) == -1;
      }
    }
    return false;
  }
  
  function escapeRegex(str) {
    return str.replace(/(\/|\.|\*|\+|\?|\(|\)|\[|\]|\{|\}|\\)/g, "$1");
  }
  
  function tooShort(line) {
    return preserve && line.length <= minChars;
  }

  var files = get("input").files;
  if (!files || !window.FileReader) {
    alert("This web browser does not support File API. Sorry.");
    return;
  }
  if (files.length == 0) {
    alert("Please select the input file.");
    return;
  }
  
  var reader = new FileReader(),
      w = window.open(),
      doc = w.document,
      file = files[0],
      waiter = get("waiter");

  reader.onload = function() {
    var input = reader.result;
    var lines = input.split(/\n/);
    var output = "";
    var symbolsSpacesRegex = new RegExp('\\s+([' + escapeRegex(noSpaceSymbols) + '])', 'g');
    var emptyLinesCounter = 0;
    
    for (var i in lines) {
      var line = lines[i].replace(/\s+$/, "");
      
      if (removeStartSpaces) {
        line = line.replace(/^\s+/, "");
      }
      
      if (removeEmptyLines) {
        if (line == "") {
          if (emptyLinesCounter < maxEmptyLines) { emptyLinesCounter++; }
          continue;
        } else {
          for (var j = 0; j < emptyLinesCounter; ++j) { output += "\n"; }
          emptyLinesCounter = 0;
        }
      }
      
      if (removeSymbolsSpaces) {
        line = line.replace(symbolsSpacesRegex, "$1");
      }
      
      if (!tooShort(line) && isBroken(line)) {
        output += line.replace(/\s+$/, "") + " ";
      } else {
        output += line.replace(/\s+$/, "") + "\n";
      }
    }
    
    if (replaceSymbols) {
      var replaceSymbolsArray = symbolsToReplace.split(", ");
      for (var i in replaceSymbolsArray) {
        var pair = replaceSymbolsArray[i].split("=>");
        output = output.replace(new RegExp("[" + escapeRegex(pair[0]) + "]", "g"),
                                pair[1]);
      }
    }
    
    doc.documentElement.innerHTML = "<pre>" + output + "</pre>";
    doc.title = file.name;
    waiter.style.display = "none";
    button.style.display = "";
  };
  
  button.style.display = "none";
  waiter.style.display = "";
  reader.readAsText(file);
}
