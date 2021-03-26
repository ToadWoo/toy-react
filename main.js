
import { createElement, Component, render } from './toy-react.js'


class Game extends Component{
    constructor(){
        super()
        this.state ={
            a: 1
        }
    }
    render(){
        return <div>
            <button onClick={()=>{this.setState({a: this.state.a++})}}>add</button>
            <p>{this.state.a.toString()}</p>
        </div>
    }
}

  render(
    <Game />,
    document.getElementById('root')
  );
  