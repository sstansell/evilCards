var PlayerList = React.createClass({
  render: function() {
    var players = []
    this.props.players.forEach(
      function(player) {
        players.push( 
          <Player name = {player.name} points = {player.points}/>
        )
      });
      return ( 
        <div>
        <h2>Players</h2>
        <ul className="playerList"> {
          players
        } </ul>
      </div>)
      }
})

var Player = React.createClass({
  render: function(){
    return(
      <li>{this.props.name} - {this.props.points}</li>  
    )
  }
});

var CardList = React.createClass({
  render: function() {
    var cards = []
    this.props.cards.forEach(
      function(card) {
        cards.push( 
          <Card text={card.text} type={card.type} answers={card.answers}/>
        )

      });
    return ( 
      <div>{cards}</div>
    )}
})

var Card = React.createClass({

  render: function() {
    var classString = "card " + this.props.type;
    var two = "";
    if(this.props.answers === 2){
      two = <PickTwo />;
    };

  
    return ( 
      <div className = {classString}>
        <h2> 
          {this.props.text}
        </h2>
        {two}  
      </div>
    );
  }
});

var PickTwo = React.createClass({
  render: function(){
    return(
      <div className="two">Pick <span className="numberCircle">2</span></div> 
    ); 
  }
})

/** render the cards */
React.render( 
  <CardList cards={cards}/>,
  document.getElementById('cards')
);

/** render the player list */
React.render( 
  <PlayerList players = {
      players.sort(function(a,b){
      return parseInt(b.points) - parseInt(a.points)
    })
  }/>,
  document.getElementById('players')
);    