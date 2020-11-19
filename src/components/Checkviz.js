import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { precisionPrefix } from 'd3';
import inside from 'point-in-polygon';
import {Delaunay} from "d3-delaunay";

const Checkviz = (props) => {


    let jsonFileName = props.dataset + "_" + props.method;
    let pointsData = require("../json/" + jsonFileName + "_points.json");
    let pointsArray;



    pointsData = pointsData.map((d, i) => {
        return {
            coor: d.coor,
            lable: d.label,
            idx: i
        };
    });
    

    


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


    let svgs, svg, svgVoronoi, svgPoints;

    const radius = props.radius;


    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    useEffect(() => {


        svgs = d3.select("#scatterplot" + props.dataset + props.method)
                .attr("width", width + margin.hor * 2)
                .attr("height", height + margin.ver * 2)
     
        
        svg = svgs.append("g")
                  .attr("id", "scatterplot_g" + props.dataset + props.method)
                  .attr("transform", "translate(" + margin.hor + ", " + margin.ver + ")");
        

        svgVoronoi = svg.append("g")
                        .attr("id", "voronoi_g" + props.dataset + props.method);


        pointsArray = pointsData.map((d, i) => [xScale(d.coor[0]), yScale(d.coor[1])])
        console.log(pointsArray)
        const delaunay = Delaunay.from(pointsArray);
        const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

        console.log(voronoi.cellPolygon(2));

        const voronoiCells = pointsArray.map((_, i) => voronoi.cellPolygon(i));
        
        svgVoronoi.selectAll("path")
                  .data(voronoiCells)
                  .enter()
                  .append("path")
                  .attr("fill", (d, i) => colorScale(i))
                  .attr("stroke",1)
                  .attr("d", d => {
                      return d3.line()
                               .x(datum => datum[0])
                               .y(datum => datum[1])
                               (d);
                  })



        svg.append("rect")
           .attr("width", width + margin.hor * 2)
           .attr("height", height  + margin.ver * 2)
           .attr("transform", "translate(-" + margin.hor + ", -" + margin.ver + ")")
           .style("fill-opacity", 0)
           .style("stroke", "black")
           .style("stroke-width", 2)
                         
 
        

        svgPoints = svg.append("g")
                    .attr("id", "circle_g" + props.dataset + props.method);
        
        

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
                                     .attr("r", radius);
                         });
        
        // edges

        function scaleBivariate(first, second) {
            let lScale = d3.scaleLinear().domain([0, 2]).range([100, 30])
            let aScale = d3.scaleLinear().domain([1, -1]).range([30, -30])
            let bScale = d3.scaleLinear().domain([1, -1]).range([20, -20])

            return d3.color(d3.lab(lScale(first + second), aScale(first - second), bScale(second-first)))
        }

    }, []);
   


    return (
        <div>
            <svg id={"scatterplot" + props.dataset + props.method}></svg>
        </div>
    );
};

export default Checkviz;