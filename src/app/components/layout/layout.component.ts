import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../common/header/header.component';
import { SidenavComponent } from '../common/sidenav/sidenav.component';
import { CommonService } from '../../shared/service/common/common.service';
import { SHARED_MATERIAL_MODULES } from '../../shared/common/shared-material';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, RouterOutlet,SHARED_MATERIAL_MODULES],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit() {
    
    this.commonService.userDetails$.subscribe(user => {
  console.log("commonService",user);
});

  }

  navigateToUrl(event:string) {
    this.router.navigateByUrl(event);
  }

}
