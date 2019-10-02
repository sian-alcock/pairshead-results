import React from 'react'
import TimeLoader from '../common/ImportTimeData'
import ClubEventLoader from '../common/ImportClubEventData'
import CrewLoader from '../common/ImportCrewData'
import CompetitorLoader from '../common/ImportCompetitorData'

class ImportData extends React.Component {


  render() {

    return (
      <section className="section">
        <div className="container">

          <div className="columns">
            <div className="column">
              <ClubEventLoader/>
            </div>
            <div className="column left">
              This button gets the clubs, events and bands from BROE.  Note:  Data is deleted before importing.
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <CrewLoader/>
            </div>
            <div className="column left">
              This button gets the crew data from BROE.  Note:  Data is deleted before importing.
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <CompetitorLoader/>
            </div>
            <div className="column left">
              This button gets the competitor data from BROE.  Note:  Data is deleted before importing.
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <TimeLoader/>
            </div>
            <div className="column left">
              This button imports data from a CSV file that needs to be saved in the project folder ..results / csv.  Note:  Data is deleted before importing.
            </div>
          </div>


        </div>
      </section>
    )
  }
}

export default ImportData
