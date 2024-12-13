export class CodeConfig {
    static lightThemes: string[] = [
        'chrome',
        'clouds',
        'crimson_editor',
        'dawn',
        'dreamweaver',
        'eclipse',
        'github',
        'iplastic',
        'solarized_light',
        'textmate',
        'tomorrow',
        'xcode',
        'kuroir',
        'katzenmilch'
      ];
    
      // Dark Themes
      static darkThemes: string[] = [
        'ambiance',
        'chaos',
        'clouds_midnight',
        'cobalt',
        'gruvbox',
        'gob',
        'idle_fingers',
        'kr_theme',
        'merbivore',
        'merbivore_soft',
        'mono_industrial',
        'monokai',
        'pastel_on_dark',
        'solarized_dark',
        'terminal',
        'tomorrow_night',
        'tomorrow_night_blue',
        'tomorrow_night_bright',
        'tomorrow_night_eighties',
        'twilight',
        'vibrant_ink'
      ];
    
      // Function to get all themes (both light and dark)
      static getAllThemes(): string[] {
        return [...this.lightThemes, ...this.darkThemes];
      }
}
