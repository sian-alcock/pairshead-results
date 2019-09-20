import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { formatTimes } from '../../lib/helpers'
const _ = require('lodash').runInContext()

class RaceTimeIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      raceTimes: [],
      raceTimesToDisplay: [],
      searchTerm: '',
      timesWithoutCrewBoolean: false,
      startTab: true,
      finishTab: false
    }

    this.displayStartTimes = this.displayStartTimes.bind(this)
    this.displayFinishTimes = this.displayFinishTimes.bind(this)
    this.handleTimesWithoutCrew = this.handleTimesWithoutCrew.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.handleTimesWithoutCrew = this.handleTimesWithoutCrew.bind(this)
    this.combineFilters = this.combineFilters.bind(this)
  }

  componentDidMount() {
    axios.get('/api/race-times/')
      .then(res => this.setState({ raceTimes: res.data, raceTimesToDisplay: res.data.filter(data => data.tap === 'Start')}))
  }

  displayStartTimes(){
    this.setState({ startTab: true, finishTab: false }, () => this.combineFilters(this.state.raceTimes))
  }

  displayFinishTimes(){
    this.setState({ startTab: false, finishTab: true}, () => this.combineFilters(this.state.raceTimes))
    console.log(this.state.startTab)
  }

  getNumTimesWithNoCrew(){
    return this.state.raceTimesToDisplay.filter(time => time.crew === null).length
  }

  handleSearchKeyUp(e){
    this.setState({
      searchTerm: e.target.value
    }, () => this.combineFilters(this.state.raceTimes))
  }

  handleTimesWithoutCrew(e){
    this.setState({
      timesWithoutCrewBoolean: e.target.checked
    }, () => this.combineFilters(this.state.raceTimes))
  }

  combineFilters(filteredTimes) {
    let filteredBySearchText
    let filteredByTimesWithoutCrew
    let filteredByTap


    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.raceTimes
    } else {
      filteredBySearchText = this.state.raceTimes.filter(time => time.crew !== null ? re.test(time.crew.name) || re.test(time.crew.id) : re.test(time.sequence))
    }

    if(this.state.timesWithoutCrewBoolean) {
      filteredByTimesWithoutCrew = this.state.raceTimes.filter(time => time.crew === null)
    } else {
      filteredByTimesWithoutCrew = this.state.raceTimes
    }

    if(this.state.startTab) {
      filteredByTap = this.state.raceTimes.filter(time => time.tap === 'Start')
    } else {
      filteredByTap = this.state.raceTimes.filter(time => time.tap === 'Finish')
    }


    _.indexOf = _.findIndex
    filteredTimes = _.intersection(this.state.raceTimes,  filteredBySearchText, filteredByTimesWithoutCrew, filteredByTap)

    return this.setState({ raceTimesToDisplay: filteredTimes })

  }

  render() {

    // console.log(this.state.raceTimesToDisplay)

    return (
      <section className="section">
        <div className="container">
          <div className="tabContainer">
            <div className="tabs is-toggle is-large is-centered">
              <ul>
                <li onClick={this.displayStartTimes}><a className={`startTab ${this.state.startTab ? 'active' : ''}`}>Start times</a></li>
                <li onClick={this.displayFinishTimes}><a className={`finishTab ${this.state.finishTab ? 'active' : ''}`}>Finish times</a></li>
              </ul>
            </div>
          </div>

          <div className="search field control has-icons-left">
            <span className="icon is-left">
              <i className="fas fa-search"></i>
            </span>
            <input className="input" placeholder="search" onKeyUp={this.handleSearchKeyUp} />

          </div>

          <div className="field">
            <label className="checkbox" >
              <input type="checkbox"  className="checkbox" value="timesWithoutCrew" onClick={this.handleTimesWithoutCrew} />
              {`⚠️ Times with no crew (${this.getNumTimesWithNoCrew()})`}
            </label>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Tap</th>
                <th>Start / Finish Tap</th>
                <th>Bib number</th>
                <th>Crew ID</th>
                <th>Crew name</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>Sequence</th>
                <th>Tap</th>
                <th>Start / Finish Tap</th>
                <th>Bib number</th>
                <th>Crew ID</th>
                <th>Crew name</th>
              </tr>
            </tfoot>
            <tbody>
              {this.state.raceTimesToDisplay.map(raceTime =>
                <tr key={raceTime.id}>
                  <td><Link to={`/race-times/${raceTime.id}`}>{raceTime.sequence}</Link></td>
                  <td>{raceTime.tap}</td>
                  <td>{formatTimes(raceTime.time_tap)}</td>
                  <td>{raceTime.bib_number === null ? '⚠️' : raceTime.bib_number}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.id}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.name}</td>

                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>
    )
  }
}

export default RaceTimeIndex
