import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../common/header/header.component';
import { SidenavComponent } from '../common/sidenav/sidenav.component';
import { CommonService } from '../../shared/service/common/common.service';
import { SHARED_MATERIAL_MODULES } from '../../shared/common/shared-material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidenavComponent,
    RouterOutlet,
    SHARED_MATERIAL_MODULES,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenavComponent!: SidenavComponent;

  isSmallScreen = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.observeScreenSize();
    this.commonService.getCurrentUserDetails();
    this.commonService.userDetails$.subscribe((user) => {
      console.log('commonService', user);
    });
  }

  onToggleSidenav() {
    if (this.isSmallScreen) {
      this.sidenavComponent.toggle();
    } else {
      this.commonService.expandSidenav.set(!this.commonService.expandSidenav());
    }
  }

  observeScreenSize() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  navigateToUrl(event: string) {
    this.router.navigateByUrl(event);
  }
}
