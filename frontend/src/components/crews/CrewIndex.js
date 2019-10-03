import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { formatTimes, getImage } from '../../lib/helpers'
import Paginator from '../common/Paginator'

const _ = require('lodash').runInContext()


class CrewIndex extends React.Component {
  constructor() {
    super()
    this.state = {
      crews: [],
      crewsToDisplay: [],
      pageSize: 20,
      pageIndex: 0,
      searchTerm: '',
      sortTerm: 'finish_sequence|asc',
      crewsWithoutStartTimeBoolean: false,
      crewsWithoutFinishTimeBoolean: false,
      handleScratchedCrewsBoolean: true
    }


    this.changePage = this.changePage.bind(this)
    this.getNumCrewsWithoutFinishTimes = this.getNumCrewsWithoutFinishTimes.bind(this)
    this.getNumCrewsWithoutStartTimes = this.getNumCrewsWithoutStartTimes.bind(this)
    this.getNumScratchedCrews = this.getNumScratchedCrews.bind(this)
    this.getNumCrewsWithTooManyTimes = this.getNumCrewsWithTooManyTimes.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handleCrewsWithoutStartTime = this.handleCrewsWithoutStartTime.bind(this)
    this.handleCrewsWithoutFinishTime = this.handleCrewsWithoutFinishTime.bind(this)
    this.handleCrewsWithTooManyTimes = this.handleCrewsWithTooManyTimes.bind(this)
    this.handleScratchedCrews = this.handleScratchedCrews.bind(this)
    this.combineFiltersAndSort = this.combineFiltersAndSort.bind(this)
  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState(
        { crews: res.data, crewsToDisplay: res.data },
        () => this.combineFiltersAndSort(this.state.crews))
      )
  }

  changePage(pageIndex, totalPages) {
    if (
      pageIndex > totalPages ||
    pageIndex < 0
    ) return null
    this.setState({ pageIndex })
  }

  getNumCrewsWithoutStartTimes(){
    return this.state.crews.filter(crew => crew.status === 'Accepted' && !crew.start_time).length
  }

  getNumCrewsWithoutFinishTimes(){
    return this.state.crews.filter(crew => crew.status === 'Accepted' && !crew.finish_time).length
  }

  getNumCrewsWithTooManyTimes(){
    return this.state.crews.filter(crew => crew.times && crew.times.length > 2).length
  }

  getNumScratchedCrews(){
    return this.state.crews.filter(crew => crew.status === 'Scratched').length
  }

  handleSearchKeyUp(e){
    this.setState({
      searchTerm: e.target.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleSortChange(e){
    this.setState({ sortTerm: e.target.value }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleCrewsWithoutStartTime(e){
    this.setState({
      crewsWithoutStartTimeBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleCrewsWithoutFinishTime(e){
    this.setState({
      crewsWithoutFinishTimeBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleCrewsWithTooManyTimes(e){
    this.setState({
      crewsWithTooManyTimesBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleScratchedCrews(e){
    this.setState({
      scratchedCrewsBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  combineFiltersAndSort(filteredCrews) {
    let filteredBySearchText
    let filteredByCrewsWithoutStartTime
    let filteredByCrewsWithoutFinishTime
    let filteredByCrewsWithTooManyTimes
    let filteredByScratchedCrews

    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.crews
    } else {
      filteredBySearchText = this.state.crews.filter(crew => re.test(crew.name) || re.test(crew.status) || re.test(crew.club) || re.test(crew.id) || re.test(crew.competitors_names) || re.test(!crew.band ? '' : crew.band.name) || re.test(!crew.event ? '' : crew.event.name))
    }

    if(this.state.crewsWithoutStartTimeBoolean) {
      filteredByCrewsWithoutStartTime = this.state.crews.filter(crew => !crew.start_time)
    } else {
      filteredByCrewsWithoutStartTime = this.state.crews
    }

    if(this.state.crewsWithoutFinishTimeBoolean) {
      filteredByCrewsWithoutFinishTime = this.state.crews.filter(crew => !crew.finish_time)
    } else {
      filteredByCrewsWithoutFinishTime = this.state.crews
    }

    if(this.state.crewsWithTooManyTimesBoolean) {
      filteredByCrewsWithTooManyTimes = this.state.crews.filter(crew => crew.times && crew.times.length > 2)
    } else {
      filteredByCrewsWithTooManyTimes = this.state.crews
    }

    if(this.state.scratchedCrewsBoolean) {
      filteredByScratchedCrews = this.state.crews.filter(crew => crew.status !== 'Scratched')
    } else {
      filteredByScratchedCrews = this.state.crews
    }

    _.indexOf = _.findIndex
    filteredCrews = _.intersection(this.state.crews,  filteredBySearchText, filteredByCrewsWithoutStartTime, filteredByCrewsWithoutFinishTime, filteredByCrewsWithTooManyTimes, filteredByScratchedCrews)

    const [field, order] = this.state.sortTerm.split('|')
    const sortedCrews = _.orderBy(filteredCrews, [field], [order])
    return this.setState({ crewsToDisplay: sortedCrews, pageIndex: 0 })

  }

  render() {

    !this.state.crewsToDisplay ? <h2>loading...</h2> : console.log(this.state.crewsToDisplay)
    const totalPages = Math.floor((this.state.crewsToDisplay.length - 1) / this.state.pageSize)
    const pagedCrews = this.state.crewsToDisplay.slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)

    return (
      <section className="section">
        <div className="container">

          <div className="columns">

            <div className="column">
              <div className="field control has-icons-left">
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
                <input className="input" placeholder="search" onKeyUp={this.handleSearchKeyUp} />

              </div>
            </div>

            <div className="column">
              <div className="field">
                <div className="select">
                  <select onChange={this.handleSortChange}>
                    <option value="name|asc">Name A-Z</option>
                    <option value="name|desc">Name Z-A</option>
                    <option value="start_sequence|asc">Start sequence, asc</option>
                    <option value="start_sequence|desc">Start sequence, desc</option>
                    <option value="finish_sequence|asc">Finish sequence, asc</option>
                    <option value="finish_sequence|desc">Finish sequence, desc</option>
                    <option value="club.index_code|asc">Club, asc</option>
                    <option value="club.index_code|desc">Club, desc</option>
                    <option value="event.name|asc">Event, asc</option>
                    <option value="event.name|desc">Event, desc</option>
                    <option value="bib_number|asc">Bib, asc</option>
                    <option value="bib_number|desc">Bib, desc</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithoutStartTime" onClick={this.handleCrewsWithoutStartTime} />
                  <small>{`⚠️ Crews without start time (${this.getNumCrewsWithoutStartTimes()})`}</small>
                </label>
              </div>

              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithoutFinishTime" onClick={this.handleCrewsWithoutFinishTime} />
                  <small>{`⚠️ Crews without finish time (${this.getNumCrewsWithoutFinishTimes()})`}</small>
                </label>
              </div>


              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithMultipleTimes" onClick={this.handleCrewsWithTooManyTimes} />
                  <small>{`❗️ Crews with multiple times (${this.getNumCrewsWithTooManyTimes()})`}</small>
                </label>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="showScratchedCrews" onClick={this.handleScratchedCrews} />
                  <small>{`Hide scratched crews (${this.getNumScratchedCrews()})`}</small>
                </label>
              </div>
            </div>
          </div>

          <Paginator
            pageIndex={this.state.pageIndex}
            totalPages={totalPages}
            changePage={this.changePage}
          />

          <table className="table">
            <thead>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Blade</td>
                <td>Bib</td>
                <td>Club</td>
                <td>Category</td>
                <td>Start seq#</td>
                <td>Finish seq#</td>
                <td><abbr title="Penalty">P</abbr></td>
                <td>Start time</td>
                <td>Finish time</td>
                <td>Raw time</td>
                <td>Race time</td>
                <td>Mas adjust</td>
                <td>Mas adjusted</td>
                <td>Time override</td>
                <td>TO</td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Blade</td>
                <td>Bib</td>
                <td>Club</td>
                <td>Category</td>
                <td>Start seq#</td>
                <td>Finish seq#</td>
                <td><abbr title="Penalty">P</abbr></td>
                <td>Start time</td>
                <td>Finish time</td>
                <td>Raw time</td>
                <td>Race time</td>
                <td>Mas adjustment</td>
                <td>Mas adjust</td>
                <td>Time override</td>
                <td>TO</td>
              </tr>
            </tfoot>
            <tbody>
              {pagedCrews.map(crew =>
                <tr key={crew.id}>
                  <td><Link to={`/crews/${crew.id}`}>{crew.id}</Link></td>
                  <td>{!crew.competitor_names ? crew.name : crew.times.length && crew.times.length > 2 ? crew.competitor_names + '❗️' : crew.competitor_names}</td>
                  <td>{crew.status}</td>
                  <td>{getImage(crew)}</td>
                  <td>{!crew.bib_number ? '' : crew.bib_number}</td>
                  <td>{crew.club.index_code}</td>
                  <td>{crew.event_band}</td>
                  <td>{crew.start_sequence ? crew.start_sequence : '⚠️'}</td>
                  <td>{crew.finish_sequence ? crew.finish_sequence : '⚠️'}</td>
                  <td>{crew.penalty}</td>
                  <td>{crew.start_time ? formatTimes(crew.start_time) : '⚠️'}</td>
                  <td>{crew.finish_time ? formatTimes(crew.finish_time) : '⚠️'}</td>
                  <td>{crew.raw_time ? formatTimes(crew.raw_time) : '⚠️'}</td>
                  <td>{crew.race_time ? formatTimes(crew.race_time) : '⚠️'}</td>
                  <td>{crew.masters_adjustment === 0 ? '' : formatTimes(crew.masters_adjustment)}</td>
                  <td>{crew.masters_adjusted_time === 0 ? '' : formatTimes(crew.masters_adjusted_time)}</td>
                  <td>{crew.manual_override_time ? formatTimes(crew.manual_override_time) : ''}</td>
                  <td>{crew.time_only ? 'TO' : ''}</td>
                </tr>
              )}
            </tbody>
          </table>

          <Paginator
            pageIndex={this.state.pageIndex}
            totalPages={totalPages}
            changePage={this.changePage}
          />

        </div>
      </section>
    )
  }
}

export default CrewIndex
