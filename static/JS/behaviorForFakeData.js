var dafaultName;

function setName(value){
    dafaultName = value;
}

function defaultValue(){
    d3.json('static/TOOLS/fake_data/file.json', function(t){
        setName(t.nodes[0].id);
    })
} 

defaultValue();       
//console.log(dafaultName);


function referenceForHeatMap(){
    /**
     * this function sets the references value for the heat map
     */
    return [{'id' : 0, 'level' : 'notion'}, {'id' : 1, 'level' : 'application'},{'id' : 2,'level' : 'maitrise'},{'id' : 3, 'level' : 'expert'}]
}


function dataForHeatMap(skill_data){
    /** 
     * 
    */
   var res = [];
   for (var index=0; index<skill_data.children.length; index++){
       var ele_chosen = skill_data.children[index];
       for (var i=0; i<ele_chosen.children.length; i++){
        res.push({'group' : ele_chosen.children[i].name,'subject' :  ele_chosen.name, 'value' : ele_chosen.children[i].value});
       }
        
   }
   var subjects =  Array.from(new Set(res.map(d => d.subject)));
   var skills = Array.from(new Set(res.map(d => d.group)));
   return [res, subjects, skills];
}



function drawHeatMap(){
    // set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 100},
width = 800 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

//Read the data
d3.json("static/TOOLS/fake_data/skillData.json", function(data) {
// append the svg object to the body of the page
d3.select("#draw_content_req").html("<div id='draw_content_req'></div>");
const svg = d3.select("#draw_content_req").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    

// Labels of row and columns
var myGroups = dataForHeatMap(data)[2];
var myVars = dataForHeatMap(data)[1];

// Build X scales and axis:
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);
    svg.append("g")
    .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
    .range(["#FFC0B3", "#FF5733"])
    .domain([0,3]);

svg.selectAll()
    .data(dataForHeatMap(data)[0])
    .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.group) })
            .attr("y", function(d) { return y(d.subject) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} );
    //Append color legend using legendData
    svg.append('g')
        .selectAll('g')
        .data(referenceForHeatMap()).enter()
        .append('rect')
        .attr('width', 30)
        .attr('height', 20)
        .attr('x', 850)
        .attr('y', (d, i) => { return i * 30 + 10;})
        .style('fill', d => {return myColor(d.id); });

    //Append text labels for legend from legendData
    svg.append('g')
        .selectAll('text')
        .data(referenceForHeatMap()).enter().append('text')
        .attr('x', 890)
        .attr('y', (d, i) => { return i * 30 + 25;})
        .text(d => {return d.level; });

})
}


