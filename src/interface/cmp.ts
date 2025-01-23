import {
  IArrowType,
  IBlendMode,
  IPaint,
  IPointData,
  IShadowEffect,
} from 'leafer-ui';

export interface Cmp {
  id: string;
  name: string;
  type: CmpType;
  x?: number;
  /** y */
  y?: number;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否锁定 */
  locked?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 填充颜色 */
  fill?: string | IPaint | IPaint[];
  /** 描边 */
  stroke?: string | IPaint | IPaint[];
  /** 透明度 */
  opacity?: number;
  /** 外阴影 */
  shadow?: IShadowEffect | IShadowEffect[];
  /** 内阴影 */
  innerShadow?: IShadowEffect | IShadowEffect[];
  /** 混合模式 */
  blendMode?: IBlendMode;
  /** 旋转 */
  rotation?: number;
  /** 水平倾斜 */
  skewX?: number;
  /** 垂直倾斜 */
  skewY?: number;
  /** X 缩放 */
  scaleX?: number;
  /** Y 缩放 */
  scaleY?: number;
  /** 层叠顺序 */
  zIndex?: number;

  strokeWidth?: number;
}

export interface TextCmp extends Cmp {
  type: CmpType.Text;
  text: string;
  fontSize: number;
  fontFamily: string;
  autoHeight?: boolean;
}

export interface RectCmp extends Cmp {
  type: CmpType.Rect;
}

export interface EllipseCmp extends Cmp {
  type: CmpType.Ellipse;
}

export interface LineCmp extends Cmp {
  type: CmpType.Line;
  toPoint?: IPointData;
  points?: number[] | IPointData[];
}

export interface ArrowCmp extends Cmp {
  type: CmpType.Arrow;
  startArrow?: IArrowType;
  endArrow?: IArrowType;
  points?: number[] | IPointData[];
}

export interface ImageCmp extends Cmp {
  type: CmpType.Image;
  url: string;
}

export enum CmpType {
  Text,
  Rect,
  Ellipse,
  Line,
  Arrow,
  Image,
}
