import { ShapeConnector } from "./shape-connector.model";

export class Shape {
  public id: number;
  public name: string;
  public imageUrl: string;
  public toolTip: string;
  public statusImageUrl: string;
  public shapeConnectors: ShapeConnector[];

}
