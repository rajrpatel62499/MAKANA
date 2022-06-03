// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

export enum Gender {
    None,
    Female,
    Male
}

export enum PipelineStatus {
  NotStarted=1,
  Running,
  Completed,
  Failed
}

export enum AttributeFieldType {
  Number=1,
  String,
  
}
export enum AttributeFieldControlType {
  TextBox=1,
  Checkbox,
  Date,
  Radio,
  Range,
  DropDown,
  FileUpload
}
