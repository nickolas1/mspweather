require('!!style-loader!css-loader!./js/style.min.css');

// Import modules without parsing with script-loader,
// !! to override all loaders
require('!!script-loader!core-js/client/shim.min.js');
require('!!script-loader!zone.js/dist/zone.js');
require('!!script-loader!reflect-metadata/Reflect.js');
require('!!script-loader!rxjs/bundles/Rx.js');
require('!!script-loader!@angular/core/bundles/core.umd.js');
require('!!script-loader!@angular/common/bundles/common.umd.js');
require('!!script-loader!@angular/compiler/bundles/compiler.umd.js');
require('!!script-loader!@angular/platform-browser/bundles/platform-browser.umd.js');
require('!!script-loader!@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js');

require('!!script-loader!moment/min/moment.min.js');
require('!!script-loader!moment-timezone/builds/moment-timezone-with-data.min.js');
require('!!script-loader!web-animations-js/web-animations.min.js');

// Import boot, resolve imports/requires, and pass through Babel
require('./js/main');
