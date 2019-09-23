import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { formatTimes } from '../../lib/helpers'

const _ = require('lodash').runInContext()


class CrewIndex extends React.Component {
  constructor() {
    super()
    this.state = {
      crews: [],
      searchTerm: '',
      sortTerm: 'finish_sequence|asc',
      crewsWithoutStartTimeBoolean: false,
      crewsWithoutFinishTimeBoolean: false,
      handleScratchedCrewsBoolean: true
    }

    // this.formatTimes = this.formatTimes.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.combineFiltersAndSort = this.combineFiltersAndSort.bind(this)
    this.handleCrewsWithoutStartTime = this.handleCrewsWithoutStartTime.bind(this)
    this.handleCrewsWithoutFinishTime = this.handleCrewsWithoutFinishTime.bind(this)
    this.getNumCrewsWithoutStartTimes = this.getNumCrewsWithoutStartTimes.bind(this)
    this.getNumCrewsWithoutFinishTimes = this.getNumCrewsWithoutFinishTimes.bind(this)
    this.handleScratchedCrews = this.handleScratchedCrews.bind(this)
    this.getNumScratchedCrews = this.getNumScratchedCrews.bind(this)
  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState(
        { crews: res.data, crewsToDisplay: res.data },
        () => this.combineFiltersAndSort(this.state.crews))
      )
  }

  getNumCrewsWithoutStartTimes(){
    return this.state.crews.filter(crew => crew.status === 'Accepted' && !crew.start_time).length
  }

  getNumCrewsWithoutFinishTimes(){
    return this.state.crews.filter(crew => crew.status === 'Accepted' && !crew.finish_time).length
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

  handleScratchedCrews(e){
    this.setState({
      scratchedCrewsBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  combineFiltersAndSort(filteredCrews) {
    let filteredBySearchText
    let filteredByCrewsWithoutStartTime
    let filteredByCrewsWithoutFinishTime
    let filteredByScratchedCrews

    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.crews
    } else {
      filteredBySearchText = this.state.crews.filter(crew => re.test(crew.name) || re.test(crew.status) || re.test(crew.club) || re.test(crew.id))
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

    if(this.state.scratchedCrewsBoolean) {
      filteredByScratchedCrews = this.state.crews.filter(crew => crew !== 'Scratched')
    } else {
      filteredByScratchedCrews = this.state.crews
    }

    _.indexOf = _.findIndex
    filteredCrews = _.intersection(this.state.crews,  filteredBySearchText, filteredByCrewsWithoutStartTime, filteredByCrewsWithoutFinishTime, filteredByScratchedCrews)

    const [field, order] = this.state.sortTerm.split('|')
    const sortedCrews = _.orderBy(filteredCrews, [field], [order])
    return this.setState({ crewsToDisplay: sortedCrews })

  }

  render() {

    console.log(this.state.crewsToDisplay)

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
                  </select>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithoutStartTime" onClick={this.handleCrewsWithoutStartTime} />
                  {`⚠️ Crews without start time (${this.getNumCrewsWithoutStartTimes()})`}
                </label>
              </div>

              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithoutFinishTime" onClick={this.handleCrewsWithoutFinishTime} />
                  {`⚠️ Crews without finish time (${this.getNumCrewsWithoutFinishTimes()})`}
                </label>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="showScratchedCrews" onClick={this.handleScratchedCrews} />
                  {`Hide scratched crews (${this.getNumScratchedCrews()})`}
                </label>
              </div>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Club</td>
                <td>Event</td>
                <td>Start seq#</td>
                <td>Finish seq#</td>
                <td><abbr title="Penalty">P</abbr></td>
                <td><abbr title="Handicap">H</abbr></td>
                <td>Start time</td>
                <td>Finish time</td>
                <td>Raw time</td>
                <td>Race time</td>
                <td>Time override</td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Club</td>
                <td>Event</td>
                <td>Start seq#</td>
                <td>Finish seq#</td>
                <td><abbr title="Penalty">P</abbr></td>
                <td><abbr title="Handicap">H</abbr></td>
                <td>Start time</td>
                <td>Finish time</td>
                <td>Raw time</td>
                <td>Race time</td>
                <td>Time override</td>
              </tr>
            </tfoot>
            <tbody>
              {this.state.crewsToDisplay && this.state.crewsToDisplay.map(crew =>
                <tr key={crew.id}>
                  <td><Link to={`/crews/${crew.id}`}>{crew.id}</Link></td>
                  <td>{crew.name}</td>
                  <td>{crew.status}</td>
                  <td>{crew.club.index_code}</td>
                  <td>{crew.event.name}</td>
                  <td>{crew.start_sequence ? crew.start_sequence : '⚠️'}</td>
                  <td>{crew.finish_sequence ? crew.finish_sequence : '⚠️'}</td>
                  <td>{crew.penalty}</td>
                  <td>{crew.handicap}</td>
                  <td>{crew.start_time ? formatTimes(crew.start_time) : '⚠️'}</td>
                  <td>{crew.finish_time ? formatTimes(crew.finish_time) : '⚠️'}</td>
                  <td>{crew.raw_time ? formatTimes(crew.raw_time) : '⚠️'}</td>
                  <td>{crew.race_time ? formatTimes(crew.race_time) : '⚠️'}</td>
                  <td>{crew.manual_override_time ? formatTimes(crew.manual_override_time) : ''}</td>
                </tr>
              )}
            </tbody>
          </table>

          <nav className="pagination is-small" role="navigation" aria-label="pagination">
            <a className="pagination-previous">Previous</a>
            <a className="pagination-next">Next page</a>
            <ul className="pagination-list">
              <li><a className="pagination-link" aria-label="Goto page 1">1</a></li>
              <li><span className="pagination-ellipsis">&hellip;</span></li>
              <li><a className="pagination-link" aria-label="Goto page 45">45</a></li>
              <li><a className="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
              <li><a className="pagination-link" aria-label="Goto page 47">47</a></li>
              <li><span className="pagination-ellipsis">&hellip;</span></li>
              <li><a className="pagination-link" aria-label="Goto page 86">86</a></li>
            </ul>
          </nav>

        </div>
      </section>
    )
  }
}

export default CrewIndex
