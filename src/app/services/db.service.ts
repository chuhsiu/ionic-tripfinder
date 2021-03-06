import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Attraction } from './attraction'; //import services song.ts class name, original is Song, Song=>Attraction
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  attractionList = new BehaviorSubject([]); //attraction lsit, original is songList
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform, 
    private sqlite: SQLite, 
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }
 
  fetchAttractions(): Observable<Attraction[]> { //services song.ts class name, original is Song, Song[]=>Attraction[], fetchSongs()=>fetchAttractions() 
    return this.attractionList.asObservable();
  }

    // Render fake data
  getFakeData() {
    this.httpClient.get(
      'assets/google_attractions.json', //get the sql or json file 
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importJsonToDb(this.storage, data)
        .then(_ => {
          this.getAttractions();   //original is getSongs, getSongs=>getAttractions
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  // Get list
  getAttractions(){  //original is getSongs, getSongs=>getAttractions
    return this.storage.executeSql('SELECT * FROM AttractionInfo', []).then(res => {
      let items: Attraction[] = []; //services song.ts class name, original is Song, Song[]=>Attraction[]
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({  //getting all the columns by column names
            Aid: res.rows.item(i).Aid,  //變數名: res.rows.item(i).資料表欄位名,
            Aname: res.rows.item(i).Aname,  
            GoogleClass: res.rows.item(i).GoogleClass,
            Phone: res.rows.item(i).Phone,
            Address: res.rows.item(i).Address,
            Rate: res.rows.item(i).Rate
           });
        }
      }
      this.attractionList.next(items);  //Line15宣告的List
    });
  }

  // Add
  addAttraction(Aname, GoogleClass, Phone, Address, Rate) { //get all column variables
    let data = [Aname, GoogleClass, Phone, Address, Rate]; // combine all variables into a dataset
    return this.storage.executeSql('INSERT INTO AttractionInfo (Aname, GoogleClass, Phone, Address, Rate) VALUES (?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.getAttractions();
    });
  }
 
  // Get single object
  getAttraction(Aid): Promise<Attraction> {
    return this.storage.executeSql('SELECT * FROM AttractionInfo WHERE Aid = ?', [Aid]).then(res => { 
      return {
        Aid: res.rows.item(0).Aid,  //變數名: res.rows.item(0).資料表欄位名, 因為只有一筆，所以只抓第0列
        Aname: res.rows.item(0).Aname,  
        GoogleClass: res.rows.item(0).GoogleClass,
        Phone: res.rows.item(0).Phone,
        Address: res.rows.item(0).Address,
        Rate: res.rows.item(0).Rate,  
      }
    });
  }

  // Update
  updateAttraction(Aid, attraction: Attraction) {
    let data = [attraction.Aname, attraction.GoogleClass, attraction.Phone, attraction.Address, attraction.Rate];
    return this.storage.executeSql(`UPDATE AttractionInfo SET Aname = ?, GoogleClass = ?, Phone = ?, Address = ?, Rate = ? WHERE Aid = ${Aid}`, data)
    .then(data => {
      this.getAttractions();
    })
  }

  // Delete
  deleteAttraction(Aid) {
    return this.storage.executeSql('DELETE FROM AttractionInfo WHERE Aid = ?', [Aid])
    .then(_ => {
      this.getAttractions();
    });
  }
}
