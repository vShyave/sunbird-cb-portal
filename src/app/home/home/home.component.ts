import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils/src/lib/services/configurations.service';
import { IUserProfileDetailsFromRegistry } from '@ws/app/src/lib/routes/user-profile/models/user-profile.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { BtnSettingsService } from '@sunbird-cb/collection';
import { MobileAppsService } from '../../services/mobile-apps.service';
const API_END_POINTS = {
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
}
@Component({
  selector: 'ws-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  widgetData = {};
  sliderData = {};
  contentStripData:any = {};
  discussStripData = {};
  networkStripData = {};
  carrierStripData = {};
  clientList: {} | undefined
  homeConfig: any = {}; 
  isNudgeOpen = true;
  currentPosition: any;
  mobileTopHeaderVisibilityStatus: any = true;
  constructor(private activatedRoute:ActivatedRoute,  private configSvc: ConfigurationsService, public btnSettingsSvc: BtnSettingsService, 
    private http: HttpClient, public mobileAppsService: MobileAppsService) { }

  ngOnInit() {
    this.mobileAppsService.mobileTopHeaderVisibilityStatus.subscribe((status:any)=> {
      this.mobileTopHeaderVisibilityStatus = status; 
    })
    if(this.activatedRoute.snapshot.data.pageData) {
      console.log('homaPageJsonData',this.activatedRoute.snapshot.data.pageData);
      this.homeConfig = this.activatedRoute.snapshot.data.pageData.data.homeConfig; 
    }
    if(this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
      this.contentStripData = (this.contentStripData.homeStrips || []).sort((a:any, b:any) => a.order - b.order)
      console.log('contentStripData',this.contentStripData);
    }

    this.clientList = this.activatedRoute.snapshot.data.pageData.data.clientList;
    this.widgetData = this.activatedRoute.snapshot.data.pageData.data.hubsData;

    this.discussStripData = {
      "strips": [
        {
          "key": "discuss",
          "logo": "forum",
          "title": "discuss",
          "stripBackground": "assets/instances/eagle/background/discuss.svg",
          "titleDescription": "Trending discussions",
          "stripConfig": {
            "cardSubType": "cardHomeDiscuss"
          },
          "viewMoreUrl": {
            "path": "/app/discuss/home",
            "viewMoreText": "Discuss",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/proxies/v8/discussion/recent",
              "queryParams": {}
            }
          }
        }
      ]
    };

    this.networkStripData = {
      "strips": [
        {
          "key": "network",
          "logo": "group",
          "title": "network",
          "stripBackground": "assets/instances/eagle/background/network.svg",
          "titleDescription": "Connect with people you may know",
          "stripConfig": {
            "cardSubType": "cardHomeNetwork"
          },
          "viewMoreUrl": {
            "path": "/app/network-v2",
            "viewMoreText": "Network",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/protected/v8/connections/v2/connections/recommended/userDepartment",
              "queryParams": ""
            }
          }
        }
      ]
    };

    this.carrierStripData = {
      "widgets":
        [
          {
            "dimensions": {},
            "className": "",
            "widget": {
              "widgetType": "carrierStrip",
              "widgetSubType": "CarrierStripMultiple",
              "widgetData": {
                "strips": [
                  {
                    "key": "Career",
                    "logo": "work",
                    "title": "Careers",
                    "stripBackground": "assets/instances/eagle/background/careers.svg",
                    "titleDescription": "Latest openings",
                    "stripConfig": {
                      "cardSubType": "cardHomeCarrier"
                    },
                    "viewMoreUrl": {
                      "path": "/app/careers/home",
                      "viewMoreText": "Career",
                      "queryParams": {}
                    },
                    "filters": [],
                    "request": {
                      "api": {
                        "path": "/apis/protected/v8/discussionHub/categories/1",
                        "queryParams": {}
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
    };

    this.sliderData = this.activatedRoute.snapshot.data.pageData.data.sliderData;

    this.handleUpdateMobileNudge();

    this.handleDefaultFontSetting();
  }

  handleButtonClick(): void {
    console.log("Working!!!");
  
  }

  handleUpdateMobileNudge() {
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      this.fetchProfileById(this.configSvc.unMappedUser.id).subscribe(x => {
        // console.log(x.profileDetails, "x.profileDetails====")
        // if (x.profileDetails.mandatoryFieldsExists) {
        //   this.isNudgeOpen = false
        // }
        if (x && x.profileDetails && x.profileDetails.personalDetails && x.profileDetails.personalDetails.phoneVerified) {
          this.isNudgeOpen = false
        }
      })
    }
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_END_POINTS.fetchProfileById(id))
      .pipe(map((res: any) => {
        return _.get(res, 'result.response')
      }))
  }

  handleDefaultFontSetting() {
    let fontClass = localStorage.getItem('setting');
    this.btnSettingsSvc.changeFont(fontClass);
  }

  // @HostListener('window:scroll', ['$event'])
  // scrollHandler(e: any) {
  //   let scroll = e.scrollTop;
  //   console.log('scroll');
  //   if (scroll > this.currentPosition) {
  //     console.log("scrollDown");
  //   } else {
  //     console.log("scrollUp");
  //   }
  //   this.currentPosition = scroll;
  //   // var insightsResults = document.getElementsByClassName(
  //   //   'insights-results'
  //   // )[0];
  //   // var childInsights = insightsResults?.scrollHeight;
  //   // var windowScroll = window.scrollY;
  //   // if (Math.floor(windowScroll) >= Math.floor(childInsights)) {
  //   //     this.loadMore();
  //   // }
  // }
  
  
  //  loadMore(): void {
  //   this.page++;
  // }
  
  remindlater() {
    this.isNudgeOpen = false
  }
  

}
