import { Component, OnInit } from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-add-crowdfund",
  templateUrl: "./add-crowdfund.component.html",
  styleUrls: ["./add-crowdfund.component.scss"],
})
export class AddCrowdfundComponent implements OnInit {
  crowdImage: any;
  previewURL: any;

  disabledAgreement: boolean = true;

  constructor(private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "",
    toolbarHiddenButtons: [
      [
        "redo",
        "undo",
        "strikeThrough",
        "indent",
        "outdent",
        "insertHorizontalRule",
        "link",
        "textColor",
      ],
      [
        "insertImage",
        "toggleEditorMode",
        "insertVideo",
        "backgroundColor",
        "unlink",
      ],
    ],
  };

  preview() {
    var mimeType = this.crowdImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.crowdImage);
    reader.onload = () => {
      this.previewURL = reader.result;
    };
  }

  fileProgress(fileInput: any) {
    this.crowdImage = <File>fileInput.target.files[0];
    this.preview();
  }

  changeCheck(event) {
    this.disabledAgreement = !event.checked;
  }

  open(content) {
    this.modalService.open(content);
  }

  ngOnInit() {}
}
