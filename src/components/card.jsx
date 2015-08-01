var CardList = React.createClass({
  render: function(){
    var cards = []
    this.props.cards.forEach(
      function(card){ 
        cards.push(<Card text={card.text} type={card.type} />)
        
      }
    );
    return(
      <div>{cards}</div>
    )
  }
})

var Card = React.createClass({
  render: function() {
    var classString = "card " + this.props.type;
    return (
      <div className={classString}>
        <h2>{this.props.text}</h2>
      </div>
    );
  }
});
/*React.render(
  <Card text="Ghandi"/>,
  document.getElementById('content')
);*/
React.render(
  <CardList cards={cards}/>,
  document.getElementById('content')
);