function isIn(element, list){
            /**
             * this function tells us if element is in list
             * 
             * parameter:
             * -----------
             *      element : str
             *      list : list
             * 
             * return:
             * --------
             *      capt : boolean
             */
            let capt = false
            for(var compteur=0; compteur<list.length; compteur++){
                capt = element.toLowerCase()===list[compteur].toLowerCase(); 
            }
            return capt;
}
        
        
function sort_node_data(data){
            /**
             * sets a list of node in which each 
             * group is represented only one time
             * 
             * parameter : 
             * ------------
             *         data : list
             * 
             * return : 
             * ---------
             *      liste_res : list
             */
            let list_sem = [];
            let liste_res = [];
            for (let i=0; i<data.length; i++){
                const node_val = data[i];
                if (isIn(node_val.group,list_sem)){
                    // pass
                }
                else{
                    liste_res.push(node_val);
                }
                list_sem.push(node_val.group);
            }
            return liste_res;
}
        
         
function drawCh(data){
            /**
             * draws a chronological graph.
             * 
             * parameters:
             * ------------
             *      data : json object
             *         data of the relations between module and competence 
             * 
             * returns:
             * --------
             *      Sunburst graph
             */
            var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
            var format = d3.format(",d");
            var width = 486;
            var radius = width / 6;
            var arc = d3.arc()
                        .startAngle(d => d.x0)
                        .endAngle(d => d.x1)
                        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                        .padRadius(radius * 1.5)
                        .innerRadius(d => d.y0 * radius)
                        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

            partition = data => {
                const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.value - a.value);
                return d3.partition()
                    .size([2 * Math.PI, root.height + 1])
                    (root);
                }

            const root = partition(data);

            root.each(d => d.current = d);

            d3.select("#draw_content_req").html("<div id='draw_content_req'><div id='llll'></div></div>");
            const svg = d3.select("#llll").append("svg")
                .attr("viewBox", [0, 0, width, width])
                .style("font", "10px sans-serif");

            const g = svg.append("g")
                .attr("transform", `translate(${width / 2},${width / 2})`);

            const path = g.append("g")
                            .selectAll("path")
                            .data(root.descendants().slice(1))
                            .enter()
                            .append("path")
                                .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
                                .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                                .attr("d", d => arc(d.current));

            path.filter(d => d.children)
                .style("cursor", "pointer")
                //.on("click", clicked);

            path.append("title")
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

            const label = g.append("g")
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle")
                .style("user-select", "none")
                .selectAll("text")
                .data(root.descendants().slice(1))
                .enter()
                .append("text")
                    .attr("dy", "0.35em")
                    .attr("fill-opacity", d => +labelVisible(d.current))
                    .attr("transform", d => labelTransform(d.current))
                    .text(d => d.data.name);

            const parent = g.append("circle")
                .datum(root)
                .attr("r", radius)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                //.on("click", clicked);
            
                /*function clicked(event, p) {
                    parent.datum(p.parent || root);
                
                    root.each(d => d.target = {
                      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                      y0: Math.max(0, d.y0 - p.depth),
                      y1: Math.max(0, d.y1 - p.depth)
                    });
                
                    const t = g.transition().duration(750);
                
                    // Transition the data on all arcs, even the ones that aren’t visible,
                    // so that if this transition is interrupted, entering arcs will start
                    // the next transition from the desired position.
                    path.transition(t)
                        .tween("data", d => {
                          const i = d3.interpolate(d.current, d.target);
                          return t => d.current = i(t);
                        })
                      .filter(function(d) {
                        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                      })
                        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                        .attrTween("d", d => () => arc(d.current));
                
                    label.filter(function(d) {
                        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                      }).transition(t)
                        .attr("fill-opacity", d => +labelVisible(d.target))
                        .attrTween("transform", d => () => labelTransform(d.current));
                  }*/

            function arcVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
            }

            function labelVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
            }

            function labelTransform(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2 * radius;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            }

}


