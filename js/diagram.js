var
    w = 1000,
    h = 800;
var vis;
var maxLevel = 0;
var reWidth = 0, reHeight = 0, spaceX = 50, spaceY = 50;

function showDiagram(source){
	vis = d3
        .select("#diagram")
        .append('svg:svg')
        .attr('height', h)
        .attr('width', w)

	var nodes = source.Components;
	var links = source.Connections;

	//draw split line
	drawDashedDotline(nodes);

	var y_pos_index = [];

	y_pos_index[0] = 1;

	//get order in each level
	for(var i=1;i<nodes.length;i++){
		var l = nodes[i].Level;
		if(nodes[i].Level==nodes[i-1].Level)
			y_pos_index[i] = y_pos_index[i-1]+1;
		else
			y_pos_index[i] = 1;
	}

	//Calculate rect width and height
	reWidth = (w - (2*spaceX)*maxLevel)/maxLevel ;
	var y_max_index = getMaxOfArray(y_pos_index);
	reHeight = (h - 2*spaceY*y_max_index)/y_max_index ;

	//draw links 
	for(var i=0;i<links.length;i++){
		var from = links[i].From-1;
		var to = links[i].To-1;

		var x1Pos = (w / maxLevel) * (nodes[from].Level-1) + spaceX + reWidth;
		var y1Pos = (y_pos_index[from] - 1 ) * (reHeight + spaceY) + spaceY * y_pos_index[from] + reHeight/2;

		var x2Pos = (w / maxLevel) * (nodes[to].Level-1) + spaceX;
		var y2Pos = (y_pos_index[to] - 1 ) * (reHeight + spaceY) + spaceY * y_pos_index[to] + reHeight/2;

		var link = vis.append("line")
            .attr("x1", x1Pos)
            .attr("y1", y1Pos)
            .attr("class", "link")
            .style("stroke-width", 3)
            .style("stroke", '#698775')
            .style('fill','#698775')
            .attr("x2", x2Pos)
            .attr("y2", y2Pos);
	}

    for(var i=0;i<nodes.length;i++){
		var xPos = (w / maxLevel) * (nodes[i].Level-1) + spaceX;
		var yPos = (y_pos_index[i] -1 ) * (reHeight + spaceY) + spaceY * y_pos_index[i];

		//Draw the Rectangle
		var rectangle = vis.append("rect")
	        .attr("x", xPos)
	        .attr("y", yPos)
	        .attr("width", reWidth)
	        .attr('rx',15)
	        .attr('ry',15)
	        .attr('fill','#fff')
	        .attr('stroke','#648bb6')
	        .attr("height", reHeight);

	    //Show TextLabel
	    var text = vis.append('text')
	    	.attr('x', xPos + reWidth/2)
	    	.attr('y', yPos + reHeight/2)
	    	.style('text-anchor', 'middle')
	    	.text(nodes[i].Name);

	}
}

//Draw dashed dot line to divide into levels.
function drawDashedDotline(nodes){
	if(nodes.length){
		for(var i=0;i<nodes.length;i++){
			var level = parseInt(nodes[i].Level);
	        if(maxLevel < level){
	            maxLevel = level;
	        }
		}
	}
	
	for(var i=1;i<maxLevel;i++){
		var xPos = (w / maxLevel) * i;
		var split = vis.append("line")
            .attr("x1", xPos)
            .attr("y1", 30)
            .attr("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .attr("x2", xPos)
            .attr("y2", h-30);
	}
}

//Return max value of array
function getMaxOfArray(numArray) {
  	return Math.max.apply(null, numArray);
}

