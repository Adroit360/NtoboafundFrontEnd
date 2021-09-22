import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-slide-panel',
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss']
  // ,
  // encapsulation:ViewEncapsulation.None
})
export class SlidePanelComponent implements OnInit, AfterViewChecked {

  @ViewChild('rightButton') rightButton: ElementRef;

  @ViewChild('leftButton') leftButton: ElementRef;

  @ViewChild('contentBox') contentBox: ElementRef;

  @Input() classes: string[] = [];

  scrollReference: any;
  interval: any;
  initialScrollChecked = false;
  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
    // console.log(this.contentBox.nativeElement.getBoundingClientRect());
    // console.log(this.contentBox.nativeElement.scrollWidth);
    //this.renderer.removeClass(this.rightButton.nativeElement, 'faded');
  }

  ngAfterViewChecked() {
    if (!this.initialScrollChecked)
      this.HideorShowScrollButton(0);
  }
  /**
   * 
   * @param scrollLength How far to scroll from the left
   */
  scrollLeft(scrollLength) {
    this.contentBox.nativeElement.scrollTo({
      top: 0,
      left: scrollLength,
      behavior: 'smooth'
    });

  }

  /**
   * 
   * @param scrollLength How far to scroll from the left
   */
  scrollRight(scrollLength) {
    this.contentBox.nativeElement.scrollTo({
      top: 0,
      left: scrollLength,
      behavior: 'smooth'
    });
  }

  /**
   * returns 20 percent of the current object witdh + scroll offset depending on the scrollDirection
   * scrollDirection can be either left or right
   */
  getScrollBit(scrollDirection: String) {
    if (scrollDirection == "left") {
      return this.contentBox.nativeElement.scrollLeft - (this.contentBox.nativeElement.clientWidth / 1.5);
      //return this.contentBox.nativeElement.scrollLeft - (this.contentBox.nativeElement.getBoundingClientRect().width / 5)
    }
    else if (scrollDirection == "right") {
      return this.contentBox.nativeElement.scrollLeft + (this.contentBox.nativeElement.clientWidth / 1.5)
      //return this.contentBox.nativeElement.scrollLeft + (this.contentBox.nativeElement.getBoundingClientRect().width / 5)
    }

  }

  /**
   * 
   * @param scrollDirection left or right
   * @param duration time to finish the animation
   * @param scrollToEnd Indicates whether to scroll to end 
   */
  startScroll(scrollDirection, duration = .2, scrollToEnd = false): any {
    let startTime = null;
    var originalContext = this;

    function animation(currentTime) {
      //set the start time to the initial timestamp for once
      if (startTime == null) startTime = currentTime;

      //use the previously captured timestamp to change calculate the animation elapsed time
      var timeElapsed = currentTime - startTime;

      //call the particular scroll Method of depending on the scroll direction
      if (scrollDirection == "left") {
        if (scrollToEnd)
          originalContext.scrollLeft.call(originalContext, 0); //scroll back to 0
        else
          originalContext.scrollLeft.call(originalContext, originalContext.getScrollBit("left")); //scroll in bits
      }
      else if (scrollDirection == 'right') {
        if (scrollToEnd)
          originalContext.scrollLeft.call(originalContext, originalContext.getContentBoxMaxScrollWidth()); //scroll to highest
        else
          originalContext.scrollLeft.call(originalContext, originalContext.getScrollBit("right"));//scroll in bits
      }

      //Keep running the animation along with current Frame unit duration is reached
      if (timeElapsed < duration)
        originalContext.scrollReference = requestAnimationFrame(animation);


    }

    //Run the animation with the next Frame
    originalContext.scrollReference = requestAnimationFrame(animation);
  }

  stopScroll() {
    cancelAnimationFrame(this.scrollReference);
  }

  stopScrollToEnd() {
    // clearInterval(this.interval);
    //console.log("Interval Stopped");
  }


  HideorShowScrollButton(leftOffset) {
    if (!this.initialScrollChecked) {
      this.initialScrollChecked = true;
    }
    //if the far right is reached , hide the right scroll button
    var maxScrollWidth = this.getContentBoxMaxScrollWidth();
    // console.log("scrollWidth - clientWidth Native Element is " + maxScrollWidth);
    // console.log("scrollLeft is " + this.contentBox.nativeElement.scrollLeft)

    //Hide all button if all the element are showing
    if (this.contentBox.nativeElement.scrollWidth == this.contentBox.nativeElement.clientWidth) {
      this.renderer.addClass(this.rightButton.nativeElement, 'faded');
      this.renderer.addClass(this.leftButton.nativeElement, 'faded');
    }
    else if (leftOffset >= maxScrollWidth) {
      this.renderer.addClass(this.rightButton.nativeElement, 'faded');
      this.renderer.removeClass(this.leftButton.nativeElement, 'faded');
    }
    //else if the far left is reached , hide the leftbutton
    else if (leftOffset <= 0) {
      this.renderer.addClass(this.leftButton.nativeElement, 'faded');
      this.renderer.removeClass(this.rightButton.nativeElement, 'faded');
    }
    //else if the scrollbar is in the middle, reveal all the buttons
    else {
      this.renderer.removeClass(this.rightButton.nativeElement, 'faded');
      this.renderer.removeClass(this.leftButton.nativeElement, 'faded');
    }
  }

  /**
   * Is Trigger when the contentBox is resized
   * @param event The event parameter
   */
  onContentScroll(event) {
    //console.log(event);
    this.HideorShowScrollButton(event.target.scrollLeft);
  }

  /**
   * Occurs when the window is resized
   * @param event The event parameter
   */
  onWindowResized(event) {
    this.HideorShowScrollButton(this.contentBox.nativeElement.scrollLeft);
  }

  getContentBoxMaxScrollWidth() {
    return this.contentBox.nativeElement.scrollWidth - this.contentBox.nativeElement.clientWidth;
  }

  scrolltoEnd(scrollDirection) {
    var originalContext = this;
    //this.interval = 
    setInterval(
      originalContext.startScroll.call(originalContext, scrollDirection)
      // originalContext.logInterval(scrollDirection)
      , 1000);
  }

  logInterval(scrollDirection): any {
    console.log("Interval running")
    // originalContext.startScroll.call(originalContext,scrollDirection)
    this.startScroll.call(this, scrollDirection)
  }

}