function moduleAchieving(data, objectSkill){
            /**
            * this function sets a list of subject achieving the current skill
            * 
            * parameter:
            * -----------
            *     data : json object
            *         data of the relations between module and competence
            *     objectSkill : json object
            *         data containing informations about the skill we study
            * 
            * return:
            * ---------
            *     list of subject name 
            */
            let index;
            let list = [];
            for (index=0; index<data.children.length; index++){
                for (var i=0; i<data.children[index].children.length; i++){
                    if (data.children[index].children[i].name === objectSkill.name){
                        list.push({'name' : data.children[index].name, "value" : data.children[index].children.length});
                    }
                }
            }
            return list
}
    
               
function rate(data, list){
            /**
             * compute the percentage
             * 
             * parameter:
             * ----------
             *      data : json object
             *          data of the relations between module and competence
             *      list : list
             *          list of name
             * 
             * return:
             * -------
             *      float 
             */
            return (list.length/data.length)*100;
}

                
function drawRate(rate){
            /**
             * draws the rate graph
             * 
             * parameter:
             * -----------
             *      rate : float
             * 
             * return : 
             * ---------
             *      graph
             */
            d3.select("#info_skill_graph_body").html("<div class='circle-chart circle-chart--with-track'>"+ rate.toString().slice(0,5) +"%</div>");
            var el = document.querySelector('.circle-chart--with-track');
            var demo = new CircleChart(el);
}

                
function __specificDraw__(graph){
            /**
             * this function draws a prerequisite network graph for a specific node
             * 
             * parameter:
             * -----------
             *      graph : json object
             *          data set containing nodes and links between them
             *      node_name : str
             *          node name
             * return:
             * --------
             *      network graph
            */
             d3.select("#draw_content_req").html("<div id='draw_content_req'><svg id='first_svg' width=900 height=500></svg></div>");

             const svg = d3.select("#first_svg"),
             width = +svg.attr("width"),
             height = +svg.attr("height");
 
             svg.attr("viewBox", [3, 6, width, 500]);
 
             const color = d3.scaleOrdinal(d3.schemeCategory20);
 
             const simulation = d3.forceSimulation()
                 .force("link", d3.forceLink().id(function (d) {
                     return d.id;
                 }))
                 .force("charge", d3.forceManyBody())
                 .force("center", d3.forceCenter(width / 2, height / 2));
             
               svg.append("defs").selectAll("marker")
                 .data(["orientation"])
               .enter().append("marker")
                 .attr("id", function(d) { return d; })
                 .attr("viewBox", "0 -5 10 10")
                 .attr("refX", 25)
                 .attr("refY", 0)
                 .attr("markerWidth", 6)
                 .attr("markerHeight", 6)
                 .attr("orient", "auto")
               .append("path")
                 .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
                 .style("stroke", "#4679BD")
                 .style("opacity", "0.6");
             const link = svg.append("g")
                 .attr("class", "links")
                 .selectAll("line")
                 .data(graph.links)
                 .enter().append("line")
                 .attr("stroke-width", 1)
                 .style("marker-end",  "url(#orientation)");
 
             const node = svg.append("g")
                 .attr("class", "nodes")
                 .selectAll("g")
                 .data(graph.nodes)
                 .enter().append("g");
 
             const circles = node.append("circle")
                 .attr("r", 7)
                 .attr("fill", function (d) {
                     return color(d.group);
                 })
                 .call(d3.drag()
                     .on("start", dragstarted)
                     .on("drag", dragged)
                     .on("end", dragended));
 
             const labels = node.append("text")
                 .text(function (d) {
                     return d.id;
                 })
                 .attr('x', 6)
                 .attr('y', 3);
 
             node.append("title")
                   .text(function(d) { return d.id; });
 
             circles.on("click", function(d){
                 draw(d.id);
             })
 
 
             // Add one dot in the legend for each name.
             const size = 20;
             svg.selectAll("mydots")
                 .data(sort_node_data(graph.nodes))
                   .enter()
                   .append("rect")
                     .attr("x", 100)
                     .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                     .attr("width", size)
                     .attr("height", size)
                     .style("fill", function(d){ return color(d.group)});
 
 
             // Add one dot in the legend for each name.
             svg.selectAll("mylabels")
               .data(sort_node_data(graph.nodes))
               .enter()
               .append("text")
                 .attr("x", 100 + size*1.2)
                 .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                 .style("fill", function(d){ return color(d.group)})
                 .text(function(d){ return d.group})
                 .attr("text-anchor", "left")
                 .style("alignment-baseline", "middle");
                       simulation
                           .nodes(graph.nodes)
                           .on("tick", ticked);
 
                       simulation.force("link")
                           .links(graph.links);
 
               function ticked() {
                 link
                     .attr("x1", function(d) { return d.source.x; })
                     .attr("y1", function(d) { return d.source.y; })
                     .attr("x2", function(d) { return d.target.x; })
                     .attr("y2", function(d) { return d.target.y; });
 
                 node
                     .attr("transform", function(d){
                       return "translate(" + d.x + "," + d.y + ")";
                     })
 
               }
 
             optArray = Array.from(new Set(graph.nodes.map(d => d.id)));
             const autoCompleteJS = new autoComplete({
                         selector: "#autoComplete",
                         placeHolder: "Search subject...",
                         data: {
                             src: optArray,
                             cache: true,
                         },
                         resultsList: {
                             element: (list, data) => {
                                 if (!data.results.length) {
                                     // Create "No Results" message element
                                     const message = document.createElement("div");
                                     // Add class to the created element
                                     message.setAttribute("class", "no_result");
                                     // Add message text content
                                     message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                                     // Append message element to the results list
                                     list.prepend(message);
                                 }
                             },
                             noResults: true,
                         },
                         resultItem: {
                             highlight: true
                         },
                         events: {
                             input: {
                                 selection: (event) => {
                                     const selection = event.detail.selection.value;
                                     autoCompleteJS.input.value = selection;
                                     console.log(redefineNodes(graph, autoCompleteJS.input.value));
                                     __specificDraw__(redefineNodes(graph, autoCompleteJS.input.value));
                                     //console.log(autoCompleteJS.input.value);
                                 }
                             }
                         }
                     });
                    
 
             d3.select("#button_tag").on("click", function(){
                 console.log(document.getElementById('serach_tag').value);
             });
 
             function dragstarted(d) {
               if (!d3.event.active) simulation.alphaTarget(0.3).restart();
               d.fx = d.x;
               d.fy = d.y;
             }
 
             function dragged(d) {
               d.fx = d3.event.x;
               d.fy = d3.event.y;
             }
 
             function dragended(d) {
               if (!d3.event.active) simulation.alphaTarget(0);
               d.fx = null;
               d.fy = null;
             }
 
             draw();
}

                
function redefineNodes(data, node_name){
            /** 
             * create a json object
             * 
             * parameter:
             * -----------
             *      data : json object
             *          data set containing nodes and links between them
             *      node_name : str
             *          node name
             * return:
             * --------
             *     json object 
            */
            let list_nodes, list_links;
            list_nodes = [];
            list_links = [];

            for (var i=0; i<data.links.length; i++){
                //console.log(data.links[i]);
                if (data.links[i].source.id === node_name || data.links[i].target.id === node_name){
                    list_links.push(data.links[i]);
                    list_nodes.push(data.links[i].source);
                    list_nodes.push(data.links[i].target);

                }
            }
            return {nodes : list_nodes, links : list_links};
}

                
function writeInfoSkill(data, skill){
            /**
             * writes the skill's descriptions
             * 
             * parameter:
             * -----------
             *    data : list
             *       skill's description
             *    skill : str
             *       skill chosen
             * 
             * return:
             * --------
             *     None
             */
            d3.select("#info_skill_body").html('<div id="info_skill_body">'+
                                                '<h5>Skill selected : <span class="text-primary">'+ skill + '</span></h5>'+
                                                '<p>List of modules validating the selected skill: </p>'+
                                                '<div id="info_skill_body_text"></div>'+
                                                '</div>');
            //d3.select("#info_skill_body_text").append("h5").text("Compétence : " + skill);
            d3.select("#info_skill_body_text").append("ul").classed("list-group", true);
            for (var index=0; index<data.length; index++){
                d3.select("#info_skill_body_text").append("li")
                    .classed("list-group-item", true)
                        .text(data[index].name);
            }
            
}

                
function draw(name = dafaultName){
            /**
             * draws the skill graph
             * 
             * parameter:
             * -----------
             *        name : str
             *           subject's name
             * 
             * return:
             * --------
             *        None
             */
            let selected_data = "";
            d3.json('static/TOOLS/fake_data/skillData.json', function(skill_data_graph) {
            let index;
            for (index=0; index<skill_data_graph.children.length; index++){
                if (skill_data_graph.children[index].name === name){
                    selected_data = skill_data_graph.children[index];
                    //console.log(selected_data);
                    const dx = 10;
                    width = 936;
                    const dy = width / 6;
                    const margin = ({top: 10, right: 120, bottom: 10, left: 80});
                    //console.log(selected_data);
                    const root = d3.hierarchy(selected_data);
                    const tree = d3.tree().nodeSize([dx, dy]);
                    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

                      root.x0 = dy / 2;
                      root.y0 = 0;
                      root.descendants().forEach((d, i) => {
                        d.id = i;
                        d._children = d.children;
                        if (d.depth && d.data.name.length !== 7) d.children = null;
                      });

                      d3.select("#draw_skill_graph").html("<div id='drw'><h2 id='title_sub_part'>Skills graph</h2></div>");
                      const second_svg = d3.select("#draw_skill_graph").append("svg")
                          .attr("viewBox", [-margin.left, -margin.top, width, dx])
                          .style("font", "10px sans-serif")
                          .style("user-select", "none");

                      const gLink = second_svg.append("g")
                          .attr("fill", "none")
                          .attr("stroke", "#555")
                          .attr("stroke-opacity", 0.4)
                          .attr("stroke-width", 1.5);

                      const gNode = second_svg.append("g")
                          .attr("cursor", "pointer")
                          .attr("pointer-events", "all");

                    function update(source) {
                        const duration = d3.event && d3.event.altKey ? 2500 : 250;
                        const nodes = root.descendants().reverse();
                        const links = root.links();

                        // Compute the new tree layout.
                        tree(root);

                        let left = root;
                        let right = root;
                        root.eachBefore(node => {
                          if (node.x < left.x) left = node;
                          if (node.x > right.x) right = node;
                        });

                        const height = right.x - left.x + margin.top + margin.bottom;

                        const transition = second_svg.transition()
                            .duration(duration)
                            .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                            .tween("resize", window.ResizeObserver ? null : () => () => second_svg.dispatch("toggle"));

                        // Update the nodes…
                        const node = gNode.selectAll("g")
                          .data(nodes, d => d.id);

                        node.on("click", function(d){
                            var selected_skill_name = selected_data.children[d.id -1];
                            console.log(moduleAchieving(skill_data_graph, selected_skill_name))
                            writeInfoSkill(moduleAchieving(skill_data_graph, selected_skill_name), selected_skill_name.name);
                            drawRate(rate(skill_data_graph.children, moduleAchieving(skill_data_graph, selected_skill_name)));
                        })

                        // Enter any new nodes at the parent's previous position.
                        const nodeEnter = node.enter().append("g")
                            .attr("transform", d => `translate(${source.y0},${source.x0})`)
                            .attr("fill-opacity", 0)
                            .attr("stroke-opacity", 0)
                            .on("click", (event, d) => {
                              d.children = d.children ? null : d._children;
                              update(d);
                            });

                        nodeEnter.append("circle")
                            .attr("r", 4)
                            .attr("fill", d => d._children ? "#555" : "#999")
                            .attr("stroke-width", 10);

                        nodeEnter.append("text")
                            .attr("dy", "0.31em")
                            .attr("x", d => d._children ? -6 : 6)
                            .attr("text-anchor", d => d._children ? "end" : "start")
                            .text(d => d.data.name)
                          .clone(true).lower()
                            .attr("stroke-linejoin", "round")
                            .attr("stroke-width", 3)
                            .attr("stroke", "white");

                        // Transition nodes to their new position.
                        const nodeUpdate = node.merge(nodeEnter).transition(transition)
                            .attr("transform", d => `translate(${d.y},${d.x})`)
                            .attr("fill-opacity", 1)
                            .attr("stroke-opacity", 1);

                        // Transition exiting nodes to the parent's new position.
                        const nodeExit = node.exit().transition(transition).remove()
                            .attr("transform", d => `translate(${source.y},${source.x})`)
                            .attr("fill-opacity", 0)
                            .attr("stroke-opacity", 0);

                        // Update the links…
                        const link = gLink.selectAll("path")
                          .data(links, d => d.target.id);

                        // Enter any new links at the parent's previous position.
                        const linkEnter = link.enter().append("path")
                            .attr("d", d => {
                              const o = {x: source.x0, y: source.y0};
                              return diagonal({source: o, target: o});
                            });

                        // Transition links to their new position.
                        link.merge(linkEnter).transition(transition)
                            .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition(transition).remove()
                            .attr("d", d => {
                              const o = {x: source.x, y: source.y};
                              return diagonal({source: o, target: o});
                            });

                        // Stash the old positions for transition.
                        root.eachBefore(d => {
                          d.x0 = d.x; 
                          d.y0 = d.y;
                        });
                      }

                      update(root);
                }
            }
            __writeSkillComment__(name, selected_data);
            writeInfoSkill(moduleAchieving(skill_data_graph, skill_data_graph.children[0].children[0]), skill_data_graph.children[0].children[0].name);
            drawRate(rate(skill_data_graph.children, moduleAchieving(skill_data_graph, skill_data_graph.children[0].children[0])));
        });
}

        
function __mainDraw__(){
            /**
             * draws the prerequisit network graph
             * 
             * parameter:
             * -----------
             *      None
             * 
             * return:
             * --------
             *      None
             */
            d3.json('static/TOOLS/fake_data/file.json', function(error, graph){
                if (error) throw error;
                __specificDraw__(graph);
            })
}


