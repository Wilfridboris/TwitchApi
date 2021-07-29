$(function(){
    
    var socket = io.connect();
    socket.on('message', function (data) {

      // const max=()=>{
      //   var max=0;
      //   for(let key in data){
      //     if(data[key]>max){
      //       max=data[key]

      //     }
      //   }
      //   return max;
      // }
      // const min=()=>{
      //   var min=data.chess;
      //   for(let key in data){
          
      //     if(data[key]<min){
      //       min=data[key]

      //     }
      //   }
      //   return min;
      // }
      $('#lab').text(data.chess)
      $('#hearth').text(data.hearth)
      $('#dota').text(data.dota)
      $('#rocket').text(data.rocket)
// le Line chart
      var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light2", // "light1", "light2", "dark1", "dark2"
	title:{
		text: "Top Rank"
	},
	axisY: {
		title: "Viewers"
	},
	data: [{        
		type: "column",  
		showInLegend: true, 
		legendMarkerColor: "grey",
		dataPoints: [      
			{ y: data.hearth, label: "HearthStone" },
			{ y: data.dota,  label: "Dota 2" },
			{ y: data.rocket,  label: "Rokcket Legue" },
			
		]
	}]
});
chart.render();
      
    });
})

