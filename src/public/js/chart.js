

fetch('http://localhost:3000/user/vote')
.then(res=>res.json())
.then(data=>{
    const votes = data.votes;
    const totalVotes = votes.length;
    const voteCount = votes.reduce((acc,vote)=>
    ((acc[vote.area]=(acc[vote.area] || 0)+ parseInt(vote.points)),acc),{});

    let dataPoint = [ // tạo dữ liệu mẫu
        {label:'Đà Nẵng',y: voteCount['Đà Nẵng']},
        {label:'Huế',y: voteCount['Huế']},
        {label:'Tp.Hồ Chí Minh',y: voteCount['Tp.Hồ Chí Minh']},
        {label:'Hà Nội',y: voteCount['Hà Nội']},
    ]
    const chartContainer1 = document.querySelector('#chartContainer1');
    const chartContainer2 = document.querySelector('#chartContainer2');// vẽ biểu đồ chartjs bằng canvas
    if(chartContainer1 && chartContainer2){
        const chart1 = new CanvasJS.Chart("chartContainer1", {
            animationEnabled:true,
            theme:'theme1',
            title:{
                text:'Thống kê Khu vực'
            },
            data:[
                {
    
                 type: 'column',
                 dataPoints:dataPoint
    
                }
            ]
        });
        chart1.render();    
        //chart2 
        const chart2 = new CanvasJS.Chart("chartContainer2", {
            animationEnabled:true,
            theme:'theme1',
            title:{
                text:'Thống kê Khu vực'
            },
            data:[
                {
    
                 type: 'spline',
                 dataPoints:dataPoint
    
                }
            ]
        });
        chart2.render();

    //
    Pusher.logToConsole = true;
    
    var pusher = new Pusher('63990e6e49ea692758a7', {
      cluster: 'ap1',
      encrypted:true
    });
    
    var channel = pusher.subscribe('os-pull');
    channel.bind('os-vote', function(data) {
    //   alert(JSON.stringify(data.os));
         dataPoint = dataPoint.map((x)=>{
             if(x.label == data.os){ //nếu x.label bằng với data được chọn
                 x.y+=data.points
                 return x;
             }
             else{
                 return x;
             }
         });
         chart.render();
    });
    }

})



