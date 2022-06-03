import { ShapeConnector } from "./shape-connector.model";
import { PipelineShapeAttribute } from "./pipeline-shape-attribute.model";
import { Shape } from "./shape.model";

export class PipelineShape {
  public pipelineShapeId: number;
  public pipelineId: number;
  public shapeId: number;
  public id: string;
  public shapeDisplayName: string;
  public statusImageUrl: string;
  public x: number;
  public y: number;
  public shape: Shape;
  public pipelineShapeAttributes: PipelineShapeAttribute[];
}
