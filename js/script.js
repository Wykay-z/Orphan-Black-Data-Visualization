/**
 * Created by wykay-z on 28/12/16.
 */

    // [0]bg,[1]Sarah, Alison, Helena, Rachel, Beth, Katja, [8]Tony
var colorArr = ["#f0f4f7","#1da4d1","#f41c54","#ffcd00","#36bf63","#9875b2","#95a673","#f94c28","#9d6741",]

var data;
var dataOne;
var dataTwo;

var $mainGantt = $('#mainGantt');

var $gantt = $('#characGantt');
//var gantt_data_url = "data/obtimes.csv";

var $barcharts = $('#barcharts');
//var barcharts_data_url = "data/CharsE1-20.csv";

var $barcharts = $('#mainBar');

var $linechart = $('#linechart');
//var linechart_data_url = "data/totaltime.csv";


$(window).load(function(){
    if(Modernizr.svg) {
// 使用本地json
        overlapdraw();
			ganttdraw();
			mainbardraw();
			bardraw();

// 加载csv
//        d3.csv(linechart_data_url, function(error, times){
//            data = times;
//            linedraw();
//        });

//        d3.csv(gantt_data_url, function(error, minutes) {
//            data = minutes;
//            ganttdraw();
//        });

//        d3.csv(barcharts_data_url, function(error, data1) {
//						d3.csv(linechart_data_url, function(error, data2){
//								dataOne = data1;
//								dataTwo = data2;
//            		mainbardraw();
//						})
//        });
				
//        d3.csv(barcharts_data_url, function(error, minutes) {
//            data = minutes;
//            bardraw();
//        })
    }
});



//绘制全部甘特图
function overlapdraw() {
    overlapbuild("#mainGantt");
    var allbars = d3.selectAll(".overlapbar");
		var allImgs = d3.selectAll(".legendImg");
    allbars.on("mouseover", function(){
        var moused_id = this.id;
        allbars.classed("selected", function(){
						allbars.attr("opacity", .1);
						return moused_id === this.id;
        });
        allImgs.classed("selected", function(){
						allImgs.attr("opacity", .1);
						return moused_id +"Img" === this.id;
        });
        
    });
    allbars.on("mouseout", function(){
        allbars.classed("selected", false);
        allImgs.classed("selected", false);
				allImgs.attr("opacity", .4);
				allbars.attr("opacity", .4);
    })
}

