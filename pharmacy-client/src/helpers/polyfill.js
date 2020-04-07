FileReader.prototype.getAsOriginalMyString = function () {
  if (this.result instanceof ArrayBuffer && this.readyState == 2) {
    var binary = [],
      bytes = new Uint8Array(this.result),
      length = bytes.byteLength,
      i = 0;

    for (; i < length; i++) {
      binary.push(String.fromCharCode(bytes[i]));
    }

    return binary.join("");
  } else {
    throw new Error(
      "Invalid ReadState: ".concat(this.readyState, " or InstanceOfBuffer.")
    );
  }
};

FileReader.prototype.readAsOriginalMy = function (_file) {
  this.currFile = _file;
  this.readAsArrayBuffer(_file);
};
