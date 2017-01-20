export declare enum GrowlType {
    None = 0,
    Info = 1,
    Success = 2,
    Warning = 3,
    Error = 4,
}
export declare enum GrowlPosition {
    TopRight = 0,
    Top = 1,
    TopLeft = 2,
    BottomRight = 3,
    Bottom = 4,
    BottomLeft = 5,
}
export interface GrowlOptions {
    text?: string;
    html?: boolean;
    type?: GrowlType;
    showCloseButton?: boolean;
    position?: GrowlPosition;
    timeout?: number | boolean;
    backgroundColor?: string;
    textColor?: string;
}
export declare const GROWL_DEFAULTS: GrowlOptions;
export declare const POSITION_CLASS_MAP: {
    [x: number]: string;
};
export declare const TYPE_CLASS_MAP: {
    [x: number]: {
        growlClass: string;
        iconClass: string;
    };
};