function overlapbuild(id) {
    var data = mainGanttJson;
		data = data.filter(function (d) {
					return d.character !== "Beth" && d.character !== "Katja";
			});
    var margin = {
            top: 160,
            right: 20,
            bottom: 40,
            left: 50
        },
        numticks = 9,
        padding = 40;
    var width = 800;
    var height= 400;
    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');
    function formatXAxis(d) {
        var s = formatAxis(d);
        return d === x.domain()[1] ? s + " minutes" : s;
    }

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .6);

    var x = d3.scale.linear()
        .domain([0, 40])
        .range([padding, width - padding]);

    y.domain(data.map(function (d) {
        return d.episode;
    }));

    var legendlabs = ["Sarah", "Alison", "Helena", "Cosima", "Rachel", "Tony"];

    var xAxis = d3.svg
				.axis()
        .scale(x)
        .tickSize(height)
        .tickFormat(formatXAxis)
				.orient("bottom")
        .ticks(numticks);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .innerTickSize(0);
	
    var gx = svg.append("g")
        .attr("class", "x axis")
        //.attr("transform", "translate(0," - height + ")")
        .call(xAxis);

    gx.selectAll("g").filter(function (d) {
        return d;
    })
        .classed("minor", true);



    var gy = svg.append("g")
        .attr("class", "axis yAxis")
        .attr("transform", "translate(" + (padding-10) + ",0)")
        .call(yAxis);
	
	
		svg.append("g")
				.append("rect")
				.attr("x",-20)
				.attr("y", 0)
        .attr("width", 30)
        .attr("height", 196)
				.attr("fill", "#ffffff");		
		svg.append("g")
				.append("rect")
				.attr("x",-20)
				.attr("y", 204)
        .attr("width", 30)
        .attr("height", 196)
				.attr("fill", "#ffffff");

    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle2")
				.attr("transform", "rotate(-90)")
        .attr("x", -140)
        .attr("y", function (d) {
            return y(6) -110;
        })
        .text(function (d) {
            return "Season 1";
        });
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle2")
				.attr("transform", "rotate(-90)")
        .attr("x", -340)
        .attr("y", function (d) {
            return y(6) -110;
        })
        .text(function (d) {
            return "Season 2";
        });
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", function (d) {
            return x(0);
        })
        .attr("y", height + 30)
        .text(function (d) {
            return "Timeline of episode";
        });
	

		


    var legend = svg.selectAll("g.legend")
        .data(legendlabs)
        .enter()
        .append("g");

    var l_w = 100;
    l_h = 30;

    legend.append("rect")
        .attr("id", function(d){
            return d;
        })
        .attr("x", function(d, i){
            return (i * l_w) + width / 4 - 70;
        })
        .attr("y", -50)
        .attr("width", 80)
        .attr("height", l_h)
        .attr("class", "legendbar overlapbar")
				.attr("stroke", function(d, i){
						return colorArr[i+1];
				})
				.attr("fill", function(d, i){
						return colorArr[i+1];
				});

    legend.append("text")
        .attr("id", function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return (i * l_w) + width / 4-50;
        })
        .attr("y", -30)
        .attr("class", "legend")
        .text(function (d, i) {
            return legendlabs[i];
        })
				.attr("fill", "#fff");
		
	legend.append("svg:image")
    .attr("xlink:href", function(d, i){
				return "img/sm_" + i + ".png";
		})
		.attr("id", function(d){
				return d+"Img";
		})
		.attr("class", "legendImg")
    .attr("width", 80)
    .attr("height", 100)
		.attr("x", function(d, i){
				return (i * l_w) + width / 4 -70;
		})
		.attr("y", -150)
		.attr("opacity", .5);
	
    svg.append("g")
        .append("line")
        .attr("class", "labelline")
        .attr("y1", function (d) {
            return y(11)-6;
        })
        .attr("y2", function (d) {
            return y(11)-6;
        })
        .attr("x1", -45)
        .attr("x2", function (d) {
            return x(43);
        });

    var segment = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    segment.append("rect")
        .attr("id", function(d){
            return d.character;
        })
        .attr("fill", function(d){
            switch(d.character){
                case "Sarah":
                    return colorArr[1];
                    break;
                case "Alison":
                    return colorArr[2];
                    break;
                case "Helena":
                    return colorArr[3];
                    break;
                case "Cosima":
                    return colorArr[4];
                    break;
                case "Rachel":
                    return colorArr[5];
                    break;
                case "Tony":
                    return colorArr[6];
                    break;
                default:
                    return colorArr[1];
            }
        })
        .attr("opacity", 0.4)
        .attr("class", "overlapbar")
				.attr("rx", 4)
				.attr("ry", 4)
        .attr("y", function(d){
            return y(d.episode);
        })
        .attr("height", y.rangeBand())
        .attr("x", function(d){
            return x(d.startmin);
        })
        .attr("width", function(d){
            return x(d.stopmin) - x(d.startmin);
        });

}






// 绘制各个角色甘特图

