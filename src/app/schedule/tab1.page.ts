
import { Component, OnInit ,NgZone ,ViewChild, AfterContentInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { ControllerserviceService,Favorites,googleInfor } from '../controllerservice.service';
import { VirtualTimeScheduler } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // 圖片的位置
  slides = [
    {
      img: 'assets/img/search/1.jpg',
      place: '合歡山',
      // subtitle: '高雄市',
      collection : 1
    },
    {
      img: 'assets/img/search/2.jpg',
      place: '合歡山',
      // subtitle: '合歡山',
      collection : 1
    },
    {
      img: 'assets/img/search/3.jpg',
      place: '哪裡哪裡',
      // subtitle: 'Good',
      collection : 1
    },
    {
      img: 'assets/img/search/4.jpg',
      place: '熱門景點4',
      // subtitle: '',
      collection : 1
    }
  ];

  // 讓圖片進行輪播
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    speed: 2000,
   };
  favorites: Favorites[]; //load進所有現存資料
  constructor(public nav: NavController,public service : ControllerserviceService) {}
  ngOnInit(): void{
    this.service.getFavorites().subscribe(res => {
      this.favorites = res; //接受firebase裡所有的欄位
      this.favorites = this.favorites.sort(function (a, b) {
        return a.collection < b.collection ? 1 : -1;
      })
      this.slides = this.favorites
    });

    console.log(this.favorites);
  }
  // ngAfterViewInit() : void{
  //   setTimeout(() => {
  //   }, 1000);
  //   this.favorites.map(element => {
  //     this.slides.push(element);
  //   });
  // }
  turnpage(){   // 換頁到phase1
    this.nav.navigateRoot(['selecting-phase1']);
  }
  testshow(){
    this.favorites.map(element => {
      this.slides.push(element);
    });
  }
}