function __chronologicalDrawing__(){
    /** */
    d3.json("static/TOOLS/fake_data/file.json", function(data){
        var list_semester = Array.from(new Set(data.nodes.map(d => d.group)));
        var list_links, list_nodes;
        list_links = [];
        list_nodes = data.nodes;
        for (var index1=0; index1<list_semester.length; index1++){
            // add semester node
            list_nodes.push({'id' : list_semester[index1],
                            'group' : 'semester'});
        }
        for (var index=0; index<data.nodes.length; index++){
            list_links.push({'source' : data.nodes[index].id,
                            'target' : data.nodes[index].group,
                            'value' : 1});

        }
        __specificDraw__({'nodes':list_nodes, 'links':list_links}, list_nodes[0].id);

    })

}

                    
function __writeSkillComment__(name = dafaultName, selected_data){
            /**
             * writes skill comment
             * 
             * parameter:
             * ----------
             *      name : str
             *          subject's name
             *      selected_data : json data
             *          containing information about skills achieving by the name
             * 
             * return:
             * --------
             *      None
             */
            d3.select("#skill_comments").html("<div id='drw'></div>");
            d3.json('static/TOOLS/fake_data/skillComment.json', function(data){
                const set = data.set;
                for(var v=0; v<selected_data.children.length; v++){
                    for(var expl_index=0; expl_index<set.length; expl_index++){
                        if (selected_data.children[v].name === set[expl_index].name){
                            d3.select("#skill_comments")
                                .insert("p")
                                .text(set[expl_index].name + " : " + set[expl_index].value);
                        }
                    }
                 }
            });        
}


