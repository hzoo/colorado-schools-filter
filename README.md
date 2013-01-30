[Colorado Schools: Filter]
=========

![](http://i.imgur.com/dwJjaaZ.png)

Idea
---
- I wanted to create a simple, interactive visualization with minimal scrolling.
- Use the mouse to drag/create filters on the many variables in the data, which changes the histograms/map.
- You can make filters for each variable, letting one ask many questions.
- I also added a few example questions with links to get people started.

Purpose
---
- Given the data (school grades, demographics, location, etc)
 - Guide users through previous analysis (questions, observations).
 - Allowing filtering of relevant features (location, grades, demographics, etc) for their own exploration.

Future Features
---
- Add more questions and analysis
- Further filters
- Different views of the data
- Change colors/size of points on map

Used
---
- HTML, JS , CSS
- [Bootstrap], [jQuery]
- Libraries: [d3.js], [crossfilter.js], [topojson.js]
- Tools: [Sublime Text 2], [Yeoman]
- Data: [node.js] to parse csv's
- Hosting: [Heroku]


Feedback on data provided
---
- (1,2,3 = decrease, same, increase) in grades - isn't that helpful
- 1-13 = Grades F-A - use percentages?
- missing/inconsistent data

License
---

This Kaggle Entry is under [CC].

[Colorado Schools: Filter]: http://coloradoschools.herokuapp.com
[node.js]: http://nodejs.org
[Bootstrap]: http://twitter.github.com/bootstrap/
[jQuery]: http://jquery.com
[d3.js]: http://d3js.org/
[Heroku]: http://heroku.com
[crossfilter.js]: https://github.com/square/crossfilter
[topojson.js]: https://github.com/mbostock/topojson
[Sublime Text 2]:http://www.sublimetext.com/
[Yeoman]: http://yeoman.io
[CC]: http://creativecommons.org/licenses/by/3.0/