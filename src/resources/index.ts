import {FrameworkConfiguration, PLATFORM} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./elements/warning-text'),
    PLATFORM.moduleName('./value-converters/fmt-date'),
    // PLATFORM.moduleName(''),
    // PLATFORM.moduleName(''),
    // PLATFORM.moduleName(''),
    // PLATFORM.moduleName(''),
    // PLATFORM.moduleName(''),
    // PLATFORM.moduleName(''),
  ]);
}