function ganttdraw() {
    var margin = {
            top: 45,
            right: 15,
            bottom: 20,
            left: 15
        },
        padding = 10;
    var width = 200;
    var height = 100;

    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');
		var data = obtimes;
    data = data.filter(function (d) {
        return d.character !== "Rachel" && d.character !== "Tony" && d.character !== "Beth" && d.character !== "Katja";
    });
    // 把character拎出来作为主要检索key????
    var characters = d3.nest()
        .key(function(d){
            return d.character;
        })
        .entries(data);

    // x,y比例尺
    var x = d3.scale.linear()
        .domain([0, 40])
        .range([padding, width])
    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .6);
    y.domain(data.map(function(d){
        return d.episode;
    }))

    // 坐标轴
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(height)
//        .tickFormat(formatAxis)
        .orient("bottom")
        .ticks(5);


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
//                    return "Episode " + d.episode + "</br>" + d.character + " as " + d.charas;
            return "Episode " + d.episode + "</br>" + d.character;
        })

    // 为每个角色创建一个Svg
    var svg = d3.select("#characGantt").selectAll("svg")
        .data(characters)
        .enter()
        .append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // 坐标轴及文字
    var gx = svg.append("g")
        .attr("class", "xAxis axis")
        //.attr("transform", "translate(0," - height + ")")
        .call(xAxis);

    gx.selectAll("g").filter(function (d) {
        return d;
    })
        .classed("minor", true);


//    svg.append("g")
//        .append("text")
//        .attr("class", "seasonTitle")
//				.attr("transform", "rotate(-90)")
//        .attr("x", -30)
//        .attr("y", function (d) {
//            return y(5) -12;
//        })
//        .text(function (d) {
//            return "S1";
//        });
//    svg.append("g")
//        .append("text")
//        .attr("class", "seasonTitle")
//				.attr("transform", "rotate(-90)")
//        .attr("x", -70)
//        .attr("y", function (d) {
//            return y(5) -12;
//        })
//        .text(function (d) {
//            return "S2";
//        });

    svg.append("g")
        .append("line")
        .attr("class", "lableline")
        .attr("y1", function (d) {
            return y(11);
        })
        .attr("y2", function (d) {
            return y(11);
        })
        .attr("x1", -7)
        .attr("x2", function (d) {
            return x(43);
        });

    //Title for each chart
		svg.append("g")
				.append("rect")
				.attr("class", "titleBox")
				.attr("x", padding-1)
				.attr("y", -24)
				.attr("width", 80)
				.attr("height", 24)
				.attr("fill", "#fff");
    svg.append("g")
        .append("text")
        .attr("class", "chartTitle")
        .attr("x", padding+10)
        .attr("y", -6)
        .text(function (d) {
            return d.key;
        });



    svg.selectAll(".bar")
        .data(function(d){
            return d.values;
        })
        .enter()
        .append("rect")
				.attr("rx", 2)
        .attr("class", "bar")
        .attr("y", function(d) {
            return y(d.episode);
        })
        .attr("height", y.rangeBand())
        .attr("x", function(d){
            return x(d.startmin);
        })
        .attr("width", function(d){
            return x(d.stopmin)-x(d.startmin);
        })
        .attr("fill", function(d){
            switch(d.character){
                case "Sarah":
                    return colorArr[1];
                    break;
                case "Alison":
                    return colorArr[2];
                    break;
                case "Helena":
                    return colorArr[3];
                    break;
                case "Cosima":
                    return colorArr[4];
                    break;
                case "Rachel":
                    return colorArr[5];
                    break;
                default:
                    return colorArr[6];
            }
        })
        .attr("opacity", .7)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.call(tip);

}






