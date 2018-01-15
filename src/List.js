import React, {Component} from 'react'
import moment from 'moment'
import firebase from 'firebase'



class List extends Component {

  state = {
    taskInputValue: '',
    tasks: [],
    checkedTaskIds: [],
    outcomeChecked: false,
    incomeChecked: true,
    options: [
      'Other expenses',
      'Relax',
      'Commute',
      'Health, hygene and chemistry',
      'Food',
      'Flat',
      'Other fees and bills',
      'Cloths',
    ],
    category: null,
    error: null
  }

  componentDidMount() {
    const userUid = firebase.auth().currentUser.uid
    firebase.database().ref('/tasks/' + userUid).on('value', snapshot => this.setState({
        tasks: Object.entries(snapshot.val() || {}).map(
          ([key, value]) => ({
            id: key,
            ...value
          })
        )
      })
    )
  }

  handleChange = event => {
    this.setState({
      taskInputValue: event.target.value
    })
  };

  handleIncomeInputChange = () => {
    this.setState({
      incomeChecked: !this.state.incomeChecked,
      outcomeChecked: this.state.incomeChecked
    })
  };

  handleOutcomeInputChange = () => {
    this.setState({
      incomeChecked: this.state.outcomeChecked,
      outcomeChecked: !this.state.outcomeChecked
    })
  };

  handleOption = event => {
    this.setState({
      category: event.target.value
    })
  };

  handleDeleteClick = event => {
    const taskId = event.target.dataset.taskId;
    const userUid = firebase.auth().currentUser.uid
    firebase.database().ref('/tasks/' + userUid + '/' + taskId).set(null)
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const userUid = firebase.auth().currentUser.uid

    if (this.state.outcomeChecked && this.state.category == null) {
      this.setState({error: "Please select category"});
      return;
    }

    if (this.state.taskInputValue === "") {
      this.setState({error: "Please fill in the value"});
      return;
    }

    firebase.database().ref('/tasks/' + userUid).push({
      content: '' + this.state.taskInputValue + '',
      isIncome: this.state.incomeChecked,
      isOutcome: this.state.outcomeChecked,
      category: this.state.outcomeChecked ? '' + this.state.category : null,
      date: '' + (new Date())
    })

    this.setState({
      taskInputValue: '',
      error: null
    });
  };


  render() {

    return (
      <div className="col-md-6">
        <p>Set your incomings and outgoings</p>


        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.taskInputValue}
            onChange={this.handleChange}
          />
          <button>Add</button>
          <p>{this.state.error}</p>
          <div>
            <label>
              <input type="radio" name="digits"
                     onChange={this.handleIncomeInputChange}
                     checked={this.state.incomeChecked}

              /> + Incomings:
            </label>
            <label>
              <input type="radio" name="Outgoings"
                     onChange={this.handleOutcomeInputChange}
                     checked={this.state.outcomeChecked}


              /> - Outgoings:
            </label>
          </div>

          Division:
          <select name="Outgoings" onChange={this.handleOption}>
            <option value="" disabled selected>- here choose category -</option>
            {this.state.options.map(option => <option>{option}</option>)}
          </select>
        </form>

        <table>
          <thead>
          <th>Ammount</th>
          <th>Category</th>
          <th>Date</th>
          </thead>
          <tbody>
          {
            this.state.tasks.map(
              task => (
                <tr>
                  <td key={task.id}>
                    {task.isOutcome === true && ' -'}
                    {(+task.content).toFixed(2)}
                  </td>
                  <td> {task.isIncome === true && ' Earnings '} {task.category}</td>
                  <td>{moment(task.date).format('DD MM YYYY')}</td>
                  <button data-task-id={task.id}
                          onClick={this.handleDeleteClick}>
                    Delete
                  </button>
                </tr>
              )
            )
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default List