import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any;
export declare class FlipSwitchComponent implements ControlValueAccessor {
    tabindex: number;
    onLabel: string;
    offLabel: string;
    value: boolean;
    change$: EventEmitter<boolean>;
    constructor();
    onClick(): void;
    keydown(ev: any): void;
    /**
     * things needed for ControlValueAccessor-Interface
     */
    private onTouchedCallback;
    private onChangeCallback;
    writeValue(value: boolean): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