function __processSkillGraph__(name = dafaultName){
            /**
             * skill process
             * 
             * parameter:
             * -----------
             *      name : str
             * 
             * return:
             * --------
             *      None
             */
            console.log("process skill graph");
            let selected_data = "";
            d3.json('static/TOOLS/fake_data/skillData.json', function(skill_data_graph) {
                let index;
                for (index = 0; index < skill_data_graph.children.length; index++) {
                    if (skill_data_graph.children[index].name === name) {
                        selected_data = skill_data_graph.children[index];
                    }
                }
                //console.log(selected_data.children);
                __drawSkillGraph__(selected_data.children);
                __writeSkillComment__(name, selected_data);
            });
}

//i have to modify
function __drawSkillGraph__(data) {
            /**
             * draw skill graph
             * 
             * parameter:
             * -----------
             *      data : json object
             * 
             * return:
             * ---------
             *      None
             * 
             */

            d3.select("#draw_skill_graph").html("<div id='drw'><h2 id='title_sub_part'>Graphe des Compétences</h2></div>");
            //console.log(data);
            var width = 600;
           var color = d3.scaleOrdinal()
                    .domain(data.map(d => d.name))
                    .range(d3.quantize(t => d3.interpolateBasis(t * 0.8 + 0.1), data.length).reverse());

           var pie = d3.pie()
                .sort(null)
                .value(d => d.value);

           var height = Math.min(width, 500);

           var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(Math.min(width, height) / 2 - 1);

           const radius = Math.min(width, height) / 2 * 0.8;

           var arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

          const arcs = pie(data);

          const svg = d3.select("#drw").append("svg")
              .attr("viewBox", [-width / 2, -height / 2, width, height]);

          svg.append("g")
              .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .append("path")
              .attr("fill", d => color(d.data.name))
              .attr("d", arc)
            .append("title")
              .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

          svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 12)
              .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .append("text")
              .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
              .call(text => text.append("tspan")
                  .attr("y", "-0.4em")
                  .attr("font-weight", "bold")
                  .text(d => d.data.name))
              .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                  .attr("x", 0)
                  .attr("y", "0.7em")
                  .attr("fill-opacity", 0.7)
                  .text(d => d.data.value.toLocaleString()));
}


