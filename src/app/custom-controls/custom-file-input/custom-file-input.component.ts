import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-file-input',
  templateUrl: './custom-file-input.component.html',
  styleUrls: ['./custom-file-input.component.scss']
})
export class CustomFileInputComponent implements OnInit {
  @Input() defaultLabelText:String = "Choose Image";
  @Input() hiddenLabelText:String ="Remove Image";
  @Input() Accept:String="";
  
  @Output() inputChanged = new EventEmitter<InputChangedEventArgs>();

  labelText:String;
  hasHideClass:Boolean;
  @ViewChild("input") inputElement:ElementRef;
  @ViewChild("label") labelElement:ElementRef;
  @ViewChild("cImageInput") cImageInput:ElementRef;

  selectedFile:File;
  selectedFiles:File[];
  selectedImageUrl:String;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
    console.log("main Element");
    this.hasHideClass = false;
    this.changeLabelText()
  }

  changeLabelText(){
    if(this.inputElement.nativeElement.value==""){
      //Unhide label and show choose Image text
      this.hasHideClass = false;
      this.labelText = this.defaultLabelText;
      console.log("hadHideClass set to false");
    }
    else{
      //Hide Label and show Remove Image text on Hover
      this.hasHideClass = true;
      this.labelText = this.hiddenLabelText;
      console.log("hadHideClass set to true");
    }
  }

  onImageSelected(event){
    //If no image was selected dont even bother processing the image at all
    this.inputChanged.emit(new InputChangedEventArgs(this.inputElement.nativeElement.value,event.target.files[0],event.target.files));
    if(this.inputElement.nativeElement.value == ''){

    }
    else{
      this.selectedFile = event.target.files[0];
      this.showPreview();
    }
   
  }

  showPreview(){
    var reader = new FileReader();
    reader.onload = (event:any)=>{
      this.selectedImageUrl = event.target.result;
    }
    reader.readAsDataURL(this.selectedFile);
    this.changeLabelText()

    //Remove the background color if an image is displayed
    this.renderer.setStyle(this.cImageInput.nativeElement,"background-color","transparent");
   // this.renderer.addClass(this.labelElement.nativeElement,"")
  }

  clearPreview(){
    this.renderer.setProperty(this.inputElement.nativeElement,"value","");
    this.selectedImageUrl = "";
    this.selectedFile = undefined;  
    this.changeLabelText();
    this.inputChanged.emit(new InputChangedEventArgs(this.inputElement.nativeElement.value,undefined,undefined));
    //Set the background Color if no image is currently displaying
    this.renderer.setStyle(this.cImageInput.nativeElement,"background-color","#f5f7fa");
  }

  label_Click(){
   
    if(this.labelElement.nativeElement.classList.contains("hide")){
      this.clearPreview();
    }
    else{
      this.inputElement.nativeElement.click();
    }
  }


}

export class InputChangedEventArgs{
  constructor(public value:String,public file:File,public files:File[]){}
}
