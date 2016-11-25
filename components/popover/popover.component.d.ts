import { EventEmitter, ElementRef } from '@angular/core';
import { OverlayManagerService, OverlayManagedComponent } from '../../services/overlayManager.service';
export declare class PopoverComponent implements OverlayManagedComponent {
    protected overlayManger: OverlayManagerService;
    protected myElement: ElementRef;
    target: string;
    style: string;
    class: string;
    zIndex: number;
    protected coverZIndex: number;
    targetAttachment: string;
    attachment: string;
    open: boolean;
    layer: boolean;
    openChange: EventEmitter<boolean>;
    zIndexManaged: boolean;
    expandManaged: boolean;
    state: string;
    constructor(overlayManger: OverlayManagerService, myElement: ElementRef);
    close(): void;
    offClick(): void;
    ngOnChanges(changes: any): void;
}
