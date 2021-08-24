import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/services/authservice";
import { CrowdFundService } from "src/services/crowdFund.service";

@Component({
  selector: "app-add-crowdfund",
  templateUrl: "./add-crowdfund.component.html",
  styleUrls: ["./add-crowdfund.component.scss"],
})
export class AddCrowdfundComponent implements OnInit {
  mainImage: any;
  secondImage: any;
  thirdImage: any;
  videoLink: any;

  mainPreview: any;
  firstPreview: any;
  secondPreview: any;
  thirdPreview: any;
  videoPreview: any;

  disabledAgreement: boolean = true;

  crowdForm: FormGroup;
  userId: any;

  categories: any;
  loading: Boolean = false;

  @ViewChild("loader") Loader: ElementRef;

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
    private crowdService: CrowdFundService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  init() {
    this.crowdForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      mainImage: [""],
      secondImage: [""],
      thirdImage: [""],
      videO: [""],
      totalAmount: ["", Validators.required],
      userId: this.userId,
      typeId: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.init();
    this.getUser();
    this.getCategory();
  }

  async getUser() {
    const userid = await this.authService.currentUser;
    this.userId = userid.id;
  }

  async getCategory() {
    const category = await this.crowdService
      .getCrowd("crowdfund/types/all")
      .toPromise();
    this.categories = category;
  }

  async addCrowdFund() {
    if (this.crowdForm.invalid) return;

    this.loading = true;

    const formData = new FormData();
    formData.append("title", this.crowdForm.get("title").value);
    formData.append("mainImage", this.mainImage);
    formData.append("description", this.crowdForm.get("description").value);
    formData.append("totalAmount", this.crowdForm.get("totalAmount").value);
    formData.append("userId", this.userId);
    formData.append("typeId", this.crowdForm.get("typeId").value);

    if (this.secondPreview) {
      formData.append("secondImage", this.secondImage);
    }

    if (this.thirdPreview) {
      formData.append("thirdImage", this.thirdImage);
    }

    if (this.videoPreview) {
      formData.append("video", this.videoLink);
    }

    // for (let i = 0; i < this.otherImage.length; i++) {
    //   formData.append("otherImages", this.otherImage[i]);
    // }

    // console.log(formData.get("title"));
    // console.log(formData.get("description"));
    // console.log(formData.get("totalAmount"));
    // console.log(formData.get("userId"));
    // console.log(formData.get("typeId"));

    await this.crowdService.addCrowdFund(formData).subscribe(
      (res) => {
        this.router.navigate([`/crowdfunding/${res["id"]}`]);
        this.snackbar.open("Added Successfully", "OK", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
        // this.snackbar.open("Add Successfully", "OK", {
        //   duration: 50000000,
        //   verticalPosition: "top",
        //   horizontalPosition: "center",
        // });
        this.loading = false;
      },
      (err) => {
        this.snackbar.open(err.error.message, "Retry", {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "center",
        });
        this.loading = false;
      }
    );
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

  main_Preview() {
    var mimeType = this.mainImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.mainImage);
    reader.onload = () => {
      this.mainPreview = reader.result;
    };
  }

  mian_fileProgress(fileInput: any) {
    this.mainImage = <File>fileInput.target.files[0];
    this.main_Preview();
  }

  second_preview() {
    var mimeType = this.secondImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.secondImage);
    reader.onload = () => {
      this.secondPreview = reader.result;
    };
  }

  second_fileProgress(file: any) {
    this.secondImage = <File>file.target.files[0];
    this.second_preview();
  }

  third_preview() {
    var mimeType = this.thirdImage.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.thirdImage);
    reader.onload = () => {
      this.thirdPreview = reader.result;
    };
  }

  third_fileProgress(file: any) {
    this.thirdImage = <File>file.target.files[0];
    this.third_preview();
  }

  video_preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.videoLink);
    reader.onload = () => {
      this.videoPreview = reader.result;
    };
  }

  videoProgress(file: any) {
    this.videoLink = <File>file.target.files[0];
    this.video_preview();
  }

  // onFileChange(event) {
  //   for (let i = 1; i < event.target.files.length; i++) {
  //     this.otherImage.push(event.target.files[i]);
  //   }

  //   this.urls = [];
  //   let files = event.target.files;
  //   if (files) {
  //     for (let file of files) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = (e: any) => {
  //         this.urls.push(e.target.result);
  //       };
  //     }
  //   }
  // }

  changeCheck(event) {
    this.disabledAgreement = !event.checked;
  }

  open(content) {
    this.modalService.open(content);
  }
}
