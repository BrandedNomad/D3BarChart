
//Bar Chart

//Set Margins, width and height variables
var margin = {top:10,bottom:100,left:100,right:10};
var width = 600 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

//Transitions
var flag = true
var t = d3.transition().duration(1000)

//Read data from file

d3.json('data/revenues.json').then((data)=>{

    //Parse JSON Data
    let sales = data.map((sale)=>{
        return {month:sale.month,revenue:parseInt(sale.revenue),profit:parseInt(sale.profit)}
    })


    //Set Scales
    let y = d3.scaleLinear()
        .range([height,0])

    let x = d3.scaleBand()
        .range([0,width])
        .paddingInner(0.2)
        .paddingOuter(0.2)



    //Create Canvas with a group element
    let canvas = d3.select("#chart-area")
        .append("svg")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .style("overflow","visible")
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")

    //AxisGroups
    let xAxisGroup = canvas.append("g")
        .attr("class","x-axis")
        .attr("transform","translate(0," + height + ")")

    let yAxisGroup = canvas.append("g")
        .attr("class","y-axis")

    //Create Labels
    let xLabel = canvas.append("text")
        .attr("class","x-axis-label")
        .attr("x",width * 0.5)
        .attr("y",height + margin.top + margin.bottom)
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .text("Month")

    let yLabel = canvas.append("text")
        .attr("class","y-axis-label")
        .attr("x",-(height *0.5))
        .attr("y",-60)
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Revenue")



    //Updates Bar Chart
    const update=(toggleData)=>{
        //Scale domains
        y.domain([0,d3.max(toggleData,(d,i)=>{
            return flag ? d.revenue : d.profit
        })])

        x.domain(toggleData.map((sale)=>{
            return sale.month
        }))


        //Create Axis
        let xAxisCall = d3.axisBottom(x);
        xAxisGroup.transition(t).call(xAxisCall)
            .selectAll("text")
            .attr("font-size","20px")
            .attr("y","10")
            .attr("x","-5")
            .attr("text-anchor","end")
            .attr("transform","rotate(-40)");

        let yAxisCall = d3.axisLeft(y)
            .ticks(10)
            .tickFormat((d)=>{
                return d + "$"
            });
        yAxisGroup.transition(t).call(yAxisCall)
            .selectAll("text")
            .attr("font-size","10px")


        //Add data -update pattern: JOIN, EXIT, UPDATE, ENTER

        //Data JOIN
        let bars = canvas.selectAll('rect')
            .data(toggleData,(d)=>{
                return d.month;
            })

        //Data EXIT
        bars.exit()
                .attr("fill","red") //updates color
            .transition(t)
                .attr("y",y(0))
                .attr("height",0)
                .remove()

        //Data UPDATE
        bars.transition(t)
            .attr("x",(d,i)=>{
            return x(d.month)
            })
            .attr("y",(d,i)=>{
                return y(flag ? d.revenue : d.profit);
            })
            .attr("width",x.bandwidth)
            .attr("height",(d,i)=>{
                return height - y(flag ? d.revenue : d.profit)
            })

        //Data ENTER
        bars.enter()
            .append("rect")
                .attr("x",(d,i)=>{
                    return x(d.month)
                })
                .attr("y",(d,i)=>{
                    return y(0);
                })
                .attr("width",x.bandwidth)
                .attr("height",(d,i)=>{
                    return 0
                })
                .attr("fill",(d,i)=>{
                    return "blue"
                })
                .merge(bars)
                .transition(t)
                    .attr("y",(d,i)=>{
                        return y(flag ? d.revenue : d.profit);//toggle
                    })
                    .attr("height",(d,i)=>{
                        return height - y(flag ? d.revenue : d.profit) //toggle
                    })
                    .attr("fill",()=>{
                        return flag ? "blue":"green"
                    })

    }


    //Calls update function at regular intervals
    d3.interval(()=>{
        var label = flag ? "Revenue" : "Profit"
        yLabel.text(label)
        var toggleData = flag ? sales : sales.slice(1)
        update(toggleData)
        flag = !flag

    },3000)

    update(sales)





}).catch((error)=>{
    console.log(error)
})

