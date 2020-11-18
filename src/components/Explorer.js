import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { precisionPrefix } from 'd3';
import inside from 'point-in-polygon'

const Explorer = (props) => {


    let jsonFileName = props.dataset + "_" + props.method;
    let pointsData = require("../json/" + jsonFileName + "_points.json");
    let edgesData = require("../json/" + jsonFileName + "_edges.json");
    let missingPointsData = require("../json/" + jsonFileName + "_missing_points.json")




    pointsData = pointsData.map((d, i) => {
        return {
            coor: d.coor,
            lable: d.label,
            idx: i
        };
    });

    let knnData = edgesData.reduce(function(acc, val) {
        if (val.start in acc) acc[val.start].push(val.end);
        else                  acc[val.start] = [val.end];
        if (val.end in acc)   acc[val.end].push(val.start);
        else                  acc[val.end] = [val.start];
        return acc;
    }, {})

    console.log(pointsData, edgesData, missingPointsData, knnData) 

    const width = 1000;
    const height = 1000;
    const margin = { hor: width / 20, ver: height / 20 };

    const [minX, maxX] = d3.extent(pointsData, d => d.coor[0]);
    const [minY, maxY] = d3.extent(pointsData, d => d.coor[1]);

    const xScale = d3.scaleLinear()
                        .domain([minX, maxX])
                        .range([0, width]);
    
    const yScale = d3.scaleLinear()
                        .domain([minY, maxY])
                        .range([0, height]);


    let svgs, svg, svgPoints, svgEdges, svgMissingEdges, svgContour, svgContourPoints;
    let pointSelection;

    const radius = props.radius;
    const strokeWidth = props.stroke;


    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    const isSelecting = useRef(false);
    const isMakingContour = useRef(false);
    const contour = useRef([]);


    function pointsInPolygon(polygon) {
        polygon = polygon.map(d => [xScale.invert(d[0] - margin.hor), yScale.invert(d[1] - margin.ver)]);
        let pointsInPolygon = pointsData.reduce(function(acc, val, i){
            if (inside(val.coor, polygon)) acc.push(i);
            return acc;
        }, []);
        return pointsInPolygon;
    }

    function getMissingEdgesInfo(missingPointsDict) {
        let missingPointsList = Object.keys(missingPointsDict);
        let edges = missingPointsList.reduce(function(acc, val) {
            let adjacentPoints = knnData[val.toString()]
            if (adjacentPoints === undefined) return acc;
            adjacentPoints.forEach(adjacentPoint => {
                if(parseInt(adjacentPoint) in missingPointsDict) {
                    let keyStr = parseInt(adjacentPoint) < val ? 
                                adjacentPoint  + "_" + val.toString() : 
                                val.toString() + "_" + adjacentPoint;
                    acc.push(keyStr);
                }
            });
            return acc;
        }, []);
        edges = Array.from(new Set(edges));
        edges = edges.map(d => {
            const incidentPoints = d.split("_");
            return [parseInt(incidentPoints[0]), parseInt(incidentPoints[1])];
        })
        return edges;
    }

    useEffect(() => {


        svgs = d3.select("#scatterplot" + props.dataset + props.method)
                .attr("width", width + margin.hor * 2)
                .attr("height", height + margin.ver * 2)
     
        
        svg = svgs.append("g")
                  .attr("id", "scatterplot_g" + props.dataset + props.method)
                  .attr("transform", "translate(" + margin.hor + ", " + margin.ver + ")");


        svgEdges = svg.append("g")
                      .attr("id", "edge_g" + props.dataset + props.method);

        
        svgContour = svg.append("g")
                      .attr("id", "contour_g" + props.dataset + props.method);

        svgContourPoints = svg.append("g")
                              .attr("id", "contour_point_g" + props.dataset + props.method);


        function renderMissingEdges(edges, missingPointsDict) {
            svgMissingEdges.selectAll("path")
                          .data(edges)
                          .enter()
                          .append("path")
                          .attr("fill", "none")
                          .attr("stroke-width", strokeWidth)
                          .attr("stroke", "red")
                          .attr("d", d => {
                              return d3.line()
                                      .x(datum => xScale(pointsData[datum].coor[0]))
                                      .y(datum => yScale(pointsData[datum].coor[1]))
                                      (d);
                          })
                          .style("opacity", d => {
                              return (missingPointsDict[d[0]] + missingPointsDict[d[1]]) / 2
                          });
        }


        pointSelection = svg.append("rect")
                            .attr("width", width + margin.hor * 2)
                            .attr("height", height  + margin.ver * 2)
                            .attr("transform", "translate(-" + margin.hor + ", -" + margin.ver + ")")
                            .style("fill-opacity", 0)
                            .style("stroke", "black")
                            .style("stroke-width", 2)
                            .on("click", function(event) {
                              if(!isSelecting.current) {
                                    
                                  if(!isMakingContour.current) {
                                      isMakingContour.current = true;
                                      contour.current.push([event.offsetX, event.offsetY])
                                      svgContour.append("path")
                                                .attr("id", "current_path")
                                                .attr("fill", "none")
                                                .attr("stroke", "blue")
                                                .attr("storke-width", 1)
                                                .attr("stroke-dasharray", "2 ");
                                  }
                                  else {
                                      svgContour.select("#current_path")
                                                .attr("id", "")
                                                .attr("d", () => {
                                                    let start, end;
                                                    if (Math.abs(event.offsetX - contour.current[0][0]) < 4 &&
                                                        Math.abs(event.offsetY - contour.current[0][1]) < 4) {
                                                            start = contour.current[contour.current.length - 1];
                                                            end = contour.current[0];
                                                            isSelecting.current = true;
                                                            isMakingContour.current = false; // finish making contour
                                                        }
                                                    else {
                                                        contour.current.push([event.offsetX, event.offsetY])
                                                        start = contour.current[contour.current.length - 2];
                                                        end = contour.current[contour.current.length - 1];
                                                        svgContour.append("path")
                                                                  .attr("id", "current_path")
                                                                  .attr("fill", "none")
                                                                  .attr("stroke", "blue")
                                                                  .attr("storke-width", 1)
                                                                  .attr("stroke-dasharray", "2 ");
                                                    }
                                                    
                                                    return d3.line()
                                                             .x(datum => datum[0])
                                                             .y(datum => datum[1])
                                                             ([[start[0] - margin.hor, start[1] - margin.ver],[end[0] - margin.hor, end[1] - margin.ver]])
                                                })
                                      

                                      if(isSelecting.current) {
                                          let points = pointsInPolygon(contour.current);
                                          svgContourPoints.selectAll("circle")
                                                    .data(points)
                                                    .enter()
                                                    .append("circle")
                                                    .attr("r", radius * 3)
                                                    .attr("cx", d => xScale(pointsData[d].coor[0]))
                                                    .attr("cy", d => yScale(pointsData[d].coor[1]))
                                                    .attr("fill", "blue");
                                        
                                          let missingPointsDict = points.reduce(function(acc, val) {
                                              let currentDict = missingPointsData[val];
                                              Object.keys(currentDict).forEach(key => {
                                                  if (key in acc) acc[key] += currentDict[key];
                                                  else            acc[key] =  currentDict[key];
                                              });
                                              return acc;
                                          }, {})

                                          let listLen = points.length;
                                          Object.keys(missingPointsDict).forEach(d => {
                                              missingPointsDict[d] /= listLen;
                                          })
                                          let edges = getMissingEdgesInfo(missingPointsDict);
                                          renderMissingEdges(edges, missingPointsDict);
                                      }
                                      
                                  }
                                  if(isMakingContour.current){
                                      svgContour.append("circle")
                                                .attr("r", 1.5)
                                                .attr("cx", event.offsetX - margin.hor)
                                                .attr("cy", event.offsetY - margin.ver)
                                                .attr("fill", "none")
                                                .attr("stroke", "blue")
                                                .attr("stroke-width", 1);
                                  }
                              }
                            })
                            .on("mousemove", function(event) {
                                // console.log(event)
                                svgContour.select("#current_path")
                                          .attr("d",() =>{
                                              let start = contour.current[contour.current.length - 1]
                                              let end;
                                              if (Math.abs(event.offsetX - contour.current[0][0]) < 4 &&
                                                  Math.abs(event.offsetY - contour.current[0][1]) < 4) 
                                                  end = contour.current[0];
                                              else end = [event.offsetX, event.offsetY]
                                              return d3.line()
                                                       .x(datum => datum[0])
                                                       .y(datum => datum[1])
                                                       ([[start[0] - margin.hor, start[1] - margin.ver],[end[0] - margin.hor, end[1] - margin.ver]])

                                          })
                                
                            })
 
        


        svgPoints = svg.append("g")
                    .attr("id", "circle_g" + props.dataset + props.method);
        
        svgMissingEdges = svg.append("g")
                             .attr("id", "missing_edge_g" + props.dataset + props.method);
        

        // points
        svgPoints.selectAll("circle")
                         .data(pointsData)
                         .join(
                             enter => {
                                 enter.append("circle")
                                     .attr("class", (d,i) => "circle" + i.toString())
                                     .attr("fill", d => {
                                         if (props.isLabel) return colorScale(d.label);
                                         else return "black"; 
                                     })
                                     .attr("cx", d => xScale(d.coor[0]))
                                     .attr("cy", d => yScale(d.coor[1]))
                                     .style("opacity", 0.8)
                                     .attr("r", radius)
                                     .on("mouseenter", function() {
                                         if(!isSelecting.current && !isMakingContour.current)
                                            d3.select(this).attr("r", radius * 3)
                                     })
                                     .on("mouseleave", function() {
                                         if(!isSelecting.current && !isMakingContour.current)
                                            d3.select(this).attr("r", radius)
                                     })
                                     .on("click", function(e, d) {
                                         if(!isSelecting.current && !isMakingContour.current){
                                            isSelecting.current = true;
                                            d3.select(this).attr("r", radius * 5);
                                            let missingPointsDict = missingPointsData[d.idx];
                                            let edges = getMissingEdgesInfo(missingPointsDict)
                                            renderMissingEdges(edges, missingPointsDict);
                                            // svgMissingEdges.selectAll("path")
                                            //                .data(edges)
                                            //                .enter()
                                            //                .append("path")
                                            //                .attr("fill", "none")
                                            //                .attr("stroke-width", strokeWidth)
                                            //                .attr("stroke", "red")
                                            //                .attr("d", d => {
                                            //                    return d3.line()
                                            //                             .x(datum => xScale(pointsData[datum].coor[0]))
                                            //                             .y(datum => yScale(pointsData[datum].coor[1]))
                                            //                             (d);
                                            //                })
                                            //                .style("opacity", d => {
                                            //                    return (missingPointsDict[d[0]] + missingPointsDict[d[1]]) / 2
                                            //                })
                                         }
                                     });
                             }
                         );
        
        // edges

        function scaleBivariate(first, second) {
            let lScale = d3.scaleLinear().domain([0, 2]).range([100, 30])
            let aScale = d3.scaleLinear().domain([1, -1]).range([30, -30])
            let bScale = d3.scaleLinear().domain([1, -1]).range([20, -20])

            return d3.color(d3.lab(lScale(first + second), aScale(first - second), bScale(second-first)))
        }


        svgEdges.selectAll("path")
                .data(edgesData)
                .join(
                    enter => {
                        enter.append("path")
                             .attr("fill", "none")
                             .attr("stroke-width", strokeWidth)
                            //  .attr("opacity", d => {
                            //      if ( props.showMissing && !props.showFalse) return d.missing_val;
                            //      if (!props.showMissing &&  props.showFalse) return d.false_val;
                            //      if ( props.showMissing &&  props.showFalse) return Math.min((d.missing_val + d.false_val), 1); 
                            //  })
                             .attr("stroke", d => {
                                 if (props.showMissing && props.showFalse) return scaleBivariate(d.missing_val, d.false_val);
                                 else return "black";
                             })
                             .attr("d", d => {
                                return d3.line()
                                         .x(datum => xScale(pointsData[datum].coor[0]))
                                         .y(datum => yScale(pointsData[datum].coor[1]))
                                         ([d.start, d.end])
                             });
                    }
                )
    }, []);
   


    return (
        <div>
            <svg id={"scatterplot" + props.dataset + props.method}></svg>
        </div>
    );
};

export default Explorer;