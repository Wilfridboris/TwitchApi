const express=require('express')
const app=express()
const server=require('http').Server(app)
const request=require('request')
const axios=require('axios')
const io=require('socket.io')(server);
require('dotenv').config();


app.set('view engine','ejs')
app.use(express.static(__dirname+"/public"));
// Recuperer le token de me compte twtich
const getTokens=(url,takeResponse)=>{
    const hearders={
        url:"https://id.twitch.tv/oauth2/token",
        json:true,
        body:{
            client_id:'c61t0hxi6kt9ok1h4v4udn0qntihek',
            client_secret:'vtp48skms4jlfmnmseordg47kkfqtv',
            grant_type:'client_credentials'
        }


    };
    // on Poste les indentifiants et on recupere la reponse
    request.post(hearders,(err,res,body)=>{
        if(err) return console.log(err)
        takeResponse(res);
    })
  
}
 var Token='';
 // on accede au token
 getTokens('https://id.twitch.tv/oauth2/token',(res)=>{
      Token=res.body.access_token;
      return Token;
    
 })
 // on se connecte a l'api twitch
 const getGameChess=async (url,accessToken,callFunction)=>{
    try{
        const ChessOption=axios.create({
            headers:{
                'Client-ID':'5lwqp9tddm2mo4s53bsg5dqbcim3sc',
                'Authorization':'Bearer '+ accessToken
   
            }
        });
        // on recupere les infos de Chess game
        const resultC = await ChessOption.get('https://api.twitch.tv/helix/games',{params:{
            name:'Chess'
        }})
         // on recupere les infos de hearthstone game
        const resultH = await ChessOption.get('https://api.twitch.tv/helix/games',{params:{
           name:'Hearthstone'
       }})
        // on recupere les infos de rocket league game
       const resultR = await ChessOption.get('https://api.twitch.tv/helix/games',{params:{
           name:'Rocket League'
       }})
        // on recupere les infos de dota 2 game
       const resultD = await ChessOption.get('https://api.twitch.tv/helix/games',{params:{
           name:'Dota 2'
       }})
      
       // maintenant on utilise les id pour recuperer  les streams pour chacun des jeux 
        const chessStream= await  ChessOption.get('https://api.twitch.tv/helix/streams',{params:{
            game_id:resultC.data.data[0].id
        }})
        const hearthStream= await  ChessOption.get('https://api.twitch.tv/helix/streams',{params:{
            game_id:resultH.data.data[0].id
        }})
        const rocketStream= await  ChessOption.get('https://api.twitch.tv/helix/streams',{params:{
            game_id:resultR.data.data[0].id
        }})
        const dotaStream= await  ChessOption.get('https://api.twitch.tv/helix/streams',{params:{
            game_id:resultD.data.data[0].id
        }})
        // on appelle notre callback pour passer les data en parametre
        callFunction( chessStream.data,hearthStream.data,rocketStream.data,dotaStream.data)
         
     }catch(err){
         console.error(err)
     }
     
 }

app.get('/',(req,res)=>{
    res.render('index');
  
})

 
  function getChessViewer(){
        // la fonction prend l'url,le token et le callback en parametre
     getGameChess('https://api.twitch.tv/helix/games/top',Token,(chess,hearth,rocket,dota)=>{
        
     //on calcule le nombre de visionneur en fonction du jeux qui sera passer en parametre
     var viewer=(input)=>{
        var countStream=0;
        input.data.map(stream=>{
            countStream+=stream.viewer_count;
            
        }) 
        return countStream
        

     }   
     
    
        
       
     //notre websocket emet le resultat chque seconde
       io.sockets.send({chess:viewer(chess),hearth:viewer(hearth),dota:viewer(dota),rocket:viewer(rocket)});
       
       
      

})
      
  }
  setInterval(getChessViewer, 1000);
  


 


    

 
 

server.listen(5000,()=>{
    console.log("listen to port")
})
