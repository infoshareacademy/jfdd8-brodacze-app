import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import firebase from 'firebase'
import colors from '../colors'

class DonutChart extends Component {
  state = {
    entries: []
      // {
      //   id: 1,
      //   title: 'Kupiłem fryty',
      //   category: 'Relax',
      //   value: 400,
      //     label: 'Expenses'
      // }
  };

  componentDidMount() {
    const userUid = firebase.auth().currentUser.uid
    firebase.database().ref('/tasks/' + userUid).on('value', snapshot => {
        this.setState({
          entries: Object.entries(snapshot.val() || {}).map(
            ([key, value]) => ({
              id: key,
              ...value
            })
          ).map(
            item => ({
              ...item,
              // value: (item.isIncome ? 1 : -1) * parseInt(item.content)
              category: item.isIncome ? 'Income' : item.category,
              value: parseFloat(item.content)
            })
          )
        });
      }
    )
  }

  render() {

    const { entries } = this.state

    if (entries.length === 0) {
      return <p>Bring us some data!</p>
    }
      const totalIncome = entries.filter(item => item.isIncome).map(item => item.value).reduce((current, total) => current + total, 0);
      const totalOutcome = entries.filter(item => !item.isIncome).map(item => item.value).reduce((current, total) => current + total, 0);

      const outcomeEntries = entries.filter(item => !item.isIncome);

      if (totalOutcome > totalIncome) {
        outcomeEntries.push({
          category: 'Debt',
          value: -(totalIncome - totalOutcome)
        })
      } else {
        outcomeEntries.push({
          category: 'Budget left',
          value: totalIncome - totalOutcome
        });
      }

    const categories = outcomeEntries.reduce(
      (categories, next) => categories.filter(
        category => category !== next.category
      ).concat(next.category), []);



    const categoriesData = categories.map(
      category => outcomeEntries.filter(
          entry => entry.category === category
        ).reduce((total, next) => total + next.value, 0)

    );

    // console.log(categoriesWithSums)

    // console.log(categories)

    const data = {
      labels: categories,
      datasets: [{
        data: categoriesData,
        backgroundColor: categories.map(category => colors[category] || ('#' + Math.floor(Math.random() * 255).toString(16).repeat(3)) )
      }],
      // hoverBackgroundColor:
    };

    return (
      <div>
        <Doughnut data={data}/>
      </div>
    );
  }
}


export default DonutChart