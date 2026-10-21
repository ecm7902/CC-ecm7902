# Clock Assignment

---

I wanted to try to make a linear version of a clock for this project. Instead of a circular version of a clock, I thought it could be interesting to work only with rectangles. I thought about the keys on a piano or a bar graph. It might be cool to watch the amount of the day or month go by through watching the rectangles change on the screen.  

I knew I wanted to work with gradients on this project because I thought it might be a cool way to differentiate the bars. I tried a few different strategies for the gradient, but ended up going with the drawing content to access the canvas html element. I learned about this on the p5 website. I'll link to the page here [https://p5js.org/reference/p5/drawingContext/](https://p5js.org/reference/p5/drawingContext/)  

I also wanted to try to work with scrolling. Initially I though zooming in or out would be cool, but I ended up with something more like scrolling up or down using a zoom value and mouse wheel. I worked to make sure the bars on the clock panel and the calendar panel would scale proportionally to my zoom and if I was resizing the viewport. I used windowResized to help make the canvas more responsive. I also wanted it to be able to "snap" to each of the two views if the user stops scrolling between them. I added an if statement for that. I also added a shortcut so that if the user clicks the space bar then it will scroll between the two views.  
  
I wrote the function to draw the rows of bars for each panel, the clock and the calendar and called the functions with the information needed. This part took some trial and error. I wanted the current time value bars to have a label in case the user wasn't understanding the clock. I added a click toggle so that you can turn these on and off by clicking your mouse. 


---