//绘制全部条形图
function mainbardraw() {
	var dataOne = chars;
	var dataTwo = totaltime;
    var margin = {
        top: 80,
        right: 40,
        bottom: 40,
        left: 40
    };

    var width=560;
    var height = 320;
    var padding = -30;

    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');
    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + " mins" : s;
    }
    // 处理数据
    dataOne = dataOne.filter(function (d) {
        return d.character == "All Tatiana Maslany Clones";
    })
		console.log(dataOne);

    var characters = d3.nest()
        .key(function (d) {
            return d.character;
        })
        .entries(dataOne);

    // 创建xy比例尺
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .5);
    var y = d3.scale.linear()
        .domain([0, 50])
        .range([height, 0]);

    x.domain(dataOne.map(function (d) {
        return d.episode;
    }))


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return d.character + "</br>Episode " + d.episode + "<br/>" + formatMinutes(d.minutes) + " minutes";
        })

    // 为每个角色创建svg
    var svg = d3.select("#mainBar").selectAll("svg")
        .data(characters)
        .enter()
        .append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // 坐标轴
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat('')
        .orient("bottom")
        .innerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width - padding)
        .tickFormat(formatYAxis)
        .orient("right")
        .ticks(4);
    svg.append("g")
        .attr("class", "axis xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    var gy = svg.append("g")
        .attr("class", "yAxis axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
        return d;
    })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 0)
        .attr("dy", -4);

    //坐标文字
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.17 * width)
        .attr("y", height - padding - 10)
        .text(function (d) {
            return "Season 1";
        })
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.63 * width)
        .attr("y", height - padding - 10)
        .text(function (d) {
            return "Season 2";
        })

    //Title for each chart
    svg.append("g")
        .append("text")
        .attr("class", "mainBarTitle")
        .attr("x", width/2-120)
        .attr("y", -60)
        .text(function (d) {
            return "主演 Tat 总计出场时间与每集时长对比"
        });


    // 绘制bar底
    svg.selectAll(".barbottom")
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append("rect")
        .attr("class", "barbottom")
        .attr("x", function(d){
            return x(d.episode);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d){
            return y(d.minutes)+20;
        })
        .attr("height", function(d){
            return height - y(d.minutes)-20;
        })
				.attr("opacity", 1)
        .attr("fill", colorArr[8]); 
	
	// 绘制bar
    svg.selectAll(".bar")
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append("rect")
        .attr("class", "bar")
				.attr("rx", 6)
        .attr("x", function(d){
            return x(d.episode);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d){
            return y(d.minutes);
        })
        .attr("height", function(d){
            return height - y(d.minutes);
        })
				.attr("opacity", 1)
        .attr("fill", colorArr[8])
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.call(tip);
	
	
		var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return "Episode " + d.episode + "<br/>" + formatMinutes(d.epmin) + " minutes";
        })
	
		dataTwo.forEach(function(d){
				d.episode = d.episode;
        d.epmin = d.epmin;
    })

    // 映射绘制点的x,y坐标值
    var xA = d3.scale.linear()
        .range([-padding-5, width+padding+5])
        .domain([1,20]);
    var yA = d3.scale.linear()
        .range([height, 0])
        .domain([0, 50]);

    var line = d3.svg.line()
        .x(function(d) {
            return xA(d.episode);
        })
        .y(function(d){
            return yA(d.epmin);
        });
    // draw dots
	
    svg.append("path")
        .attr("class", "chartline")
        .attr("d", line(dataTwo))
        .attr("fill", "none")
        .attr("stroke", colorArr[6]);
    svg.selectAll("dot")
        .data(dataTwo)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("fill", colorArr[6])
        .attr("cx", function(d){
            return xA(d.episode);
        })
        .attr("cy", function(d){
            return yA(d.epmin);
        })
				.on('mouseover', tip2.show)
        .on('mouseout', tip2.hide);

    svg.call(tip2);


}




