import path from "path";

module.exports = {
  // Export options
  directory: "./tmp", // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
  paginationOffset: 1,
  // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
  // 'height': '10.5in',        // allowed units: mm, cm, in, px
  // 'width': '8in',            // allowed units: mm, cm, in, px
  format: "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  orientation: "portrait", // portrait or landscape

  // Page options
  // 'border': '0',             // default is 0, units: mm, cm, in, px
  border: {
    top: "0", // default is 0, units: mm, cm, in, px
    right: "0",
    bottom: "0",
    left: "0",
  },
  header: {
    height: "0",
  },

  // Zooming option, can be used to scale images if `options.type` is not pdf
  zoomFactor: "1", // default is 1

  // File options
  type: "pdf", // allowed file types: png, jpeg, pdf
  quality: "65", // only used for types png & jpeg

  // Script options
  timeout: 30000, // Timeout that will cancel phantomjs, in milliseconds

  // Time we should wait after window load
  // accepted values are 'manual', some delay in milliseconds or undefined to wait for a render event
  renderDelay: 1000,

  // To run Node application as Windows service
  childProcessOptions: {
    detached: true,
  },
};
