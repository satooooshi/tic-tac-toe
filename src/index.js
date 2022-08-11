import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
import './index.css'; // root directory is tic-tac-toe/

//関数コンポーネント, render メソッドだけを有して自分の state を持たないコンポーネントを、よりシンプルに書くための方法
// Square を関数コンポーネントに変えた際、onClick={() => this.props.onClick()} をより短い onClick={props.onClick} に書き換えました（両側でカッコが消えています）。
function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
/*
class Square extends React.Component {
    //  コンポーネントが何かを「覚える」ためには、state というものを使います
    // JavaScript のクラスでは、サブクラスのコンストラクタを定義する際は常に super を呼ぶ必要があります。
    constructor(props) {
      super(props);
      this.state = {
        value: null,
      };
    }
    
    render() {
      return (
        // <!--onClick={() => console.log('click')} と記載したときに onClick プロパティに渡しているのは関数であることに注意してください。React はクリックされるまでこの関数を実行しません。() => を書くのを忘れて onClick={console.log('click')} と書いてしまうのはよくある間違いであり、こうするとコンポーネントが再レンダーされるたびにログが表示されてしまいます。-->
        <button 
          className="square" 
          //onClick={()=>{ console.log('click');this.setState({value: 'X'}); }} 
          onClick={()=>this.props.onClick()}
         >
          {this.props.value}
        </button>
      );
    }
  }
  */

  class Board extends React.Component {

    renderSquare(i) { //square を区別するためのインデックス i 
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {


    // state を親コンポーネントにリフトアップ (lift up) することは React コンポーネントのリファクタリングでよくあること
    // 状態は個々の Square コンポーネントではなく Board コンポーネント内に保存されています。Board の state が変更されると、個々の Square コンポーネントも自動的に再レンダーされます。
    // Square コンポーネントはもう自分で state を管理しないようになった. React 用語でいうと、Square コンポーネントは制御されたコンポーネント (controlled component) になったということ
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // React 要素は第一級の JavaScript オブジェクトであり、それらをアプリケーション内で受け渡しできる
        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            //  key プロパティを与えることで、兄弟要素の中でそのアイテムが区別できるようにしてあげる必要があります。
            // key が指定されなかった場合、React は警告を表示し、デフォルトで key として配列のインデックスを使用します。
            // 配列のインデックスを key として使うことは、項目を並び替えたり挿入/削除する際に問題の原因となります。
            // 明示的に key={i} と渡すことで警告を消すことはできますが、配列のインデックスを使う場合と同様な問題が生じるためほとんどの場合は推奨されません。
            // key はグローバルに一意である必要はありません。コンポーネントとその兄弟の間で一意であれば十分です。


            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
          <div className="game">
            <div className="game-board">
              <LoggingButton/>
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
      }
    }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


  
  class LoggingButton extends React.Component {
    handleClick() {
      console.log('this is:', this);

      // https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
      var person = {
        name: "Brendan Eich",
        hello: function(thing) {
          console.log(this + " says hello " + thing);
        }
      }
      
      // this:
      person.hello("world")
      
      // desugars to this:
      person.hello.call(person, "world");
    }
  
    render() {
      return (
        <button onClick={(e) => this.handleClick(e)}>
          Click me
        </button>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  

  /*
  イミュータビリティ
  https://qiita.com/P-man_Brown/items/99fbd755d4cffce5a1bf
イミュータビリティを実現する方法
  スプレッド構文
  filter()
  map()又はreduce()
  const nums = [...Array(10)];
  nums.map((v, i) => i+1).reduce((a, b) => a+b); // 55
  配列.reduce(function(累積値, 要素) { })

  reverse()やsort()等、どうしても破壊的メソッドを使いたい場合には、スプレッド構文等で変更を加えたい配列のコピーを作成し、このコピーに対して変更を行うことで実現します。const newNumbers = [...numbers].reverse();
  
  advantages
    イミュータブルなオブジェクトでの変更の検出はとても簡単です。参照しているイミュータブルなオブジェクトが前と別のものであれば、変更があったということです。
    React の再レンダータイミングの決定
    イミュータビリティの主な利点は、React で pure component を構築しやすくなるということです。イミュータブルなデータは変更があったかどうか簡単に分かるため、コンポーネントをいつ再レンダーすべきなのか決定しやすくなります。

---------------
  slice(start, end): start から end まで (end は含まれない) 
  */
>>>>>>> parent of c39636b (ok)
