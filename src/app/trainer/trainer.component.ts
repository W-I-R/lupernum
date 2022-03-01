import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as romanize from 'romanize';
import { Settings } from '../../settings';
import { Storage } from '@ionic/storage-angular';
import { Animation, AnimationController } from '@ionic/angular';


@Component({
  selector: 'lpn-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {

  public LEVELS = Settings.difficulty;

  /** current question (arabic) */
  private _question: number;

  /** current question (roman) */
  public question: string;

  public answer;

  public feedback: boolean|null = null;


  public questionCount: number = 0;
  public tryCount: number = 0;
  public correctCount: number = 0;

  /** current level */
  public currentLevel: number = 1;
  public currentLevelRoman: string = 'I';


  /** keep track of last 5 questions */
  private _previousQuestions: number[] = [];

  public correctAnimation: Animation;
  public wrongAnimation: Animation;

  @ViewChild('feedbackCorrect', { static: false }) feedbackCorrect: ElementRef;
  @ViewChild('feedbackWrong', { static: false }) feedbackWrong: ElementRef;

  constructor(
    private _storage: Storage, /** TODO https://github.com/ionic-team/ionic-storage#with-angular */
    private _animationCtrl: AnimationController,
  ) {}

  async ngOnInit() {
    await this._storage.create();

    const q = await this._storage.get('questionCount');
    const t = await this._storage.get('tryCount');
    const c = await this._storage.get('correctCount');
    const l = await this._storage.get('currentLevel');
    if(q) {
      this.questionCount = q;
    }
    if(t) {
      this.tryCount = t;
    }
    if(c) {
      this.correctCount = c;
    }
    if(l) {
      this.currentLevel = l;
      this.currentLevelRoman = romanize(l);
    }

    this.next(false);


    this.correctAnimation = this._animationCtrl.create()
      .addElement(this.feedbackCorrect.nativeElement)
      .duration(1000)
      .fromTo('opacity', '1', '0');

    this.wrongAnimation = this._animationCtrl.create()
      .addElement(this.feedbackWrong.nativeElement)
      .duration(2000)
      .fromTo('opacity', '1', '0');
  }


  /** check current user input (validate against question) */
  public check(): void {
    this.tryCount++;
    if (parseInt(this.answer, 10) === this._question) {
      this.feedback = true;
      this.correctAnimation.play();
      this.correctCount++;
      this.next();
    } else {
      this.wrongAnimation.play();
      this.feedback = false;
      this.save();
    }
  }

  /** reset and new question */
  public next(shouldSave: boolean = true): void {
    this.answer = null;
    this.questionCount++;

    this._newQuestion();

    if(shouldSave) {
      this.save();
    }
  }

  /** save current game stats to store */
  public async save() {
    await this._storage.set('questionCount', this.questionCount);
    await this._storage.set('tryCount', this.tryCount);
    await this._storage.set('correctCount', this.correctCount);
    await this._storage.set('currentLevel', this.currentLevel);
  }

  /** TODO (frk) move to utils.ts */
  private _randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * ((max) - min + 1) + min);
  }

  private _newQuestion(): void {
    let q: number = 0;
    while (q === 0 || this._previousQuestions.includes(q)) {
      q = this._randomNumber(Settings.difficulty[this.currentLevel-1].min, Settings.difficulty[this.currentLevel-1].max);
    }
    /** remove question if longer five questions are saved */ /** TODO make it depend on level */
    if (this._previousQuestions.length === 5) {
      this._previousQuestions.shift();
    }
    this._previousQuestions.push(q);
    this._question = q;
    this.question = romanize(this._question);
  }


  public changeLevel(level: number): void {
    this.currentLevel = level;
    this.currentLevelRoman = romanize(level);

    this.save();

    this._newQuestion();
  }

  public resetStats(): void {
    this.questionCount = 0;
    this.tryCount = 0;
    this.correctCount = 0;
    this.save();
  }
}

