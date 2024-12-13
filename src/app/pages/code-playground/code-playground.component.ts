import { Component } from '@angular/core';
import * as ace from 'ace-builds'; // Importing ace-builds
import { CodeConfig } from './code-config';
import { log } from 'console';
import { CompilerRequest } from 'src/app/entity/compiler-request';
import { CodePlayGroundService } from 'src/app/service/code-play-ground.service';

@Component({
  selector: 'app-code-playground',
  templateUrl: './code-playground.component.html',
  styleUrls: ['./code-playground.component.scss'],
})
export class CodePlaygroundComponent {
  editor: any;
  themes: string[] = [];

  selectedLang = 'java';
  javaFileName = 'Main.java';
  validFileName = true;
  compileResponse = 'Hello, World!'
  isLoading = false;
  constructor(private codePlayGroundService:CodePlayGroundService){}

  ngAfterViewInit() {
    // Initialize Ace Editor
    this.editor = ace.edit('code_editor');

    // Set the editor theme (e.g., monokai, github, twilight)
    this.editor.setTheme('ace/theme/monokai');

    // Set the programming language mode (e.g., javascript, html, typescript)
    this.editor.session.setMode('ace/mode/java');

    // Set various options for customization
    this.editor.setOptions({
      fontSize: '16px', // Font size
      showLineNumbers: true, // Display line numbers
      showGutter: true, // Show gutter (line numbers + markers)
      highlightActiveLine: true, // Highlight the active line
      enableBasicAutocompletion: false, // Enable basic auto-completion
      enableLiveAutocompletion: false, // Enable live auto-completion
      enableSnippets: true, // Enable code snippets
      readOnly: false, // Set editor to read-only mode
      showPrintMargin: false, // Hide the print margin line
      highlightSelectedWord: true, // Highlight the selected word across the document
      useWorker: true, // Enable syntax validation
      displayIndentGuides: true, // Show indentation guides
      showInvisibles: false, // Display invisible characters
      wrap: true, // Enable word wrap
    });

    // Add custom key bindings (e.g., Ctrl-S to save file)
    this.editor.commands.addCommand({
      name: 'saveFile',
      bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
      exec: () => {
        console.log('File saved'); // Add save logic here
      },
    });

    // Handle onChange event (example for logging the content of the editor)
    // this.editor.on('change', () => {
    //   console.log('Editor content changed:', this.editor.getValue());
    // });

    this.themes = CodeConfig.getAllThemes();

    this.editor.setValue(codeSkeletons['java']);
  }

  ngOnDestroy() {
    // Proper cleanup to avoid memory leaks
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }

  changeConfig(event: any, type: string) {
    if (type == 'theme')
      this.editor.setTheme('ace/theme/' + event.target.value);
    else if (type == 'size')
      this.editor.setOptions({
        fontSize: event.target.value, // Font size
        showLineNumbers: true, // Display line numbers
        showGutter: true, // Show gutter (line numbers + markers)
        highlightActiveLine: true, // Highlight the active line
        enableBasicAutocompletion: true, // Enable basic auto-completion
        enableLiveAutocompletion: true, // Enable live auto-completion
        enableSnippets: true, // Enable code snippets
        readOnly: false, // Set editor to read-only mode
        showPrintMargin: false, // Hide the print margin line
        highlightSelectedWord: true, // Highlight the selected word across the document
        useWorker: true, // Enable syntax validation
        displayIndentGuides: true, // Show indentation guides
        showInvisibles: false, // Display invisible characters
        wrap: true, // Enable word wrap
      });
    else if (type == 'lang') {
      this.editor.session.setMode('ace/mode/' + event.target.value);
      this.selectedLang = event.target.value;
      this.editor.setValue(codeSkeletons[this.selectedLang]);
    }
  }

  executeCode() {
    this.isLoading = false;
    this.validFileName = true;
    // temporary invalid check
    if (this.selectedLang == 'java' && (this.javaFileName.trim() == '' || this.javaFileName == null)) {
      this.validFileName = false;
      this.compileResponse = "Error :: Enter valid file name!!!"
      return;
    }
    const compilerReq = new CompilerRequest();
    if (this.selectedLang == 'java') compilerReq.fileName = this.javaFileName;
    this.isLoading = true;
    compilerReq.code = this.editor.getValue();
    compilerReq.language = this.selectedLang;

    this.codePlayGroundService.compileCode(compilerReq).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.isLoading = false
        this.compileResponse = res.response
      },
      error:(err:any)=>{
        console.log(err.error);
      }
    })
    

  }
}


export const codeSkeletons: any = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  python: `def main():
    print("Hello, World!")`,
  javascript: `function main() {
  console.log('Hello, World!');
}`,
};
