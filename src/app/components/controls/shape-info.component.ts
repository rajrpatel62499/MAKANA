// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { PipelineShape } from "../../models/pipeline-shape.model";
import { UserEdit } from "../../models/user-edit.model";
import { Role } from "../../models/role.model";
import { User } from "../../models/user.model";
import { Permission } from "../../models/permission.model";


@Component({
    selector: 'shape-info',
  templateUrl: './shape-info.component.html',
  styleUrls: ['./shape-info.component.scss']
})
export class ShapeInfoComponent implements OnInit {

    public isEditMode = false;
    public isNewShape = false;
    public isSaving = false;
    public showValidationErrors = false;
    public uniqueId: string = Utilities.uniqueId();
  public shape: PipelineShape = new PipelineShape();
  public shapeEdit: PipelineShape;
    
    public formResetToggle = true;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;





    @ViewChild('f', { static: false })
    public form;

    // ViewChilds Required because ngIf hides template variables from global scope
    

    constructor(private alertService: AlertService, private accountService: AccountService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
          this.loadCurrentShapeData();
        }
    }



    private loadCurrentShapeData() {
        this.alertService.startLoadingMessage();

        //if (this.canViewAllRoles) {
        //    this.accountService.getUserAndRoles().subscribe(results => this.onCurrentUserDataLoadSuccessful(results[0], results[1]), error => this.onCurrentUserDataLoadFailed(error));
        //} else {
        //  this.accountService.getUser().subscribe(user => this.onCurrentShapeDataLoadSuccessful(user, user.roles.map(x => new Role(x))), error => this.onCurrentShapeDataLoadFailed(error));
        //}
    }


  private onCurrentShapeDataLoadSuccessful(shape: PipelineShape) {
        this.alertService.stopLoadingMessage();
        this.shape = shape;
        
    }

    private onCurrentShapeDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('Load Error', `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);

      this.shape = new PipelineShape();
    }

    showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    edit() {
        if (!this.isGeneralEditor) {
          this.shapeEdit = new PipelineShape();
            Object.assign(this.shapeEdit, this.shape);
        } else {
            if (!this.shapeEdit) {
              this.shapeEdit = new PipelineShape();
            }
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
    }


    save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage('Saving changes...');
        
        if (this.isNewShape) {
            //this.accountService.newUser(this.userEdit).subscribe(user => this.saveSuccessHelper(user), error => this.saveFailedHelper(error));
        } else {
            //this.accountService.updateUser(this.userEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }


  private saveSuccessHelper(shape?: PipelineShape) {
      if (shape) {
            Object.assign(this.shapeEdit, shape);
        }

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        
        Object.assign(this.shape, this.shapeEdit);
    this.shapeEdit = new PipelineShape();
        this.resetForm();


        if (this.isGeneralEditor) {
          if (this.isNewShape) {
            this.alertService.showMessage('Success', `Shape \"${this.shape.shape.name}\" was created successfully`, MessageSeverity.success);
          } else {
            this.alertService.showMessage('Success', `Changes to shape \"${this.shape.shape.name}\" was saved successfully`, MessageSeverity.success);
          }
        }
        this.isEditMode = false;


        if (this.changesSavedCallback) {
            this.changesSavedCallback();
        }
    }


    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('Save Error', 'The below errors occured whilst saving your changes:', MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback) {
            this.changesFailedCallback();
        }
    }
  
    cancel() {
        if (this.isGeneralEditor) {
          this.shapeEdit = this.shape = new PipelineShape();
        } else {
          this.shapeEdit = new PipelineShape();
        }

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage('Cancelled', 'Operation cancelled by user', MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor) {
            this.isEditMode = false;
        }

        if (this.changesCancelledCallback) {
            this.changesCancelledCallback();
        }
    }


    close() {
      this.shapeEdit = this.shape = new PipelineShape();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback) {
            this.changesSavedCallback();
        }
    }

    resetForm(replace = false) {
        if (!replace) {
            this.form.reset();
        } else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }


    newShape() {
        this.isGeneralEditor = true;
        this.isNewShape = true;
      this.shape = this.shapeEdit = new PipelineShape();
        this.edit();
        return this.shapeEdit;
    }

  editShape(shape: PipelineShape) {
        if (shape) {
            this.isGeneralEditor = true;
            this.isNewShape = false;
          
          this.shape = new PipelineShape();
          this.shapeEdit = new PipelineShape();
            Object.assign(this.shape, shape);
            Object.assign(this.shapeEdit, shape);
            this.edit();

            return this.shapeEdit;
        } else {
            return this.newShape();
        }
    }


  displayUser(shape: PipelineShape) {

    this.shape = new PipelineShape();
          Object.assign(this.shape, shape);
          

          this.isEditMode = false;
      }

}
