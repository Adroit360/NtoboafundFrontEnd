import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/services/authservice";
import { CrowdFundService } from "src/services/crowdFund.service";
import { Location } from "@angular/common";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-crowdfund",
  templateUrl: "./edit-crowdfund.component.html",
  styleUrls: ["./edit-crowdfund.component.scss"],
})
export class EditCrowdfundComponent implements OnInit {
  @ViewChild("loader") Loader: ElementRef;

  userID: any;
  crowdID: any;

  crowdForm: FormGroup;
  crowdFund: any;

  loading: Boolean = false;
  categories: any;

  mainImage: any;
  secondImage: any;
  thirdImage: any;
  videoLink: any;

  mainPreview: any;
  firstPreview: any;
  secondPreview: any;
  thirdPreview: any;
  videoPreview: any;

  urlLink = "https://ntoboafundwebapi.azurewebsites.net";

  constructor(
    private authService: AuthService,
    private crowdService: CrowdFundService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.crowdID = res["id"];
      this.getCrowdFund();
    });

    this.init();
    this.getCategory();
  }

  init() {
    this.crowdForm = this.fb.group({
      id: this.crowdID,
      title: ["", Validators.required],
      description: ["", Validators.required],
      mainImage: [""],
      secondImage: [""],
      thirdImage: [""],
      videoUrl: [""],
      totalAmount: ["", Validators.required],
      typeId: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  async getUser() {
    const userid = await this.authService.currentUser;
    this.userID = userid;
  }

  async getCategory() {
    const category = await this.crowdService
      .getCrowd("crowdfund/types/all")
      .toPromise();
    this.categories = category;
  }

  getCrowdFund() {
    this.crowdService.singleCrowd(this.crowdID).subscribe(
      (res) => {
        this.crowdFund = res;
        console.log(this.crowdFund["endDate"]);
        this.crowdForm.patchValue(this.crowdFund);
      },
      (err) => {
        this.location.back();
      }
    );
  }

  async removeImage(section) {
    this.loading = true;

    const formData = new FormData();
    formData.append(`${section}`, this.crowdForm.get(`${section}`).value);

    await this.crowdService.updateCrowd(formData).subscribe(
      (res) => {
        this.getCrowdFund();
        this.snackbar.open("Item reoved successfully", "OK", {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "center",
        });
        this.loading = false;
      },
      (err) => {
        this.snackbar.open("Item could not be removed", "Retry", {
          duration: 5000,
          verticalPosition: "bottom",
          horizontalPosition: "center",
        });
        this.loading = false;
      }
    );
  }

  async editCrowdfund() {
    if (this.crowdForm.invalid) return;

    this.loading = true;

    const formData = new FormData();
    formData.append("id", this.crowdForm.get("id").value);
    formData.append("title", this.crowdForm.get("title").value);
    formData.append("description", this.crowdForm.get("description").value);
    formData.append("totalAmount", this.crowdForm.get("totalAmount").value);
    formData.append("typeId", this.crowdForm.get("typeId").value);
    formData.append("endDate", this.crowdForm.get("endDate").value);

    if (this.mainPreview) {
      formData.append("mainImage", this.mainImage);
    } else {
      formData.append("mainImageUrl", this.crowdFund["mainImageUrl"]);
    }

    if (this.secondPreview) {
      formData.append("secondImage", this.secondImage);
    } else {
      formData.append("secondImageUrl", this.crowdFund["secondImageUrl"]);
    }

    if (this.thirdPreview) {
      formData.append("thirdImage", this.thirdImage);
    } else {
      formData.append("thirdImageUrl", this.crowdFund["thirdImageUrl"]);
    }

    if (this.videoPreview) {
      formData.append("video", this.videoLink);
    } else {
      formData.append("videoUrl", this.crowdFund["videoUrl"]);
    }

    await this.crowdService.updateCrowd(formData).subscribe(
      (res) => {
        this.router.navigate([`/crowdfunding/${res["id"]}`]);
        this.snackbar.open("Update Successfully", "OK", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
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
}