//绘制条形图
function bardraw() {
	var data = chars;
    var margin = {
        top: 45,
        right: 40,
        bottom: 40,
        left: 40
    };

    var width=320;
    var height = 140;
    var padding = -30;

    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');
    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + " mins" : s;
    }
    // 处理数据
    data = data.filter(function (d) {
        return d.character !== "Beth, Katja, and Tony" && d.character !== "All Tatiana Maslany Clones" && d.character !== "Rachel";
    })

    var characters = d3.nest()
        .key(function (d) {
            return d.character;
        })
        .entries(data);

    // 创建xy比例尺
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .5);
    var y = d3.scale.linear()
        .domain([0, 50])
        .range([height, 0]);

    x.domain(data.map(function (d) {
        return d.episode;
    }))


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return d.character + "</br>Episode " + d.episode + "<br/>" + formatMinutes(d.minutes) + " minutes";
        })

    // 为每个角色创建svg
    var svg = d3.select("#barcharts").selectAll("svg")
        .data(characters)
        .enter()
        .append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // 坐标轴
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat('')
        .orient("bottom")
        .innerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width - padding)
        .tickFormat(formatYAxis)
        .orient("right")
        .ticks(4);
    svg.append("g")
        .attr("class", "axis xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    var gy = svg.append("g")
        .attr("class", "yAxis axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
        return d;
    })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 0)
        .attr("dy", -4);

    //坐标文字
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.17 * width)
        .attr("y", height - padding - 10)
        .text(function (d) {
            return "Season 1";
        })
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.63 * width)
        .attr("y", height - padding - 10)
        .text(function (d) {
            return "Season 2";
        })

    //Title for each chart
    svg.append("g")
        .append("text")
        .attr("class", "chartTitle")
        .attr("x", width/2-20)
        .attr("y", -10)
        .text(function (d) {
            return d.key
        });


    // 绘制bar
    svg.selectAll(".barbottom")
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append("rect")
        .attr("class", "barbottom")
        .attr("x", function(d){
            return x(d.episode);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d){
            return y(d.minutes) +10;
        })
        .attr("height", function(d){
            return height - y(d.minutes) -10;
        })
				.attr("opacity", 1)
        .attr("fill", function(d){
            switch(d.character){
                case "Sarah":
                    return colorArr[1];
                    break;
                case "Alison":
                    return colorArr[2];
                    break;
                case "Helena":
                    return colorArr[3];
                    break;
                case "Cosima":
                    return colorArr[4];
                    break;
                case "Rachel":
                    return colorArr[5];
                    break;
                default:
                    return colorArr[6];
            }
        });
	
    svg.selectAll(".bar")
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append("rect")
        .attr("class", "bar")
				.attr("rx", 4)
        .attr("x", function(d){
            return x(d.episode);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d){
            return y(d.minutes);
        })
        .attr("height", function(d){
            return height - y(d.minutes);
        })
				.attr("opacity", 1)
        .attr("fill", function(d){
            switch(d.character){
                case "Sarah":
                    return colorArr[1];
                    break;
                case "Alison":
                    return colorArr[2];
                    break;
                case "Helena":
                    return colorArr[3];
                    break;
                case "Cosima":
                    return colorArr[4];
                    break;
                case "Rachel":
                    return colorArr[5];
                    break;
                default:
                    return colorArr[6];
            }
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    svg.call(tip);

}





// 绘制 曲线图
function linedraw() {
	var data = totaltime;
    var width = 600;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var padding = 20;
    var svg = d3.select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+ margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		
    data.forEach(function(d){
        d.episode = d.episode;
        d.tmaspact = +d.tmaspact;
    })

    // 映射绘制点的x,y坐标值
    var x = d3.scale.linear()
        .range([padding, width])
        .domain([1,20]);
    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, 1.3]);

    var line = d3.svg.line()
        .x(function(d) {
            return x(d.episode);
        })
        .y(function(d){
            return y(d.tmaspct);
        });
    // draw dots
    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("fill", colorArr[1])
        .attr("cx", function(d){
            return x(d.episode);
        })
        .attr("cy", function(d){
            return y(d.tmaspct);
        });
    svg.append("path")
        .attr("class", "chartline")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", colorArr[1]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .orient("left")
        .ticks(7, "%");
    var gy = svg.append("g")
        .attr("class", "axis yAxis")
        .call(yAxis);
    gy.selectAll("g").filter(function(d){
        return d;
    })
        .classed("minor", true);

    //Season labels for x axis
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.17 * width)
        .attr("y", height + padding)
        .text(function (d) {
            return "Season 1";
        })
    svg.append("g")
        .append("text")
        .attr("class", "seasonTitle")
        .attr("x", 0.63 * width)
        .attr("y", height + padding)
        .text(function (d) {
            return "Season 2";
        })

}


