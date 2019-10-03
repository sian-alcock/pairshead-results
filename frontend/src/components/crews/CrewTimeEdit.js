import React from 'react'
import axios from 'axios'

import { formatTimes } from '../../lib/helpers'

class CrewTimeEdit extends React.Component {
  constructor() {
    super()
    this.state= {
      time_only: '',
      formData: {},
      errors: {},
      allClubs: {},
      allEvents: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)

  }

  componentDidMount() {
    axios.get(`/api/crews/${this.props.match.params.id}`)
      .then(res => this.setState({formData: res.data })
      )
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.put(`/api/crews/${this.props.match.params.id}`, this.state.formData)
      .then(() => this.props.history.push('/crews'))
      .catch(err => this.setState({ errors: err.response.data }))
  }

  handleChange(e) {
    console.log('e props and val', e.target.name, e.target.value)
    const formData = { ...this.state.formData, [e.target.name]: e.target.value }
    this.setState({ formData })
  }

  handleCheckbox(e) {
    const formData = { ...this.state.formData, [e.target.name]: e.target.checked }
    this.setState({ formData })
  }


  render() {

    console.log(this.state.formData)
    console.log(this.state.formData.time_only)

    return (
      <section className="section">
        <div className="container">

          <div className="box">
            <div className="columns is-multiline">

              <div className="column is-one-third">
                <div>Crew ID: {this.state.formData.id}</div>
              </div>

              <div className="column is-one-third">
                <div>Crew: {this.state.formData.name}</div>
              </div>

              <div className="column is-one-third">
                <div>Bib number: {this.state.formData.bib_number}</div>
              </div>

            </div>
          </div>

          <form className="container box tableBorder" onSubmit={this.handleSubmit}>

            <div className="field">
              <label className="label" htmlFor="penalty">Penalty in seconds</label>
              <input
                className="input"
                name="penalty"
                id="penalty"
                placeholder="eg: 5"
                value={this.state.formData.penalty || ''}
                onChange={this.handleChange}
              />
              {this.state.errors.penalty && <small className="help is-danger">{this.state.errors.penalty}</small>}
            </div>
            <p>Override race time</p>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label" htmlFor="manual_override_minutes">Minutes</label>
                  <input
                    className="input"
                    type="number"
                    name="manual_override_minutes"
                    id="manual_override_minutes"
                    min="0"
                    max="59"
                    value={this.state.formData.manual_override_minutes || ''}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.manual_override_minutes && <small className="help is-danger">{this.state.errors.manual_override_minutes}</small>}
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label className="label" htmlFor="manual_override_seconds">Seconds</label>
                  <input
                    className="input"
                    type="number"
                    name="manual_override_seconds"
                    id="manual_override_seconds"
                    min="0"
                    max="59"
                    value={this.state.formData.manual_override_seconds || ''}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.manual_override_seconds && <small className="help is-danger">{this.state.errors.manual_override_seconds}</small>}
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label className="label" htmlFor="manual_override_hundredths_seconds">Hundredths of seconds</label>
                  <input
                    className="input"
                    type="number"
                    name="manual_override_hundredths_seconds"
                    id="manual_override_hundredths_seconds"
                    min="0"
                    max="99"
                    value={this.state.formData.manual_override_hundredths_seconds || ''}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.manual_override_hundredths_seconds && <small className="help is-danger">{this.state.errors.manual_override_hundredths_seconds}</small>}
                </div>
              </div>
            </div>

            <p>Masters adjust time</p>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label" htmlFor="masters_adjust_minutes">Minutes</label>
                  <input
                    className="input"
                    type="number"
                    name="masters_adjust_minutes"
                    id="masters_adjust_minutes"
                    min="0"
                    max="59"
                    value={this.state.formData.masters_adjust_minutes || ''}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.masters_adjust_minutes && <small className="help is-danger">{this.state.errors.masters_adjust_minutes}</small>}
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label className="label" htmlFor="masters_adjust_seconds">Seconds</label>
                  <input
                    className="input"
                    type="number"
                    name="masters_adjust_seconds"
                    id="masters_adjust_seconds"
                    min="0"
                    max="59"
                    value={this.state.formData.masters_adjust_seconds || ''}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.masters_adjust_seconds && <small className="help is-danger">{this.state.errors.masters_adjust_seconds}</small>}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="checkbox" htmlFor="time_only">
                <input
                  className="checkbox"
                  type="checkbox"
                  name="time_only"
                  value={this.state.formData.time_only}
                  checked={!!this.state.formData.time_only}
                  onChange={this.handleCheckbox}
                /> Time only
              </label>
              {this.state.errors.time_only && <small className="help is-danger">{this.state.errors.time_only}</small>}

            </div>
            <br />
            <button className="button is-primary">Submit</button>
          </form>

          <div className="box">
            <div className="columns is-multiline">

              <div className="column is-one-third">
                <div>Start tap: {!this.state.formData.start_time ? '⚠️' : formatTimes(this.state.formData.start_time)}</div>
              </div>

              <div className="column is-one-third">
                <div>Finish tap: {!this.state.formData.finish_time ? '⚠️' : formatTimes(this.state.formData.finish_time)}</div>
              </div>

              <div className="column is-one-third">
                <div>Raw time: {!this.state.formData.raw_time ? '⚠️' : formatTimes(this.state.formData.raw_time)}</div>
              </div>

            </div>
          </div>

        </div>
      </section>
    )
  }
}

export default CrewTimeEdit
