// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'text-box',
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent {

    @Input()
    isViewOnly: boolean;

    @Input()
    isEditMode: boolean;

    @Input()
    placeholder = 'Search...';

    @Output()
    searchChange = new EventEmitter<string>();

    @ViewChild('searchInput', { static: true })
    searchInput: ElementRef;


    onValueChange(value: string) {
        setTimeout(() => this.searchChange.emit(value));
    }


    clear() {
        this.searchInput.nativeElement.value = '';
        this.onValueChange(this.searchInput.nativeElement.value);
    }
}
