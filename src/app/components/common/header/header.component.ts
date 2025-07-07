import { Component, EventEmitter, Output } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { CommonService } from '../../../shared/service/common/common.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(public commonService: CommonService) {}

  onMenuClick() {
    this.toggleSidenav.emit();
  }
}
