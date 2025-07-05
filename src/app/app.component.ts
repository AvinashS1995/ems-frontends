import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonService } from './shared/service/common/common.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ems-frontend';
  
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.setUserDetailsFromToken();
  }
}
