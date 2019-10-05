import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { formatTimes } from '../../lib/helpers'
const _ = require('lodash').runInContext()
import Paginator from '../common/Paginator'

class RaceTimeIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      raceTimes: [],
      raceTimesToDisplay: [],
      pageSize: 20,
      pageIndex: 0,
      timesWithoutCrewBoolean: false,
      searchTerm: sessionStorage.getItem('raceTimeIndexSearch') || '',
      startTab: true,
      finishTab: false
    }

    this.displayStartTimes = this.displayStartTimes.bind(this)
    this.displayFinishTimes = this.displayFinishTimes.bind(this)
    this.handleTimesWithoutCrew = this.handleTimesWithoutCrew.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.handleTimesWithoutCrew = this.handleTimesWithoutCrew.bind(this)
    this.combineFilters = this.combineFilters.bind(this)
    this.changePage = this.changePage.bind(this)
    this.handlePagingChange = this.handlePagingChange.bind(this)
    this.handleCrewsWithTooManyTimes = this.handleCrewsWithTooManyTimes.bind(this)
  }

  componentDidMount() {
    axios.get('/api/race-times/')
      .then(res => this.setState({ raceTimes: res.data, raceTimesToDisplay: res.data.filter(data => data.tap === 'Start')}))
  }

  changePage(pageIndex, totalPages) {
    if (
      pageIndex > totalPages ||
    pageIndex < 0
    ) return null
    this.setState({ pageIndex })
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

  getNumCrewsWithTooManyTimes(){
    return this.state.raceTimesToDisplay.filter(time => time.crew && time.crew.times.length > 2).length
  }

  handleSearchKeyUp(e){
    sessionStorage.setItem('raceTimeIndexSearch', e.target.value)
    this.setState({
      searchTerm: e.target.value
    }, () => this.combineFilters(this.state.raceTimes))
  }

  handleTimesWithoutCrew(e){
    this.setState({
      timesWithoutCrewBoolean: e.target.checked
    }, () => this.combineFilters(this.state.raceTimes))
  }

  handleCrewsWithTooManyTimes(e){
    this.setState({
      crewsWithTooManyTimesBoolean: e.target.checked
    }, () => this.combineFilters(this.state.raceTimes))
  }


  handlePagingChange(selectedOption){
    this.setState({
      pageSize: selectedOption.value
    }, () => this.combineFilters(this.state.raceTimes))
  }

  combineFilters(filteredTimes) {
    let filteredBySearchText
    let filteredByTimesWithoutCrew
    let filteredByCrewsWithTooManyTimes
    let filteredByTap


    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.raceTimes
    } else {
      filteredBySearchText = this.state.raceTimes.filter(time => time.crew !== null ? re.test(time.crew.name) || re.test(time.crew.bib_number) || re.test(time.crew.id) || re.test(time.crew.competitor_names) || re.test(time.sequence) : re.test(time.sequence))
    }

    if(this.state.timesWithoutCrewBoolean) {
      filteredByTimesWithoutCrew = this.state.raceTimes.filter(time => time.crew === null)
    } else {
      filteredByTimesWithoutCrew = this.state.raceTimes
    }

    if(this.state.crewsWithTooManyTimesBoolean) {
      filteredByCrewsWithTooManyTimes = this.state.raceTimes.filter(time => time.crew && time.crew.times.length > 2)
    } else {
      filteredByCrewsWithTooManyTimes = this.state.raceTimes
    }

    if(this.state.startTab) {
      filteredByTap = this.state.raceTimes.filter(time => time.tap === 'Start')
    } else {
      filteredByTap = this.state.raceTimes.filter(time => time.tap === 'Finish')
    }


    _.indexOf = _.findIndex
    filteredTimes = _.intersection(this.state.raceTimes,  filteredBySearchText, filteredByTimesWithoutCrew, filteredByCrewsWithTooManyTimes, filteredByTap)

    return this.setState({ raceTimesToDisplay: filteredTimes, pageIndex: 0 })

  }

  render() {

    !this.state.raceTimesToDisplay ? <h2>loading...</h2> : console.log(this.state.raceTimesToDisplay)
    const totalPages = Math.floor((this.state.raceTimesToDisplay.length - 1) / this.state.pageSize)
    const pagedRaceTimes = this.state.raceTimesToDisplay.slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)
    const pagingOptions = [{label: '20 times', value: '20'}, {label: '50 times', value: '50'}, {label: '100 times', value: '100'}, {label: 'All times', value: '500'}]

    return (
      <section className="section">
        <div className="container">
          <div className="tabContainer no-print">
            <div className="tabs is-toggle is-large is-centered">
              <ul>
                <li onClick={this.displayStartTimes}><a className={`startTab ${this.state.startTab ? 'active' : ''}`}>Start times</a></li>
                <li onClick={this.displayFinishTimes}><a className={`finishTab ${this.state.finishTab ? 'active' : ''}`}>Finish times</a></li>
              </ul>
            </div>
          </div>

          <div className="columns">

            <div className="column">
              <div className="search field control has-icons-left no-print">
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
                <input className="input" placeholder="search" value={this.state.searchTerm} onChange={this.handleSearchKeyUp} />
              </div>
            </div>

            <div className="column">
              <div className="field">
                <div className="control">
                  <Select
                    id="paging"
                    onChange={this.handlePagingChange}
                    options={pagingOptions}
                    placeholder='Select page size'
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field no-print">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="timesWithoutCrew" onClick={this.handleTimesWithoutCrew} />
                  {`⚠️ Times with no crew (${this.getNumTimesWithNoCrew()})`}
                </label>
              </div>
            </div>

            <div className="column">
              <div className="field no-print">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="timesWithoutCrew" onClick={this.handleCrewsWithTooManyTimes} />
                  {`❗️ Crews with too many times (${this.getNumCrewsWithTooManyTimes()})`}
                </label>
              </div>
            </div>

          </div>


          <div className="no-print">
            <Paginator
              pageIndex={this.state.pageIndex}
              totalPages={totalPages}
              changePage={this.changePage}
            />
          </div>
          <div className="list-totals"><small>{this.state.raceTimesToDisplay.length} of {this.state.raceTimes.length} times</small></div>

          <table className="table">
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Tap</th>
                <th>Start / Finish Tap</th>
                <th>Bib number</th>
                <th>Crew ID</th>
                <th>Crew name</th>
                <th>Competitors</th>
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
                <th>Competitors</th>
              </tr>
            </tfoot>
            <tbody>
              {pagedRaceTimes.map(raceTime =>
                <tr key={raceTime.id}>
                  <td><Link to={`/race-times/${raceTime.id}`}>{raceTime.sequence}</Link></td>
                  <td>{raceTime.tap}</td>
                  <td>{formatTimes(raceTime.time_tap)}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.bib_number}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.id}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.times.length > 2 ? raceTime.crew.name + '❗️' : raceTime.crew.name}</td>
                  <td>{raceTime.crew === null ? '⚠️' : raceTime.crew.competitor_names}</td>

                </tr>
              )}
            </tbody>
          </table>

          <div className="no-print">
            <Paginator
              pageIndex={this.state.pageIndex}
              totalPages={totalPages}
              changePage={this.changePage}
            />
          </div>

        </div>

      </section>
    )
  }
}

export default RaceTimeIndex