function __buildingDataset__(courseworkName = "IDU"){
            /**
             * sets a new json object suitable to another function
             * 
             * parameter:
             * -----------
             *      courseworkName : str
             *          name of the coursework
             *          default value : "IDU"
             * 
             * return:
             * --------
             *      None
             */
            d3.json('static/TOOLS/fake_data/file.json', function (error, graph) {
                if (error) throw error;
                var index, nodes, dataSet, tLiist;
                nodes = graph.nodes;
                dataSet = [];
                tLiist = [];
                let nd;
                for (index = 0; index < nodes.length; index++) {
                    nd = nodes[index];
                    let gr = nd.group;
                    var val = 10;
                    var child = {name : nd.id, value: val};
                    val++;
                    //console.log(tLiist);
                    if (isIn(gr, tLiist)) {
                        for (let i = 0; i < dataSet.length; i++) {
                            if (dataSet[i].name === gr) {
                                dataSet[i].children.push(child);
                            }
                        }
                    } else {
                        
                        dataSet.push({name: gr, children : [child]})
                        tLiist.push(gr);
                    }
                }
                //******************************************************************************************************
                let data = {name: courseworkName, children: dataSet};
                //console.log(data);
                //__chronologicalDrawing__(data);
                drawCh(data);
            });
}



/***********************************************
                                                    main
                                                              **************************************************/

d3.select("#prerequis_butt").on("click", function(){
     __mainDraw__();
});

d3.select("#time_tag").on("click", function(){
     __buildingDataset__();
     //__chronologicalDrawing__();
});


d3.select("#btt").on("click", function(d){
    console.log("click");
    draw(d.text());
});


d3.select("#skill_tag").on("click", function(){
    drawHeatMap();
});


__mainDraw__();    