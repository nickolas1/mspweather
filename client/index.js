require('bootstrap/dist/css/bootstrap.min.css');
require('./js/style.min.css');

// Import modules without parsing with script-loader,
// !! to override all loaders
require('!!script!core-js/client/shim.min.js');
require('!!script!zone.js/dist/zone.js');
require('!!script!reflect-metadata/Reflect.js');
require('!!script!rxjs/bundles/Rx.js');
require('!!script!@angular/core/bundles/core.umd.js');
require('!!script!@angular/common/bundles/common.umd.js');
require('!!script!@angular/compiler/bundles/compiler.umd.js');
require('!!script!@angular/platform-browser/bundles/platform-browser.umd.js');
require('!!script!@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js');

require('!!script!moment/min/moment.min.js');
require('!!script!moment-timezone/builds/moment-timezone-with-data.min.js');
require('!!script!web-animations-js/web-animations.min.js');

// Import boot, resolve imports/requires, and pass through Babel
require('./js/main');
